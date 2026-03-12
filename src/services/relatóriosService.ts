import { FreightRecord, RastreamentoRecord, FilterState } from '@/src/types';
import { supabase } from '@/src/services/supabase/client';
import { ORIGIN_MAP, REVERSE_ORIGIN_MAP, SEGMENTS } from '@/src/types';
import { normalizeOrigin } from '@/src/utils/originNormalizer';
import { collection, query, getDocs, orderBy, limit, where } from 'firebase/firestore';
import { db } from '@/src/firebase';

export type MergedRecord = FreightRecord & RastreamentoRecord;

export const relatóriosService = {
  // Buscar dados cruzados de Viagens e Rastreamento
  getMergedData: async (filters: FilterState): Promise<MergedRecord[]> => {
    try {
      // Buscar TODOS os dados de rastreamento primeiro (sem filtros de origem que pode ser restritivo)
      const rastreamentoCol = collection(db, 'rastreamento');
      let rastQuery: any = query(rastreamentoCol, orderBy('data', 'desc'), limit(5000));

      // Aplicar apenas filtros de data
      if (filters.ano && filters.periodo) {
        const month = filters.periodo.padStart(2, '0');
        const startDate = `${filters.ano}-${month}-01`;
        const lastDay = new Date(parseInt(filters.ano), parseInt(month), 0).getDate();
        const endDate = `${filters.ano}-${month}-${lastDay}`;
        rastQuery = query(rastreamentoCol,
          where('data', '>=', startDate),
          where('data', '<=', endDate),
          orderBy('data', 'desc'),
          limit(5000)
        );
      } else if (filters.ano) {
        rastQuery = query(rastreamentoCol,
          where('data', '>=', `${filters.ano}-01-01`),
          where('data', '<=', `${filters.ano}-12-31`),
          orderBy('data', 'desc'),
          limit(5000)
        );
      }

      const rastSnapshot = await getDocs(rastQuery);
      const rastreamentoData = rastSnapshot.docs
        .filter(doc => {
          const data = doc.data() as any;
          return data.nf && String(data.nf).trim(); // Filtrar apenas com nf preenchido
        })
        .map(doc => {
          const data = doc.data() as any;
          return {
            id: doc.id,
            ...data
          } as RastreamentoRecord;
        });

      console.log('Rastreamento data fetched:', rastreamentoData.length);

      // Buscar dados de viagens do Supabase com paginação para garantir todos os dados
      let allFreightData: any[] = [];
      let page = 0;
      const pageSize = 1000;
      let hasMore = true;

      while (hasMore) {
        let freightQuery: any = supabase.from('frete_geral').select('*');

        if (filters.ano && filters.periodo) {
          const month = parseInt(filters.periodo);
          if (!isNaN(month)) {
            const startDate = `${filters.ano}-${month.toString().padStart(2, '0')}-01`;
            const lastDay = new Date(parseInt(filters.ano), month, 0).getDate();
            const endDate = `${filters.ano}-${month.toString().padStart(2, '0')}-${lastDay}`;
            freightQuery = freightQuery.gte('DATA', startDate).lte('DATA', endDate);
          }
        } else if (filters.ano) {
          const startDate = `${filters.ano}-01-01`;
          const endDate = `${filters.ano}-12-31`;
          freightQuery = freightQuery.gte('DATA', startDate).lte('DATA', endDate);
        }

        if (filters.unidade) {
          const originCode = REVERSE_ORIGIN_MAP[filters.unidade] || filters.unidade;
          freightQuery = freightQuery.eq('ORIGEM', originCode);
        } else if (filters.segmento) {
          const unidades = SEGMENTS[filters.segmento as keyof typeof SEGMENTS];
          console.log(`Segment ${filters.segmento} units:`, unidades);
          if (unidades && unidades.length > 0) {
            const mappedUnidades = unidades.map(u => REVERSE_ORIGIN_MAP[u] || u);
            console.log('Mapped origins for filter:', mappedUnidades);
            freightQuery = freightQuery.in('ORIGEM', mappedUnidades);
          }
        }

        // Aplicar paginação
        freightQuery = freightQuery.range(page * pageSize, (page + 1) * pageSize - 1);

        const { data: pageData, error: freightError } = await freightQuery;

        if (freightError) {
          console.error('Erro ao buscar dados de viagem:', freightError);
          break;
        }

        if (!pageData || pageData.length === 0) {
          hasMore = false;
          break;
        }

        allFreightData = [...allFreightData, ...pageData];
        console.log(`Fetched page ${page}: ${pageData.length} records, total: ${allFreightData.length}`);

        if (pageData.length < pageSize) {
          hasMore = false;
        } else {
          page++;
        }
      }

      const freightData = allFreightData;

      if (!freightData || freightData.length === 0) {
        console.log('No freight data found');
        return [];
      }

      console.log('✓ Total freight data fetched:', freightData.length);

      // Mapear dados de viagem
      const mappedFreightData: FreightRecord[] = freightData
        .filter((item: any) => item['NOTA']) // Filtrar apenas registros com nota
        .map((item: any) => {
          const rawOrigem = String(item['ORIGEM'] || '');
          const mappedOrigem = normalizeOrigin(ORIGIN_MAP[rawOrigem] || rawOrigem);

          return {
            id: item['id'] || Math.random().toString(),
            origem: mappedOrigem,
            data: item['DATA'] || '',
            pedido: item['PEDIDO'] || '',
            nota: String(item['NOTA'] || '').trim(),
            cliente: item['CLIENTE'] || '',
            cidade: item['CIDADE'] || '',
            frota: item['FROTA'] || '',
            motorista: item['MOTORISTA'] || '',
            tipo_frete: item['TIPO FRETE'] || '',
            material: item['MATERIAL'] || '',
            volume: Number(item['VOLUME']) || 0,
            valor: Number(item['VALOR']) || 0,
            created_at: item['DATA'] || new Date().toISOString(),
          };
        });

      console.log('Freight data fetched and mapped:', mappedFreightData.length);

      // Cruzar dados: encontrar rastreamento pela nota (nf) - caso insensível
      const mergedData: MergedRecord[] = mappedFreightData
        .map(freight => {
          const nota = String(freight.nota).trim().toLowerCase();

          if (!nota) return null; // Skip se não houver nota

          const rasteamento = rastreamentoData.find(r => {
            const nf = String(r.nf).trim().toLowerCase();
            return nf === nota;
          });

          if (rasteamento) {
            console.log('✓ Match found:', freight.nota, '=', rasteamento.nf);
            return {
              ...rasteamento,
              ...freight,
            };
          }
          return null;
        })
        .filter((item): item is MergedRecord => item !== null);

      console.log('✓ Final merged data count:', mergedData.length);
      return mergedData;
    } catch (error) {
      console.error('Erro ao buscar dados cruzados:', error);
      return [];
    }
  },
};

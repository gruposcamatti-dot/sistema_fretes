import { useState, useEffect } from 'react';
import { supabase } from '@/src/services/supabase/client';
import { FreightRecord, FilterState, SEGMENTS } from '@/src/types';

export const useFreightData = (filters: FilterState, trigger: number) => {
  const [data, setData] = useState<FreightRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      let allData: any[] = [];
      let hasMore = true;
      let page = 0;
      const pageSize = 1000;

      while (hasMore) {
        let query = supabase.from('frete_geral').select('*').range(page * pageSize, (page + 1) * pageSize - 1);

        // Apply filters
        if (filters.ano && filters.periodo) {
          const month = parseInt(filters.periodo);
          if (!isNaN(month)) {
            const startDate = `${filters.ano}-${month.toString().padStart(2, '0')}-01`;
            const lastDay = new Date(parseInt(filters.ano), month, 0).getDate();
            const endDate = `${filters.ano}-${month.toString().padStart(2, '0')}-${lastDay}`;
            query = query.gte('DATA', startDate).lte('DATA', endDate);
          }
        } else if (filters.ano) {
          const startDate = `${filters.ano}-01-01`;
          const endDate = `${filters.ano}-12-31`;
          query = query.gte('DATA', startDate).lte('DATA', endDate);
        }

        if (filters.unidade) {
          query = query.eq('ORIGEM', filters.unidade);
        } else if (filters.segmento) {
          const unidades = SEGMENTS[filters.segmento as keyof typeof SEGMENTS];
          if (unidades) {
            query = query.in('ORIGEM', unidades);
          }
        }

        const { data: result, error: supabaseError } = await query;

        if (supabaseError) throw supabaseError;
        
        if (result && result.length > 0) {
          allData = [...allData, ...result];
          if (result.length < pageSize) {
            hasMore = false;
          } else {
            page++;
          }
        } else {
          hasMore = false;
        }
      }
      
      // Map the result to match FreightRecord type
      let mappedData: FreightRecord[] = allData.map((item: any) => ({
        id: item['eu ia'] || Math.random().toString(),
        origem: item['ORIGEM'] || '',
        data: item['DATA'] || '',
        frota: item['FROTA'] || '',
        motorista: item['MOTORISTA'] || '',
        tipo_frete: item['TIPO FRETE'] || '',
        volume: Number(item['VOLUME']) || 0,
        valor: Number(item['VALOR']) || 0,
        created_at: item['DATA'] || new Date().toISOString(),
      }));

      // JS fallback filter for month if year is not selected
      if (!filters.ano && filters.periodo) {
        const monthStr = filters.periodo.padStart(2, '0');
        mappedData = mappedData.filter(item => {
          if (!item.data) return false;
          // Assuming date format is YYYY-MM-DD or similar ISO string
          const parts = item.data.split('-');
          if (parts.length >= 2) {
            return parts[1] === monthStr;
          }
          // Fallback parsing
          const dateObj = new Date(item.data);
          return !isNaN(dateObj.getTime()) && (dateObj.getMonth() + 1).toString().padStart(2, '0') === monthStr;
        });
      }
      
      setData(mappedData);
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (trigger === 0) {
      setLoading(false);
      return;
    }

    // Only fetch if Supabase is configured
    if (import.meta.env.VITE_SUPABASE_URL) {
      fetchData();
    } else {
      // Mock data if no Supabase config
      setLoading(true);
      setTimeout(() => {
        setData(generateMockData());
        setLoading(false);
      }, 500);
    }
  }, [trigger]);

  const refetch = () => {
    if (trigger === 0) return; // Don't refetch if haven't generated yet
    
    if (import.meta.env.VITE_SUPABASE_URL) {
      fetchData();
    } else {
      setLoading(true);
      setTimeout(() => {
        setData(generateMockData());
        setLoading(false);
      }, 500);
    }
  };

  return { data, loading, error, refetch };
};

// Helper to generate mock data for preview when Supabase is not connected
function generateMockData(): FreightRecord[] {
  const mock: FreightRecord[] = [];
  const origins = Object.values(SEGMENTS).flat();
  const frotas = ['Frota A', 'Frota B', 'Frota C', 'Frota D'];
  const motoristas = ['João Silva', 'Pedro Santos', 'Marcos Oliveira', 'José Souza'];
  const tipos = ['Granel', 'Saca', 'Líquido'];

  for (let i = 0; i < 100; i++) {
    const origin = origins[Math.floor(Math.random() * origins.length)];
    // Random date in 2025
    const month = Math.floor(Math.random() * 12) + 1;
    const day = Math.floor(Math.random() * 28) + 1;
    const date = `2025-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    
    mock.push({
      id: `mock-${i}`,
      origem: origin,
      data: date,
      frota: frotas[Math.floor(Math.random() * frotas.length)],
      motorista: motoristas[Math.floor(Math.random() * motoristas.length)],
      tipo_frete: tipos[Math.floor(Math.random() * tipos.length)],
      volume: Math.floor(Math.random() * 50) + 10,
      valor: Math.floor(Math.random() * 5000) + 1000,
      created_at: new Date().toISOString(),
    });
  }
  return mock;
}

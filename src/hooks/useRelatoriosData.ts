import { useState, useEffect } from 'react';
import { FilterState } from '@/src/types';
import { relatoriosService, MergedRecord } from '@/src/services/relatoriosService';
import { frotasService } from '@/src/services/frotasService';
import { getSegmentByOrigin } from '@/src/utils/originNormalizer';

export type FrotaSummary = {
  frota: string;
  tipo: string;
  segmento: string | null;
  origem: string;
  viagensRealizadas: number;
  volumeTransportado: number;
  tempoMedioViagem: number;
  tempoMedioDescarregamento: number;
  totalKmRodado: number;
  totalKmDiferenca: number;
};

export type UnidadeSummary = {
  unidade: string;
  totalKmDiferenca: number;
};

export type UnidadeTimeSummary = {
  unidade: string;
  tempoMedioViagem: number;
  tempoMedioDescarregamento: number;
  viagensRealizadas: number;
};

export type RelatoriosKPIs = {
  tempoMedioViagem: number;
  tempoMedioDescarregamento: number;
  totalKmDiferenca: number;
  totalKmRodado: number;
  eficienciaRota: number;
  faturamentoPorKm: number;
  faturamentoPorViagem: number;
  viagensPorCaminhao: number;
  volumePorViagem: number;
  percentualEconomia: number;
};

export const useRelatoriosData = (filters: FilterState, trigger: number) => {
  const [data, setData] = useState<MergedRecord[]>([]);
  const [kpis, setKpis] = useState<RelatoriosKPIs>({
    tempoMedioViagem: 0,
    tempoMedioDescarregamento: 0,
    totalKmDiferenca: 0,
    totalKmRodado: 0,
    eficienciaRota: 0,
    faturamentoPorKm: 0,
    faturamentoPorViagem: 0,
    viagensPorCaminhao: 0,
    volumePorViagem: 0,
    percentualEconomia: 0,
  });
  const [frotaSummary, setFrotaSummary] = useState<FrotaSummary[]>([]);
  const [unidadeSummary, setUnidadeSummary] = useState<UnidadeSummary[]>([]);
  const [unidadeTimeSummary, setUnidadeTimeSummary] = useState<UnidadeTimeSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [mergedData, frotasDB] = await Promise.all([
          relatoriosService.getMergedData(filters),
          frotasService.getFrotas()
        ]);

        // Criar mapa de tipos de frota para busca rápida
        const fleetTypeMap = new Map<string, string>();
        frotasDB.forEach(f => {
          fleetTypeMap.set(f.frota.toString(), f.tipo || '—');
        });

        const getNormalizedFleetType = (frotaNum: string) => {
          if (!frotaNum || frotaNum === 'Sem frota') return '—';
          // Normalização: se tem 3 dígitos, adiciona "35" na frente
          const normalized = frotaNum.length === 3 ? `35${frotaNum}` : frotaNum;
          return fleetTypeMap.get(normalized) || '—';
        };

        setData(mergedData);

        if (mergedData.length === 0) {
          setKpis({
            tempoMedioViagem: 0,
            tempoMedioDescarregamento: 0,
            totalKmDiferenca: 0,
            totalKmRodado: 0,
            eficienciaRota: 0,
            faturamentoPorKm: 0,
            faturamentoPorViagem: 0,
            viagensPorCaminhao: 0,
            volumePorViagem: 0,
            percentualEconomia: 0,
          });
          setFrotaSummary([]);
          setUnidadeSummary([]);
          setUnidadeTimeSummary([]);
          return;
        }

        // Calcular KPIs
        const tempoMedioViagem =
          mergedData.reduce((acc, r) => {
            const time = parseTimeString(r.tempo_viagem);
            return acc + time;
          }, 0) / mergedData.length;

        const tempoMedioDescarregamento =
          mergedData.reduce((acc, r) => {
            const time = parseTimeString(r.tempo_descarregamento);
            return acc + time;
          }, 0) / mergedData.length;

        const totalKmDiferenca = mergedData.reduce((acc, r) => acc + (r.km_diferenca || 0), 0);
        const totalKmRodado = mergedData.reduce((acc, r) => acc + (r.km_rodado || 0), 0);
        const totalFaturamento = mergedData.reduce((acc, r) => acc + (r.valor || 0), 0);
        const totalVolume = mergedData.reduce((acc, r) => acc + (r.volume || 0), 0);
        const totalViagens = mergedData.length;
        const totalFrotas = new Set(mergedData.map(r => r.frota).filter(Boolean)).size || 1;

        setKpis({
          tempoMedioViagem,
          tempoMedioDescarregamento,
          totalKmDiferenca,
          totalKmRodado,
          eficienciaRota: totalKmRodado > 0 ? ((totalKmRodado + totalKmDiferenca) / totalKmRodado) * 100 : 0,
          faturamentoPorKm: totalKmRodado > 0 ? totalFaturamento / totalKmRodado : 0,
          faturamentoPorViagem: totalViagens > 0 ? totalFaturamento / totalViagens : 0,
          viagensPorCaminhao: totalFrotas > 0 ? totalViagens / totalFrotas : 0,
          volumePorViagem: totalViagens > 0 ? totalVolume / totalViagens : 0,
          percentualEconomia: totalKmRodado > 0 ? (totalKmDiferenca / totalKmRodado) * 100 : 0,
        });

        // Calcular resumo por frota
        const frotaMap = new Map<string, FrotaSummary>();
        mergedData.forEach(record => {
          const frota = record.frota || 'Sem frota';
          if (!frotaMap.has(frota)) {
            frotaMap.set(frota, {
              frota,
              tipo: getNormalizedFleetType(frota),
              segmento: getSegmentByOrigin(record.origem),
              origem: record.origem || 'Sem origem',
              viagensRealizadas: 0,
              volumeTransportado: 0,
              tempoMedioViagem: 0,
              tempoMedioDescarregamento: 0,
              totalKmRodado: 0,
              totalKmDiferenca: 0,
            });
          }

          const summary = frotaMap.get(frota)!;
          summary.viagensRealizadas += 1;
          summary.volumeTransportado += record.volume || 0;
          summary.tempoMedioViagem += parseTimeString(record.tempo_viagem);
          summary.tempoMedioDescarregamento += parseTimeString(record.tempo_descarregamento);
          summary.totalKmRodado += record.km_rodado || 0;
          summary.totalKmDiferenca += record.km_diferenca || 0;
        });

        // Calcular médias e ordenar
        const frotaArray = Array.from(frotaMap.values()).map(summary => ({
          ...summary,
          tempoMedioViagem: summary.tempoMedioViagem / summary.viagensRealizadas,
          tempoMedioDescarregamento: summary.tempoMedioDescarregamento / summary.viagensRealizadas,
        }));

        frotaArray.sort((a, b) => b.totalKmDiferenca - a.totalKmDiferenca);
        setFrotaSummary(frotaArray);

        // Calcular resumo por unidade
        const unidadeMap = new Map<string, number>();
        mergedData.forEach(record => {
          const unidade = record.origem || 'Sem unidade';
          const current = unidadeMap.get(unidade) || 0;
          unidadeMap.set(unidade, current + (record.km_diferenca || 0));
        });

        const unidadeArray = Array.from(unidadeMap.entries())
          .map(([unidade, totalKmDiferenca]) => ({ 
            unidade: summarizeUnitName(unidade), 
            totalKmDiferenca 
          }))
          .sort((a, b) => b.totalKmDiferenca - a.totalKmDiferenca);

        setUnidadeSummary(unidadeArray);

        // Calcular resumo de tempos por unidade
        const unidadeTimeMap = new Map<string, { tempoViagem: number; tempoDesc: number; count: number }>();
        mergedData.forEach(record => {
          const unidade = record.origem || 'Sem unidade';
          const current = unidadeTimeMap.get(unidade) || { tempoViagem: 0, tempoDesc: 0, count: 0 };
          current.tempoViagem += parseTimeString(record.tempo_viagem);
          current.tempoDesc += parseTimeString(record.tempo_descarregamento);
          current.count += 1;
          unidadeTimeMap.set(unidade, current);
        });

        const unidadeTimeArray: UnidadeTimeSummary[] = Array.from(unidadeTimeMap.entries())
          .map(([unidade, data]) => ({
            unidade: summarizeUnitName(unidade),
            tempoMedioViagem: data.tempoViagem / data.count,
            tempoMedioDescarregamento: data.tempoDesc / data.count,
            viagensRealizadas: data.count,
          }))
          .sort((a, b) => b.tempoMedioViagem - a.tempoMedioViagem);

        setUnidadeTimeSummary(unidadeTimeArray);
      } catch (err) {
        console.error('Erro ao buscar dados de relatórios:', err);
        setError('Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters, trigger]);

  return { data, kpis, frotaSummary, unidadeSummary, unidadeTimeSummary, loading, error };
};

// Helper para encurtar nomes de unidades (pega o que vem depois do último '-')
function summarizeUnitName(name: string): string {
  if (!name.includes('-')) return name;
  const parts = name.split('-');
  return parts[parts.length - 1].trim();
}

// Helper para converter tempo em minutos (formato HH:MM ou HH:MM:SS)
function parseTimeString(timeStr: string | undefined): number {
  if (!timeStr) return 0;
  const parts = timeStr.split(':').map(p => parseInt(p) || 0);
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 3) {
    return parts[0] * 60 + parts[1] + parts[2] / 60;
  }
  return 0;
}

// Helper para converter minutos de volta para formato HH:MM
export function formatTimeFromMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return `${hours}h ${mins}m`;
}

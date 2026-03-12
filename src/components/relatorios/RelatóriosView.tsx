import React, { useState } from 'react';
import { FilterState } from '@/src/types';
import { useRelatoriosData } from '@/src/hooks/useRelatoriosData';
import { RelatóriosFilters } from './RelatóriosFilters';
import { RelatóriosKPIs } from './RelatóriosKPIs';
import { RelatóriosCharts } from './RelatóriosCharts';
import { RelatóriosTable } from './RelatóriosTable';
import { Loader2 } from 'lucide-react';

export const RelatóriosView = () => {
  const [filters, setFilters] = useState<FilterState>({
    periodo: '',
    ano: new Date().getFullYear().toString(),
    segmento: '',
    unidade: '',
  });
  const [trigger, setTrigger] = useState(0);

  const { kpis, frotaSummary, unidadeSummary, unidadeTimeSummary, loading, error } = useRelatoriosData(filters, trigger);

  const handleGenerate = () => {
    setTrigger(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <RelatóriosFilters
        filters={filters}
        setFilters={setFilters}
        onGenerate={handleGenerate}
        loading={loading}
      />

      {/* Loading State */}
      {loading && trigger > 0 && (
        <div className="flex flex-col items-center justify-center h-64 bg-slate-50 border border-slate-200 border-dashed rounded-2xl">
          <Loader2 className="w-8 h-8 animate-spin text-amber-500 mb-4" />
          <p className="text-slate-500 font-medium">Gerando relatório...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl">
          <p className="font-semibold">Erro ao gerar relatório</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Dashboard Content */}
      {!loading && trigger > 0 && !error && (
        <div className="space-y-6 animate-in fade-in duration-500">
          {/* KPIs Cards */}
          <RelatóriosKPIs kpis={kpis} />

          {/* Charts */}
          {(unidadeSummary.length > 0 || frotaSummary.length > 0 || unidadeTimeSummary.length > 0) && (
            <RelatóriosCharts 
              unidadeSummary={unidadeSummary} 
              frotaSummary={frotaSummary} 
              unidadeTimeSummary={unidadeTimeSummary}
            />
          )}

          {/* Table */}
          {frotaSummary.length > 0 ? (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">Resumo por Frota</h2>
                <p className="text-sm text-slate-600">
                  Dados detalhados das frotas, organizados pela maior diferença de KM
                </p>
              </div>
              <RelatóriosTable data={frotaSummary} />
            </div>
          ) : (
            trigger > 0 && (
              <div className="p-8 bg-slate-50 border border-slate-200 rounded-2xl text-center">
                <p className="text-slate-600 font-medium">
                  Nenhum dado encontrado com os filtros selecionados
                </p>
                <p className="text-sm text-slate-500 mt-2">
                  Altere os filtros e tente novamente
                </p>
              </div>
            )
          )}
        </div>
      )}

      {/* Initial State */}
      {trigger === 0 && !loading && (
        <div className="relative overflow-hidden p-12 bg-white border border-slate-200 rounded-3xl flex flex-col items-center justify-center text-center shadow-sm min-h-[400px]">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600"></div>
          
          <div className="w-24 h-24 bg-amber-50 rounded-3xl flex items-center justify-center mb-6 rotate-3 shadow-inner">
            <span className="text-5xl">📊</span>
          </div>
          
          <h3 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">
            Gere um Relatório Customizado
          </h3>
          <p className="text-slate-500 max-w-md text-lg leading-relaxed">
            Selecione os filtros acima e clique no botão <span className="text-amber-600 font-bold">"Gerar Relatório"</span> para visualizar os indicadores de performance da sua operação.
          </p>
          
          <div className="mt-10 flex gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-400"></div> Tempos Médios
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-400"></div> KM Ganho
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400"></div> Resumo Frota
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

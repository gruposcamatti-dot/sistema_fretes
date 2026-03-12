import React, { useState } from 'react';
import { FilterState, SEGMENTS, ORIGIN_MAP } from '@/src/types';
import { Calendar, MapPin, Filter, Play } from 'lucide-react';
import { getSegmentByOrigin } from '@/src/utils/originNormalizer';

type RelatoriosFiltersProps = {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  onGenerate: () => void;
  loading: boolean;
};

export const RelatoriosFilters = ({ filters, setFilters, onGenerate, loading }: RelatoriosFiltersProps) => {
  const unidades = filters.segmento 
    ? (SEGMENTS[filters.segmento as keyof typeof SEGMENTS] || [])
    : [];

  const handleChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    
    // If segment changes, clear unit
    if (key === 'segmento') {
      newFilters.unidade = '';
    }
    
    // Auto-detect segmento when unidade is selected (if somehow accessible/enabled)
    if (key === 'unidade' && value) {
      const segment = getSegmentByOrigin(value);
      if (segment) {
        newFilters.segmento = segment;
      }
    }
    
    setFilters(newFilters);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-white">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-50/50 rounded-lg border border-amber-100/50">
            <Filter className="w-4 h-4 text-amber-600" strokeWidth={2} />
          </div>
          <h2 className="text-xs font-display font-bold text-slate-700 uppercase tracking-widest">Filtros de Análise</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Mês (Período) */}
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1.5">Mês</label>
          <select
            className="w-full bg-slate-100 border-transparent text-slate-700 text-sm rounded-xl px-3 py-3 outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 hover:bg-slate-200/70 transition-all duration-200 cursor-pointer appearance-none"
            value={filters.periodo}
            onChange={(e) => handleChange('periodo', e.target.value)}
            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
          >
            <option value="">Todos os Meses</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
              <option key={month} value={month.toString()}>
                {new Date(2024, month - 1).toLocaleDateString('pt-BR', { month: 'long' }).charAt(0).toUpperCase() + new Date(2024, month - 1).toLocaleDateString('pt-BR', { month: 'long' }).slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Ano */}
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1.5">Ano</label>
          <select
            className="w-full bg-slate-100 border-transparent text-slate-700 text-sm rounded-xl px-3 py-3 outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 hover:bg-slate-200/70 transition-all duration-200 cursor-pointer appearance-none"
            value={filters.ano}
            onChange={(e) => handleChange('ano', e.target.value)}
            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
          >
            <option value="">Todos os Anos</option>
            {Array.from({ length: 5 }, (_, i) => 2024 + i).map((year) => (
                <option key={year} value={year.toString()}>
                  {year}
                </option>
              ))}
          </select>
        </div>

        {/* Segmento */}
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1.5">Segmento</label>
          <select
            className="w-full bg-slate-100 border-transparent text-slate-700 text-sm rounded-xl px-3 py-3 outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 hover:bg-slate-200/70 transition-all duration-200 cursor-pointer appearance-none"
            value={filters.segmento}
            onChange={(e) => handleChange('segmento', e.target.value)}
            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
          >
            <option value="">Todos os Segmentos</option>
            <option value="PEDREIRAS">Pedreiras</option>
            <option value="PORTOS">Portos</option>
            <option value="CONCRETEIRAS">Concreteiras</option>
            <option value="FABRICA_DE_TUBOS">Fábrica de Tubos</option>
          </select>
        </div>

        {/* Unidade */}
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1.5">Unidade</label>
          <select
            className="w-full bg-slate-100 border-transparent text-slate-700 text-sm rounded-xl px-3 py-3 outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 hover:bg-slate-200/70 transition-all duration-200 cursor-pointer appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
            value={filters.unidade}
            onChange={(e) => handleChange('unidade', e.target.value)}
            disabled={!filters.segmento}
            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
          >
            <option value="">{filters.segmento ? 'Todas as Unidades' : 'Selecione um segmento'}</option>
            {unidades.map((unidade) => (
              <option key={unidade} value={unidade}>
                {unidade}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onGenerate}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-yellow-500 text-slate-900 rounded-xl text-sm font-semibold hover:bg-yellow-600 hover:-translate-y-0.5 hover:shadow-lg active:scale-95 transition-all duration-200 shadow-sm shadow-yellow-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Play className="w-4 h-4" />
          )}
          Gerar Relatório
        </button>
      </div>
    </div>
  );
};

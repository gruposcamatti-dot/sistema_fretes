import React from 'react';
import { FilterState } from '@/src/types';
import { Filter, X, Loader2, Play } from 'lucide-react';

type RateiosFiltersProps = {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onGenerate: () => void;
  loading?: boolean;
};

export const RateiosFilters = ({ filters, setFilters, onGenerate, loading }: RateiosFiltersProps) => {

  const clearFilters = () => {
    setFilters({
      periodo: '',
      ano: '',
      segmento: '',
      unidade: '',
      motorista: '',
      frota: ''
    });
  };

  const hasActiveFilters = filters.periodo !== '' || filters.ano !== '';

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-white">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-50/50 rounded-lg border border-amber-100/50">
            <Filter className="w-4 h-4 text-amber-600" strokeWidth={2} />
          </div>
          <h2 className="text-xs font-display font-bold text-slate-700 uppercase tracking-widest">Filtros - Rateios por Motorista</h2>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs font-medium text-slate-500 hover:text-amber-600 flex items-center gap-1 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <X className="w-3 h-3" /> Limpar Filtros
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
        {/* Mês */}
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1.5">Mês</label>
          <select
            className="w-full bg-slate-100 border-transparent text-slate-700 text-sm rounded-xl px-3 py-3 outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 hover:bg-slate-200/70 transition-all duration-200 cursor-pointer appearance-none"
            value={filters.periodo}
            onChange={(e) => setFilters({ ...filters, periodo: e.target.value })}
          >
            <option value="">Todos os Meses</option>
            <option value="1">Janeiro</option>
            <option value="2">Fevereiro</option>
            <option value="3">Março</option>
            <option value="4">Abril</option>
            <option value="5">Maio</option>
            <option value="6">Junho</option>
            <option value="7">Julho</option>
            <option value="8">Agosto</option>
            <option value="9">Setembro</option>
            <option value="10">Outubro</option>
            <option value="11">Novembro</option>
            <option value="12">Dezembro</option>
          </select>
        </div>

        {/* Ano */}
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1.5">Ano</label>
          <select
            className="w-full bg-slate-100 border-transparent text-slate-700 text-sm rounded-xl px-3 py-3 outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 hover:bg-slate-200/70 transition-all duration-200 cursor-pointer appearance-none"
            value={filters.ano}
            onChange={(e) => setFilters({ ...filters, ano: e.target.value })}
          >
            <option value="">Todos os Anos</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
            <option value="2027">2027</option>
            <option value="2028">2028</option>
          </select>
        </div>

        {/* Action button */}
        <div className="flex justify-end pt-2">
            <button
            onClick={onGenerate}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-yellow-500 text-slate-900 rounded-xl text-sm font-semibold hover:bg-yellow-600 hover:-translate-y-0.5 hover:shadow-lg active:scale-95 transition-all duration-200 shadow-sm shadow-yellow-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            Gerar Rateios
            </button>
        </div>
      </div>
    </div>
  );
};

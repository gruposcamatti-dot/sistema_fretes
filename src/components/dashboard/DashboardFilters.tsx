import { FilterState, SEGMENTS } from '@/src/types';
import { Filter, X, Loader2, Play } from 'lucide-react';

type DashboardFiltersProps = {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onGenerate: () => void;
  loading?: boolean;
};

export const DashboardFilters = ({ filters, setFilters, onGenerate, loading }: DashboardFiltersProps) => {
  const handleSegmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, segmento: e.target.value, unidade: '' });
  };

  const clearFilters = () => {
    setFilters({
      periodo: '',
      ano: '',
      segmento: '',
      unidade: ''
    });
  };

  const hasActiveFilters = filters.periodo !== '' || filters.segmento !== '' || filters.unidade !== '';

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-white">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-50/50 rounded-lg border border-amber-100/50">
            <Filter className="w-4 h-4 text-amber-600" strokeWidth={2} />
          </div>
          <h2 className="text-xs font-display font-bold text-slate-700 uppercase tracking-widest">Filtros de Análise</h2>
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
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Ano */}
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1.5">Ano</label>
          <select 
            className="w-full bg-slate-100 border-transparent text-slate-700 text-sm rounded-xl px-3 py-3 outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 hover:bg-slate-200/70 transition-all duration-200 cursor-pointer appearance-none"
            value={filters.ano}
            onChange={(e) => setFilters({ ...filters, ano: e.target.value })}
            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
          >
            <option value="">Todos os Anos</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
            <option value="2027">2027</option>
            <option value="2028">2028</option>
          </select>
        </div>

        {/* Período */}
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1.5">Mês</label>
          <select 
            className="w-full bg-slate-100 border-transparent text-slate-700 text-sm rounded-xl px-3 py-3 outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 hover:bg-slate-200/70 transition-all duration-200 cursor-pointer appearance-none"
            value={filters.periodo}
            onChange={(e) => setFilters({ ...filters, periodo: e.target.value })}
            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
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

        {/* Segmento */}
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1.5">Segmento</label>
          <select 
            className="w-full bg-slate-100 border-transparent text-slate-700 text-sm rounded-xl px-3 py-3 outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 hover:bg-slate-200/70 transition-all duration-200 cursor-pointer appearance-none"
            value={filters.segmento}
            onChange={handleSegmentChange}
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
            className="w-full bg-slate-100 border-transparent text-slate-700 text-sm rounded-xl px-3 py-3 outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 hover:bg-slate-200/70 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed appearance-none"
            value={filters.unidade}
            onChange={(e) => setFilters({ ...filters, unidade: e.target.value })}
            disabled={!filters.segmento}
            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
          >
            <option value="">Todas as Unidades</option>
            {filters.segmento && SEGMENTS[filters.segmento as keyof typeof SEGMENTS]?.map((unidade) => (
              <option key={unidade} value={unidade}>{unidade}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          onClick={onGenerate}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-yellow-500 text-slate-900 rounded-xl text-sm font-semibold hover:bg-yellow-600 hover:-translate-y-0.5 hover:shadow-lg active:scale-95 transition-all duration-200 shadow-sm shadow-yellow-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          Gerar Dashboard
        </button>
      </div>
    </div>
  );
};

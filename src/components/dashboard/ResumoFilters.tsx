import React from 'react';
import { FilterState, SEGMENTS } from '@/src/types';
import { Filter, X, Loader2, Play } from 'lucide-react';
import { useDriverFleetOptions } from '@/src/hooks/useDriverFleetOptions';

type ResumoFiltersProps = {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onGenerate: () => void;
  loading?: boolean;
};

export const ResumoFilters = ({ filters, setFilters, onGenerate, loading }: ResumoFiltersProps) => {
  const { motoristas, frotas, loading: optionsLoading } = useDriverFleetOptions();

  // Tipo filter local to ResumoFilters (motorista | frota), default to motorista
  const activeTipo = (filters.frota !== undefined && filters.motorista === undefined) ? 'frota' : 'motorista';

  const handleSegmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, segmento: e.target.value, unidade: '' });
  };

  const handleTipoChange = (tipo: 'motorista' | 'frota') => {
    if (tipo === 'motorista') {
        const newFilters = { ...filters };
        delete newFilters.frota;
        setFilters({ ...newFilters, motorista: '' });
    } else {
        const newFilters = { ...filters };
        delete newFilters.motorista;
        setFilters({ ...newFilters, frota: '' });
    }
  };

  const clearFilters = () => {
    setFilters({
      periodo: '',
      ano: '',
      segmento: '',
      unidade: '',
      motorista: '',
    });
  };

  const hasActiveFilters = filters.periodo !== '' || filters.segmento !== '' || filters.unidade !== '' || (filters.motorista && filters.motorista !== '') || (filters.frota && filters.frota !== '');

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-white">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-50/50 rounded-lg border border-amber-100/50">
            <Filter className="w-4 h-4 text-amber-600" strokeWidth={2} />
          </div>
          <h2 className="text-xs font-display font-bold text-slate-700 uppercase tracking-widest">Filtros - Resumo Específico</h2>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {/* Período (Mês) */}
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

        {/* Segmento */}
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1.5">Segmento</label>
          <select
            className="w-full bg-slate-100 border-transparent text-slate-700 text-sm rounded-xl px-3 py-3 outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 hover:bg-slate-200/70 transition-all duration-200 cursor-pointer appearance-none"
            value={filters.segmento}
            onChange={handleSegmentChange}
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
          >
            <option value="">Todas as Unidades</option>
            {filters.segmento && SEGMENTS[filters.segmento as keyof typeof SEGMENTS]?.map((unidade) => (
              <option key={unidade} value={unidade}>{unidade}</option>
            ))}
          </select>
        </div>

        {/* Tipo (Motorista ou Frota) */}
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1.5">Análise por:</label>
          <div className="flex gap-2">
            <button
                // Use a standard button visually styled as a toggle/select
                onClick={() => handleTipoChange('motorista')}
                className={`flex-1 text-sm py-2.5 rounded-xl font-medium transition-colors ${activeTipo === 'motorista' ? 'bg-amber-500 text-slate-900 shadow-sm' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
            >
                Motorista
            </button>
            <button
                onClick={() => handleTipoChange('frota')}
                className={`flex-1 text-sm py-2.5 rounded-xl font-medium transition-colors ${activeTipo === 'frota' ? 'bg-amber-500 text-slate-900 shadow-sm' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
            >
                Frota
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-end">
          {/* O Selecionador Dinâmico */}
          <div className="lg:w-full">
            <label className="block text-xs font-medium text-slate-500 mb-1.5">
                Selecione {activeTipo === 'motorista' ? 'o Motorista' : 'a Frota'}
            </label>
            <select
                className="w-full bg-slate-100 border-transparent text-slate-700 text-sm rounded-xl px-3 py-3 outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 hover:bg-slate-200/70 transition-all duration-200 cursor-pointer disabled:opacity-50 appearance-none"
                value={activeTipo === 'motorista' ? (filters.motorista || '') : (filters.frota || '')}
                onChange={(e) => {
                    const value = e.target.value;
                    if (activeTipo === 'motorista') {
                        setFilters({ ...filters, motorista: value });
                    } else {
                        setFilters({ ...filters, frota: value });
                    }
                }}
                disabled={optionsLoading}
            >
                <option value="">Todos {activeTipo === 'motorista' ? 'os Motoristas' : 'as Frotas'}</option>
                {activeTipo === 'motorista' ? (
                    motoristas.map((m) => <option key={m} value={m}>{m}</option>)
                ) : (
                    frotas.map((f) => <option key={f} value={f}>{f}</option>)
                )}
            </select>
          </div>

          <div className="flex justify-end pt-2">
            <button
            onClick={onGenerate}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-yellow-500 text-slate-900 rounded-xl text-sm font-semibold hover:bg-yellow-600 hover:-translate-y-0.5 hover:shadow-lg active:scale-95 transition-all duration-200 shadow-sm shadow-yellow-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            Gerar Resumo
            </button>
          </div>
      </div>
    </div>
  );
};

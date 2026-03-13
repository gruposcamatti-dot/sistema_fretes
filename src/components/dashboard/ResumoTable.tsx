import React, { useMemo, useState, useEffect } from 'react';
import { FreightRecord, FilterState } from '@/src/types';
import { Search, ArrowUpDown, Filter, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { motoristasService, Motorista } from '@/src/services/motoristasService';

type ResumoTableProps = {
  data: FreightRecord[];
  filters: FilterState;
};

type GroupedItem = {
  nome: string;
  segmento?: string;
  viagens: number;
  volume: number;
  faturamento: number;
};

export const ResumoTable = ({ data, filters }: ResumoTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: keyof GroupedItem; direction: 'asc' | 'desc' }>({
    key: 'faturamento',
    direction: 'desc'
  });
  
  const itemsPerPage = 10;

  const activeTipo = (filters.frota !== undefined && filters.motorista === undefined) ? 'frota' : 'motorista';

  const [dbMotoristas, setDbMotoristas] = useState<Motorista[]>([]);
  const [loadingMotoristas, setLoadingMotoristas] = useState(false);

  useEffect(() => {
    if (activeTipo === 'motorista') {
      const fetchMotoristas = async () => {
        try {
          setLoadingMotoristas(true);
          const motoristasList = await motoristasService.getMotoristas();
          setDbMotoristas(motoristasList);
        } catch (err) {
          console.error("Erro ao carregar motoristas do banco:", err);
        } finally {
          setLoadingMotoristas(false);
        }
      };
      fetchMotoristas();
    }
  }, [activeTipo]);

  const groupedData = useMemo(() => {
    const map = new Map<string, GroupedItem>();
    
    data.forEach(item => {
      const isRetira = (!item.motorista || item.motorista.trim() === '') && item.valor === 0;
      const key = activeTipo === 'motorista' 
        ? (item.motorista && item.motorista.trim() !== '' ? item.motorista : (isRetira ? 'Cliente Retira' : 'Sem Motorista')) 
        : (item.frota || 'Sem Frota');
      
      const existing = map.get(key);
      if (existing) {
        existing.viagens += 1;
        existing.volume += (item.volume || 0);
        existing.faturamento += (item.valor || 0);
      } else {
        // Encontra o segmento no banco do firebase, se aplicavel
        let segmentoMotorista = '';
        if (activeTipo === 'motorista' && item.motorista) {
            const dbMatch = dbMotoristas.find(m => 
                (m.motorista || '').trim().toLowerCase() === item.motorista.trim().toLowerCase()
            );
            if (dbMatch && dbMatch.segmento) {
                segmentoMotorista = dbMatch.segmento;
            }
        }

        map.set(key, {
          nome: key,
          segmento: segmentoMotorista,
          viagens: 1,
          volume: item.volume || 0,
          faturamento: item.valor || 0
        });
      }
    });
    
    return Array.from(map.values());
  }, [data, activeTipo, dbMotoristas]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatNumber = (value: number) => {
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Filter
  const filteredData = groupedData.filter(item => 
    item.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort
  const sortedData = [...filteredData].sort((a, b) => {
    const { key, direction } = sortConfig;
    if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
    if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  // Paginate
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const requestSort = (key: keyof GroupedItem) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const SortIcon = ({ columnKey }: { columnKey: keyof GroupedItem }) => {
    const isActive = sortConfig.key === columnKey;
    return (
      <ArrowUpDown className={`w-3.5 h-3.5 ml-1.5 inline-block transition-colors ${isActive ? 'text-amber-500' : 'text-slate-300 group-hover:text-slate-400'}`} />
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-white overflow-hidden flex flex-col mt-6">
      <div className="p-6 border-b border-slate-200/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-transparent">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-50/50 rounded-lg border border-amber-100/50">
            <Filter className="w-4 h-4 text-amber-600" strokeWidth={2} />
          </div>
          <h3 className="text-xs font-display font-bold text-slate-700 uppercase tracking-widest">
            {activeTipo === 'motorista' ? 'Detalhamento por Motorista' : 'Detalhamento por Frota'}
          </h3>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
          <input 
            type="text" 
            placeholder={`Buscar por ${activeTipo === 'motorista' ? 'motorista' : 'frota'}...`}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 hover:border-amber-300 transition-all duration-200 outline-none shadow-sm"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/60">
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100/50 hover:text-amber-600 group transition-colors duration-200" onClick={() => requestSort('nome')}>
                {activeTipo === 'motorista' ? 'Motorista / Segmento' : 'Frota'} <SortIcon columnKey="nome" />
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100/50 hover:text-amber-600 group transition-colors duration-200 text-right" onClick={() => requestSort('viagens')}>
                Viagens <SortIcon columnKey="viagens" />
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100/50 hover:text-amber-600 group transition-colors duration-200 text-right" onClick={() => requestSort('volume')}>
                Volume (t) <SortIcon columnKey="volume" />
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100/50 hover:text-amber-600 group transition-colors duration-200 text-right" onClick={() => requestSort('faturamento')}>
                Faturamento <SortIcon columnKey="faturamento" />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedData.length > 0 ? (
              paginatedData.map((item, idx) => (
                <tr key={`${item.nome}-${idx}`} className="hover:bg-slate-50/80 transition-colors duration-200 group">
                  <td className="px-6 py-4 text-sm text-slate-800 font-medium group-hover:text-amber-600 transition-colors">
                    {activeTipo === 'motorista' ? (
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600 group-hover:bg-amber-100 group-hover:text-amber-700 transition-colors">
                                {item.nome.split(' ').map(n => n[0]).join('').substring(0, 2)}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm text-slate-800 font-bold group-hover:text-amber-700 transition-colors">{item.nome}</span>
                                {item.segmento ? (
                                    <span className="text-xs font-medium text-slate-500 mt-0.5">{item.segmento}</span>
                                ) : (
                                    <span className="text-xs font-medium text-slate-400 mt-0.5 italic">Sem segmento</span>
                                )}
                            </div>
                        </div>
                    ) : item.nome}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 text-right font-medium group-hover:text-slate-900 transition-colors">
                    {item.viagens.toLocaleString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 text-right font-medium group-hover:text-slate-900 transition-colors">
                    {formatNumber(item.volume)}
                  </td>
                  <td className="px-6 py-4 text-sm text-right font-semibold text-slate-900 group-hover:text-amber-600 transition-colors">
                    {formatCurrency(item.faturamento)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center">
                    <Search className="w-8 h-8 text-slate-300 mb-3" />
                    <p className="text-base font-medium text-slate-600">Nenhum registro encontrado</p>
                    <p className="text-sm mt-1">Tente ajustar seus filtros de busca.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-slate-200/60 flex items-center justify-between bg-slate-50/50">
        <p className="text-sm text-slate-500">
          Mostrando <span className="font-medium text-slate-700">{sortedData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> a <span className="font-medium text-slate-700">{Math.min(currentPage * itemsPerPage, sortedData.length)}</span> de <span className="font-medium text-slate-700">{sortedData.length}</span> resultados
        </p>
        <div className="flex items-center gap-2">
          <button 
            className="p-2 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 hover:shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 transition-all duration-200 shadow-sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1 || totalPages === 0}
          >
            <ChevronLeft className="w-4 h-4 text-slate-600" />
          </button>
          <button 
            className="p-2 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 hover:shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 transition-all duration-200 shadow-sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            <ChevronRight className="w-4 h-4 text-slate-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

import { FreightRecord } from '@/src/types';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Search, ArrowUpDown, Filter } from 'lucide-react';

type FreightTableProps = {
  data: FreightRecord[];
};

export const FreightTable = ({ data }: FreightTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: keyof FreightRecord; direction: 'asc' | 'desc' } | null>(null);
  
  const itemsPerPage = 10;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    // Split the YYYY-MM-DD string to avoid timezone issues when creating Date object
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const [year, month, day] = parts;
      // Extract just the day part in case there's time information attached (e.g., "07T00:00:00")
      const cleanDay = day.split('T')[0];
      return `${cleanDay}/${month}/${year}`;
    }
    // Fallback for other formats
    return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const getBadgeStyle = (tipo: string) => {
    const type = tipo.toLowerCase();
    if (type.includes('granel')) return 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20';
    if (type.includes('saca')) return 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20';
    if (type.includes('líquido') || type.includes('liquido')) return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20';
    return 'bg-slate-50 text-slate-700 ring-1 ring-slate-600/20';
  };

  // Filter
  const filteredData = data.filter(record => 
    record.origem.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.motorista.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.frota.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig) return 0;
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

  const requestSort = (key: keyof FreightRecord) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const SortIcon = ({ columnKey }: { columnKey: keyof FreightRecord }) => {
    const isActive = sortConfig?.key === columnKey;
    return (
      <ArrowUpDown className={`w-3.5 h-3.5 ml-1.5 inline-block transition-colors ${isActive ? 'text-amber-500' : 'text-slate-300 group-hover:text-slate-400'}`} />
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-white overflow-hidden flex flex-col">
      <div className="p-6 border-b border-slate-200/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-transparent">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-50/50 rounded-lg border border-amber-100/50">
            <Filter className="w-4 h-4 text-amber-600" strokeWidth={2} />
          </div>
          <h3 className="text-xs font-display font-bold text-slate-700 uppercase tracking-widest">Histórico de Viagens</h3>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Buscar por origem, motorista..." 
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
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100/50 hover:text-amber-600 group transition-colors duration-200" onClick={() => requestSort('data')}>
                Data <SortIcon columnKey="data" />
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100/50 hover:text-amber-600 group transition-colors duration-200" onClick={() => requestSort('origem')}>
                Origem <SortIcon columnKey="origem" />
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100/50 hover:text-amber-600 group transition-colors duration-200" onClick={() => requestSort('frota')}>
                Frota <SortIcon columnKey="frota" />
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100/50 hover:text-amber-600 group transition-colors duration-200" onClick={() => requestSort('motorista')}>
                Motorista <SortIcon columnKey="motorista" />
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100/50 hover:text-amber-600 group transition-colors duration-200" onClick={() => requestSort('tipo_frete')}>
                Tipo <SortIcon columnKey="tipo_frete" />
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100/50 hover:text-amber-600 group transition-colors duration-200 text-right" onClick={() => requestSort('volume')}>
                Volume (t) <SortIcon columnKey="volume" />
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100/50 hover:text-amber-600 group transition-colors duration-200 text-right" onClick={() => requestSort('valor')}>
                Valor <SortIcon columnKey="valor" />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedData.length > 0 ? (
              paginatedData.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50/80 transition-colors duration-200 group">
                  <td className="px-6 py-4 text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{formatDate(record.data)}</td>
                  <td className="px-6 py-4 text-sm text-slate-800 font-medium group-hover:text-amber-600 transition-colors">{record.origem}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{record.frota}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600 group-hover:bg-amber-100 group-hover:text-amber-700 transition-colors">
                        {record.motorista.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </div>
                      {record.motorista}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${getBadgeStyle(record.tipo_frete)}`}>
                      {record.tipo_frete}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 text-right font-medium group-hover:text-slate-900 transition-colors">{record.volume}</td>
                  <td className="px-6 py-4 text-sm text-right font-semibold text-slate-900 group-hover:text-amber-600 transition-colors">
                    {formatCurrency(record.valor)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
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
          Mostrando <span className="font-medium text-slate-700">{(currentPage - 1) * itemsPerPage + 1}</span> a <span className="font-medium text-slate-700">{Math.min(currentPage * itemsPerPage, sortedData.length)}</span> de <span className="font-medium text-slate-700">{sortedData.length}</span> resultados
        </p>
        <div className="flex items-center gap-2">
          <button 
            className="p-2 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 hover:shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 transition-all duration-200 shadow-sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
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

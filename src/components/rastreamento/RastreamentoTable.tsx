import React, { useState } from 'react';
import { RastreamentoRecord } from '@/src/types';
import { rastreamentoService } from '@/src/services/rastreamentoService';
import { RastreamentoEditModal } from './RastreamentoEditModal';
import { 
  MapPin, Clock, Truck, Hash, FileText, 
  ChevronLeft, ChevronRight, Filter, Edit2, 
  Trash2, Square, CheckSquare, Trash, Loader2 
} from 'lucide-react';

type RastreamentoTableProps = {
  data: RastreamentoRecord[];
  onRefresh: () => void;
};

export const RastreamentoTable = ({ data, onRefresh }: RastreamentoTableProps) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeletingBulk, setIsDeletingBulk] = useState(false);
  const [editingRecord, setEditingRecord] = useState<RastreamentoRecord | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);

  const itemsPerPage = 100;
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

  const formatNumber = (val: number | undefined) => {
    if (val === undefined || val === null) return '-';
    return val.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    if (dateStr.includes('-')) {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
    }
    return dateStr;
  };

  const handleSelectOne = (id: string | undefined) => {
    if (!id) return;
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === paginatedData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedData.map(d => d.id).filter(Boolean) as string[]);
    }
  };

  const handleDeleteOne = async (id: string | undefined) => {
    if (!id || !window.confirm("Tem certeza que deseja excluir este registro?")) return;
    try {
      await rastreamentoService.deleteRastreamento(id);
      onRefresh();
    } catch (error) {
      alert("Erro ao excluir registro.");
    }
  };

  const handleDeleteBulk = async () => {
    if (selectedIds.length === 0 || !window.confirm(`Tem certeza que deseja excluir ${selectedIds.length} registros selecionados?`)) return;
    setIsDeletingBulk(true);
    try {
      await rastreamentoService.deleteBulkRastreamentos(selectedIds);
      setSelectedIds([]);
      onRefresh();
    } catch (error) {
      alert("Erro ao excluir registros em lote.");
    } finally {
      setIsDeletingBulk(false);
    }
  };

  const handleDeleteAll = async () => {
    if (data.length === 0) return;
    if (!window.confirm(`AVISO CRÍTICO: Você está prestes a excluir TODOS os ${data.length} registros desta lista. Esta ação não pode ser desfeita. Deseja continuar?`)) return;
    
    setIsDeletingAll(true);
    try {
      await rastreamentoService.deleteAll();
      setSelectedIds([]);
      onRefresh();
    } catch (error) {
      alert("Erro ao excluir todos os registros.");
    } finally {
      setIsDeletingAll(false);
    }
  };

  const handleEditClick = (record: RastreamentoRecord) => {
    setEditingRecord(record);
    setIsEditModalOpen(true);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col mt-6 relative">
      <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-display font-bold text-slate-800 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-emerald-600" />
            </div>
            Dados de Rastreamento
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Exibindo histórico de tempos logísticos e quilometragens.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {selectedIds.length > 0 && (
            <button
              onClick={handleDeleteBulk}
              disabled={isDeletingBulk}
              className="px-4 h-9 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg flex items-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-50"
            >
              {isDeletingBulk ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash className="w-3.5 h-3.5" />}
              Excluir Selecionados ({selectedIds.length})
            </button>
          )}

          {data.length > 0 && selectedIds.length === 0 && (
            <button
              onClick={handleDeleteAll}
              disabled={isDeletingAll}
              className="px-4 h-9 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 hover:border-rose-200 text-xs font-bold rounded-lg flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              {isDeletingAll ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
              Excluir Tudo
            </button>
          )}

          <div className="flex items-center gap-2 text-sm text-slate-600 font-medium bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
            <Filter className="w-4 h-4 text-slate-400" />
            <span>Total: {data.length.toLocaleString('pt-BR')} registros</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1100px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 w-10">
                <button onClick={handleSelectAll} className="p-1 rounded hover:bg-slate-200 transition-colors">
                  {selectedIds.length === paginatedData.length && paginatedData.length > 0 ? 
                    <CheckSquare className="w-4 h-4 text-amber-600" /> : 
                    <Square className="w-4 h-4 text-slate-400" />
                  }
                </button>
              </th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Origem</th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Data</th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Frota</th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Documento (NF/Pedido)</th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tempo Desc.</th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tempo Viag.</th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">KM Rodado</th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Km Dif.</th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedData.map((record) => (
              <tr key={record.id} className={`hover:bg-slate-50/80 transition-colors group ${selectedIds.includes(record.id || '') ? 'bg-amber-50/30' : ''}`}>
                <td className="p-4">
                  <button onClick={() => handleSelectOne(record.id)} className="p-1 rounded hover:bg-slate-200 transition-colors">
                    {selectedIds.includes(record.id || '') ? 
                      <CheckSquare className="w-4 h-4 text-amber-600" /> : 
                      <Square className="w-4 h-4 text-slate-300" />
                    }
                  </button>
                </td>
                <td className="p-4">
                  <span className="text-[11px] font-medium text-slate-600 leading-tight block max-w-[200px]">
                    {record.origem}
                  </span>
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-700 whitespace-nowrap">
                    {formatDate(record.data)}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center">
                      <Truck className="w-3 h-3 text-slate-500" />
                    </div>
                    <span className="text-sm font-semibold text-slate-900">{record.frota}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="inline-flex items-center gap-1 text-sm font-bold text-slate-700 font-mono">
                      <FileText className="w-3 h-3 text-slate-400" />
                      {record.nf || '-'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono ml-4">
                      Ped: {record.pedido || '-'}
                    </span>
                  </div>
                </td>
                <td className="p-4 text-sm text-slate-600 font-medium whitespace-nowrap">
                  <span className="inline-flex items-center gap-1">
                     <Clock className="w-3.5 h-3.5 text-emerald-500" />
                     {record.tempo_descarregamento}
                  </span>
                </td>
                <td className="p-4 text-sm text-slate-600 font-medium whitespace-nowrap">
                  <span className="inline-flex items-center gap-1">
                     <Clock className="w-3.5 h-3.5 text-amber-500" />
                     {record.tempo_viagem}
                  </span>
                </td>
                <td className="p-4 text-sm text-slate-700 font-semibold text-right">
                  {formatNumber(record.km_rodado)}
                </td>
                <td className="p-4 text-sm text-right">
                  <span className={`font-medium px-2 py-0.5 rounded ${
                    (record.km_diferenca || 0) > 0 ? 'text-emerald-700 bg-emerald-50' : 
                    (record.km_diferenca || 0) < 0 ? 'text-rose-700 bg-rose-50' : 
                    'text-slate-400 bg-slate-50'
                  }`}>
                    {formatNumber(record.km_diferenca)}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleEditClick(record)}
                      className="p-1.5 bg-slate-100 text-slate-500 hover:bg-amber-100 hover:text-amber-600 rounded-lg transition-all"
                      title="Editar"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteOne(record.id)}
                      className="p-1.5 bg-slate-100 text-slate-500 hover:bg-rose-100 hover:text-rose-600 rounded-lg transition-all"
                      title="Excluir"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {paginatedData.length === 0 && (
              <tr>
                <td colSpan={10} className="p-8 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center">
                    <MapPin className="w-8 h-8 text-slate-300 mb-2" />
                    <p>Nenhum dado de rastreamento encontrado.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <RastreamentoEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        record={editingRecord}
        onSuccess={onRefresh}
      />

      {totalPages > 1 && (
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Mostrando <span className="font-medium text-slate-900">{startIndex + 1}</span> a <span className="font-medium text-slate-900">{Math.min(startIndex + itemsPerPage, data.length)}</span> de <span className="font-medium text-slate-900">{data.length}</span> registros
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center px-4 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg">
              {currentPage} / {totalPages}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
;

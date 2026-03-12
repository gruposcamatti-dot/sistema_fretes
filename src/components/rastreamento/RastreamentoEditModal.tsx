import React, { useState } from 'react';
import { RastreamentoRecord } from '@/src/types';
import { rastreamentoService } from '@/src/services/rastreamentoService';
import { 
  X, Save, AlertCircle, Loader2, MapPin, 
  Calendar, Truck, FileText, Hash, Clock, 
  Navigation, Ruler 
} from 'lucide-react';

type RastreamentoEditModalProps = {
  isOpen: boolean;
  onClose: () => void;
  record: RastreamentoRecord | null;
  onSuccess: () => void;
};

export const RastreamentoEditModal = ({ isOpen, onClose, record, onSuccess }: RastreamentoEditModalProps) => {
  const [formData, setFormData] = useState<Partial<RastreamentoRecord>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (record) {
      setFormData({ ...record });
    }
  }, [record]);

  if (!isOpen || !record) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      if (!record.id) throw new Error("ID do registro não encontrado");
      
      // Filter out meta fields
      const { id, created_at, ...updateData } = formData as any;
      
      await rastreamentoService.updateRastreamento(record.id, updateData);
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Erro ao salvar:", err);
      setError(err.message || "Erro ao atualizar o registro");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-bold text-slate-800">Editar Registro - Rastreamento</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-5">
          <form onSubmit={handleSave} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            {/* Linha 1: Origem, Data, Frota (3 Colunas) */}
            <div className="grid grid-cols-12 gap-4 pb-5 border-b border-slate-50">
              <div className="col-span-6 space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Origem / Unidade</label>
                <input
                  type="text"
                  name="origem"
                  value={formData.origem || ''}
                  onChange={handleChange}
                  className="w-full h-11 px-4 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                />
              </div>
              <div className="col-span-3 space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Data</label>
                <input
                  type="date"
                  name="data"
                  value={formData.data || ''}
                  onChange={handleChange}
                  className="w-full h-11 px-4 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all font-mono"
                />
              </div>
              <div className="col-span-3 space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Frota</label>
                <input
                  type="text"
                  name="frota"
                  value={formData.frota || ''}
                  onChange={handleChange}
                  className="w-full h-11 px-4 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-bold text-amber-600 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Linha 2: Nota Fiscal, Pedido (2 Colunas) */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Nota Fiscal</label>
                <input
                  type="text"
                  name="nf"
                  value={formData.nf || ''}
                  onChange={handleChange}
                  className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Pedido</label>
                <input
                  type="text"
                  name="pedido"
                  value={formData.pedido || ''}
                  onChange={handleChange}
                  className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Linha 3: T. Desc., T. Viagem (2 Colunas) */}
            <div className="grid grid-cols-2 gap-4 pt-1">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">T. Desc.</label>
                <input
                  type="text"
                  name="tempo_descarregamento"
                  value={formData.tempo_descarregamento || ''}
                  onChange={handleChange}
                  placeholder="00:00:00"
                  className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-sm font-semibold font-mono focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">T. Viagem</label>
                <input
                  type="text"
                  name="tempo_viagem"
                  value={formData.tempo_viagem || ''}
                  onChange={handleChange}
                  placeholder="00:00:00"
                  className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-sm font-semibold font-mono focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Linha 4: KM Rodado, KM Diferença (2 Colunas) */}
            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-50">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Km Rodado</label>
                <input
                  type="number"
                  step="0.1"
                  name="km_rodado"
                  value={formData.km_rodado || ''}
                  onChange={handleChange}
                  className="w-full h-12 px-4 bg-amber-50/30 border border-amber-100 rounded-xl text-lg font-black text-slate-800 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all text-center"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Km Ganho</label>
                <input
                  type="number"
                  step="0.1"
                  name="km_diferenca"
                  value={formData.km_diferenca || ''}
                  onChange={handleChange}
                  className={`w-full h-12 px-4 bg-slate-50/50 border border-slate-200 rounded-xl text-lg font-black text-center focus:ring-2 focus:ring-amber-500/20 outline-none transition-all ${
                    Number(formData.km_diferenca) > 0 ? 'text-emerald-600' : 
                    Number(formData.km_diferenca) < 0 ? 'text-rose-600' : 
                    'text-slate-400'
                  }`}
                />
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 h-11 text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-10 h-11 bg-slate-900 hover:bg-black text-white text-sm font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-slate-900/10 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Salvar Alterações</span>
          </button>
        </div>
      </div>
    </div>
  );
};

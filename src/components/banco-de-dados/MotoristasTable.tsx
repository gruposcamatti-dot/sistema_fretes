import React, { useState } from 'react';
import { Search, Plus, Filter, Download, MoreVertical, X, Edit2, Trash2 } from 'lucide-react';

export const MotoristasTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Placeholder mock data specific to Motorista
  const [motoristas, setMotoristas] = useState([
    { id: '1', motorista: 'João Silva', funcao: 'Motorista de Rodo-trem', segmento: 'Portos' },
    { id: '2', motorista: 'Pedro Santos', funcao: 'Motorista de Caçamba', segmento: 'Pedreiras' },
    { id: '3', motorista: 'Marcos Oliveira', funcao: 'Motorista Truck', segmento: 'Concreteiras' },
    { id: '4', motorista: 'José Souza', funcao: 'Motorista de Bi-trem', segmento: 'Fábrica de Tubos' },
    { id: '5', motorista: 'Carlos Almeida', funcao: 'Motorista de Rodo-trem', segmento: 'Pedreiras' },
  ]);

  const [formData, setFormData] = useState({
    motorista: '',
    funcao: '',
    segmento: ''
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este motorista?')) {
      setMotoristas(motoristas.filter(m => m.id !== id));
      setSelectedItems(selectedItems.filter(item => item !== id));
    }
  };

  const handleBatchDelete = () => {
    if (window.confirm(`Tem certeza que deseja excluir ${selectedItems.length} motorista(s)?`)) {
      setMotoristas(motoristas.filter(m => !selectedItems.includes(m.id)));
      setSelectedItems([]);
    }
  };

  const handleEdit = (motorista: any) => {
    setFormData({
      motorista: motorista.motorista,
      funcao: motorista.funcao,
      segmento: motorista.segmento
    });
    setEditingId(motorista.id);
    setIsModalOpen(true);
  };

  const handleSelectAll = () => {
    if (selectedItems.length === motoristas.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(motoristas.map(m => m.id));
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim() !== '');
      
      // Skip header line if present (assuming the first line might be headers, but we can just process all and catch formatting issues)
      // Usually, CSV uses ; or , as separator. We try to infer or just use ; / ,
      const newMotoristas: typeof motoristas = [];
      
      lines.forEach((line, index) => {
        // basic parser: split by comma or semicolon
        const cols = line.split(/[;,]/);
        // Ex: A (motorista), B (função), C (segmento)
        if (cols.length >= 3) {
          const motorista = cols[0].trim();
          const funcao = cols[1].trim();
          const segmento = cols[2].trim();

          // Skip header row if it literally contains 'motorista'
          if (index === 0 && motorista.toLowerCase() === 'motorista') return;

          newMotoristas.push({
            id: Date.now().toString() + index, // unique ID
            motorista,
            funcao,
            segmento
          });
        }
      });

      if (newMotoristas.length > 0) {
        setMotoristas(prev => [...prev, ...newMotoristas]);
        alert(`${newMotoristas.length} motorista(s) importado(s) com sucesso!`);
      } else {
        alert("Não foi possível encontrar dados válidos no CSV. Verifique se as colunas estão separadas por vírgula ou ponto e vírgula e se existem três colunas (motorista, função, segmento).");
      }
      
      // reset file input
      event.target.value = '';
    };

    reader.readAsText(file);
  };

  const getBadgeStyle = (segmento: string) => {
    const type = segmento.toLowerCase();
    if (type.includes('pedreiras')) return 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20';
    if (type.includes('concreteiras')) return 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20';
    if (type.includes('portos')) return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20';
    if (type.includes('fábrica')) return 'bg-purple-50 text-purple-700 ring-1 ring-purple-600/20';
    return 'bg-slate-50 text-slate-700 ring-1 ring-slate-600/20';
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden flex flex-col">
      <div className="p-6 border-b border-slate-200/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-transparent">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-50 border border-slate-200/60 rounded-lg">
            <Filter className="w-4 h-4 text-slate-500" strokeWidth={2} />
          </div>
          <h3 className="text-xs font-display font-bold text-slate-700 uppercase tracking-widest">Catálogo de Motoristas</h3>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Buscar motorista, placa..." 
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 hover:border-amber-300 transition-all duration-200 outline-none shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative group">
            <input
              type="file"
              accept=".csv"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              title="Importar CSV Motoristas"
              onChange={handleFileUpload}
            />
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-700 border border-slate-200/80 rounded-xl text-sm font-medium hover:bg-slate-100 transition-colors shadow-sm relative z-0">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Importar CSV</span>
            </button>
          </div>
          
          <button 
            onClick={() => {
              setFormData({ motorista: '', funcao: '', segmento: '' });
              setEditingId(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-slate-900 rounded-xl text-sm font-semibold hover:bg-amber-600 hover:-translate-y-0.5 hover:shadow-md active:scale-95 transition-all duration-200 shadow-sm shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Novo Motorista</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/60">
              <th className="px-6 py-4 w-10">
                <input 
                  type="checkbox" 
                  className="rounded border-slate-300 text-amber-500 focus:ring-amber-500 cursor-pointer"
                  checked={selectedItems.length === motoristas.length && motoristas.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Motorista</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Função</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Segmento</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                {selectedItems.length > 0 ? (
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => alert("Edição em lote suportada apenas na versão final com backend.")}
                      className="p-1 text-slate-400 hover:text-amber-600 transition-colors" title="Editar Selecionados"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={handleBatchDelete}
                      className="p-1 text-slate-400 hover:text-red-600 transition-colors" title="Excluir Selecionados"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  "Ações"
                )}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {motoristas.map((motorista) => (
              <tr key={motorista.id} className={`hover:bg-slate-50/80 transition-colors duration-200 group ${selectedItems.includes(motorista.id) ? 'bg-amber-50/50' : ''}`}>
                <td className="px-6 py-4">
                  <input 
                    type="checkbox" 
                    className="rounded border-slate-300 text-amber-500 focus:ring-amber-500 cursor-pointer"
                    checked={selectedItems.includes(motorista.id)}
                    onChange={() => toggleSelection(motorista.id)}
                  />
                </td>
                <td className="px-6 py-4 text-sm text-slate-800 font-bold group-hover:text-amber-600 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600 group-hover:bg-amber-100 group-hover:text-amber-700 transition-colors">
                      {motorista.motorista.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </div>
                    {motorista.motorista}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 font-medium">{motorista.funcao}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${getBadgeStyle(motorista.segmento)}`}>
                    {motorista.segmento}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => handleEdit(motorista)}
                      className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Editar">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(motorista.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Excluir">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 border-t border-slate-200/60 bg-slate-50/50 flex justify-between items-center text-sm text-slate-500">
        <span>Mostrando {motoristas.length} motoristas cadastrados.</span>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-display font-bold text-slate-800">Novo Motorista</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Motorista</label>
                <input 
                  type="text" 
                  placeholder="Ex: João Silva"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                  value={formData.motorista}
                  onChange={(e) => setFormData({...formData, motorista: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Função</label>
                <input 
                  type="text" 
                  placeholder="Ex: Motorista de Bi-trem"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                  value={formData.funcao}
                  onChange={(e) => setFormData({...formData, funcao: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Segmento</label>
                <select 
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                  value={formData.segmento}
                  onChange={(e) => setFormData({...formData, segmento: e.target.value})}
                >
                  <option value="">Selecione...</option>
                  <option value="Pedreiras">Pedreiras</option>
                  <option value="Portos">Portos</option>
                  <option value="Concreteiras">Concreteiras</option>
                  <option value="Fábrica de Tubos">Fábrica de Tubos</option>
                </select>
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={() => {
                  if (editingId) {
                    setMotoristas(motoristas.map(m => m.id === editingId ? { ...m, ...formData } : m));
                  } else {
                    setMotoristas([...motoristas, { id: Date.now().toString(), ...formData }]);
                  }
                  setIsModalOpen(false);
                  setEditingId(null);
                  setFormData({ motorista: '', funcao: '', segmento: '' });
                }}
                className="px-5 py-2.5 text-sm font-semibold text-slate-900 bg-amber-500 rounded-xl hover:bg-amber-600 shadow-sm shadow-amber-500/20 transition-all"
              >
                {editingId ? 'Salvar Alterações' : 'Salvar Motorista'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

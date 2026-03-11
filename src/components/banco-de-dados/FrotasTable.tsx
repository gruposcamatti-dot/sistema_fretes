import React, { useState } from 'react';
import { Search, Plus, Filter, ArrowUpDown, Download, MoreVertical, FileText, X, Edit2, Trash2 } from 'lucide-react';

export const FrotasTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Placeholder mock data specific to Frota
  const [frotas, setFrotas] = useState([
    { id: '1', frota: 'FROTA A1', placa: 'ABC-1234', tipo: 'Bi-trem', modelo: 'FH 540', marca: 'Volvo', segmento: 'Portos', unidade: 'Porto de Areia Saara - Mira Estrela' },
    { id: '2', frota: 'FROTA B2', placa: 'XYZ-9876', tipo: 'Rodo-trem', modelo: 'Actros', marca: 'Mercedes-Benz', segmento: 'Pedreiras', unidade: 'Mineração Noroeste Paulista - Monções' },
    { id: '3', frota: 'FROTA C3', placa: 'QWE-4567', tipo: 'Caçamba', modelo: 'R450', marca: 'Scania', segmento: 'Concreteiras', unidade: 'Noromix Concreto S/A - Votuporanga' },
    { id: '4', frota: 'FROTA D4', placa: 'ASD-3210', tipo: 'Truck', modelo: 'Constellation', marca: 'Volkswagen', segmento: 'Fábrica de Tubos', unidade: 'Fábrica de Tubos - Votuporanga' },
    { id: '5', frota: 'FROTA E5', placa: 'ZXC-6543', tipo: 'Bi-trem', modelo: 'Stralis', marca: 'Iveco', segmento: 'Pedreiras', unidade: 'Mineração Grandes Lagos Ltda - Icém' },
  ]);

  const [formData, setFormData] = useState({
    frota: '',
    placa: '',
    tipo: '',
    modelo: '',
    marca: '',
    segmento: '',
    unidade: ''
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta frota?')) {
      setFrotas(frotas.filter(f => f.id !== id));
      setSelectedItems(selectedItems.filter(item => item !== id));
    }
  };

  const handleBatchDelete = () => {
    if (window.confirm(`Tem certeza que deseja excluir ${selectedItems.length} frota(s)?`)) {
      setFrotas(frotas.filter(f => !selectedItems.includes(f.id)));
      setSelectedItems([]);
    }
  };

  const handleEdit = (frota: any) => {
    setFormData({
      frota: frota.frota,
      placa: frota.placa,
      tipo: frota.tipo,
      modelo: frota.modelo,
      marca: frota.marca,
      segmento: frota.segmento,
      unidade: frota.unidade
    });
    setEditingId(frota.id);
    setIsModalOpen(true);
  };

  const handleSelectAll = () => {
    if (selectedItems.length === frotas.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(frotas.map(f => f.id));
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
      
      const newFrotas: typeof frotas = [];
      
      lines.forEach((line, index) => {
        const cols = line.split(/[;,]/);
        // Frota, Placa, Tipo, Modelo, Marca, Segmento e Unidade
        if (cols.length >= 7) {
          const frota = cols[0].trim();
          const placa = cols[1].trim();
          const tipo = cols[2].trim();
          const modelo = cols[3].trim();
          const marca = cols[4].trim();
          const segmento = cols[5].trim();
          const unidade = cols[6].trim();

          // Pula o cabeçalho se existir
          if (index === 0 && frota.toLowerCase() === 'frota') return;

          newFrotas.push({
            id: Date.now().toString() + index,
            frota,
            placa,
            tipo,
            modelo,
            marca,
            segmento,
            unidade
          });
        }
      });

      if (newFrotas.length > 0) {
        setFrotas(prev => [...prev, ...newFrotas]);
        alert(`${newFrotas.length} frota(s) importada(s) com sucesso!`);
      } else {
        alert("Não foi possível encontrar dados válidos no CSV. Verifique se as colunas estão separadas por vírgula ou ponto e vírgula e se existem todas as sete colunas.");
      }
      
      event.target.value = '';
    };

    reader.readAsText(file);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden flex flex-col">
      <div className="p-6 border-b border-slate-200/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-transparent">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-50 border border-slate-200/60 rounded-lg">
            <Filter className="w-4 h-4 text-slate-500" strokeWidth={2} />
          </div>
          <h3 className="text-xs font-display font-bold text-slate-700 uppercase tracking-widest">Catálogo de Frotas</h3>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Buscar frota, placa..." 
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
              title="Importar CSV Frotas"
              onChange={handleFileUpload}
            />
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-700 border border-slate-200/80 rounded-xl text-sm font-medium hover:bg-slate-100 transition-colors shadow-sm relative z-0">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Importar CSV</span>
            </button>
          </div>
          
          <button 
            onClick={() => {
              setFormData({ frota: '', placa: '', tipo: '', modelo: '', marca: '', segmento: '', unidade: '' });
              setEditingId(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-slate-900 rounded-xl text-sm font-semibold hover:bg-amber-600 hover:-translate-y-0.5 hover:shadow-md active:scale-95 transition-all duration-200 shadow-sm shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nova Frota</span>
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
                  checked={selectedItems.length === frotas.length && frotas.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Frota</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Placa</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tipo</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Modelo</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Marca</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Segmento</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Unidade</th>
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
            {frotas.map((frota) => (
              <tr key={frota.id} className={`hover:bg-slate-50/80 transition-colors duration-200 group ${selectedItems.includes(frota.id) ? 'bg-amber-50/50' : ''}`}>
                <td className="px-6 py-4">
                  <input 
                    type="checkbox" 
                    className="rounded border-slate-300 text-amber-500 focus:ring-amber-500 cursor-pointer"
                    checked={selectedItems.includes(frota.id)}
                    onChange={() => toggleSelection(frota.id)}
                  />
                </td>
                <td className="px-6 py-4 text-sm text-slate-800 font-bold">{frota.frota}</td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-md font-mono text-slate-700 font-semibold">{frota.placa}</span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 font-medium">{frota.tipo}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{frota.modelo}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{frota.marca}</td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-700 ring-1 ring-amber-600/20">
                    {frota.segmento}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{frota.unidade}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => handleEdit(frota)}
                      className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Editar">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(frota.id)}
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
        <span>Mostrando {frotas.length} frotas cadastradas.</span>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-display font-bold text-slate-800">Nova Frota</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Frota</label>
                  <input 
                    type="text" 
                    placeholder="Ex: FROTA A1"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                    value={formData.frota}
                    onChange={(e) => setFormData({...formData, frota: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Placa</label>
                  <input 
                    type="text" 
                    placeholder="Ex: ABC-1234"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all uppercase"
                    value={formData.placa}
                    onChange={(e) => setFormData({...formData, placa: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tipo</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Bi-trem"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                    value={formData.tipo}
                    onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Modelo</label>
                  <input 
                    type="text" 
                    placeholder="Ex: FH 540"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                    value={formData.modelo}
                    onChange={(e) => setFormData({...formData, modelo: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Marca</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Volvo"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                    value={formData.marca}
                    onChange={(e) => setFormData({...formData, marca: e.target.value})}
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
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Unidade</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Porto de Areia Saara - Mira Estrela"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                    value={formData.unidade}
                    onChange={(e) => setFormData({...formData, unidade: e.target.value})}
                  />
                </div>
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
                    setFrotas(frotas.map(f => f.id === editingId ? { ...f, ...formData } : f));
                  } else {
                    setFrotas([...frotas, { id: Date.now().toString(), ...formData }]);
                  }
                  setIsModalOpen(false);
                  setEditingId(null);
                  setFormData({ frota: '', placa: '', tipo: '', modelo: '', marca: '', segmento: '', unidade: '' });
                }}
                className="px-5 py-2.5 text-sm font-semibold text-slate-900 bg-amber-500 rounded-xl hover:bg-amber-600 shadow-sm shadow-amber-500/20 transition-all"
              >
                {editingId ? 'Salvar Alterações' : 'Salvar Frota'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

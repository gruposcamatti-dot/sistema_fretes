import { useState } from 'react';
import { Database, PackageCheck, Users } from 'lucide-react';
import { FrotasTable } from './FrotasTable';
import { MotoristasTable } from './MotoristasTable';

export const BancoDeDadosView = () => {
  const [activeTab, setActiveTab] = useState<'frotas' | 'motoristas'>('frotas');

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* Intro Header */}
      <div className="bg-white border border-slate-200/60 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-amber-50/50 border border-amber-100/50 rounded-full flex flex-shrink-0 items-center justify-center">
            <Database className="w-7 h-7 text-amber-500" />
          </div>
          <div>
            <h3 className="text-xl font-display font-bold text-slate-800">Gerenciamento de Entidades</h3>
            <p className="text-slate-500 text-sm max-w-xl">Mantenha os cadastros atualizados para garantir a precisão no cruzamento de dados de viagens, emissão de relatórios e filtros preditivos.</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-slate-200/50 rounded-2xl w-full sm:w-fit shadow-inner">
        <button
          onClick={() => setActiveTab('frotas')}
          className={`flex items-center justify-center gap-2 flex-1 sm:px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${activeTab === 'frotas'
            ? 'bg-white text-amber-600 shadow-sm ring-1 ring-slate-900/5'
            : 'text-slate-600 hover:text-slate-800 hover:bg-slate-200/50'
            }`}
        >
          <PackageCheck className={`w-4 h-4 ${activeTab === 'frotas' ? 'text-amber-500' : 'text-slate-400'}`} />
          Frotas
        </button>
        <button
          onClick={() => setActiveTab('motoristas')}
          className={`flex items-center justify-center gap-2 flex-1 sm:px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${activeTab === 'motoristas'
            ? 'bg-white text-amber-600 shadow-sm ring-1 ring-slate-900/5'
            : 'text-slate-600 hover:text-slate-800 hover:bg-slate-200/50'
            }`}
        >
          <Users className={`w-4 h-4 ${activeTab === 'motoristas' ? 'text-amber-500' : 'text-slate-400'}`} />
          Motoristas
        </button>
      </div>

      {/* Content Render */}
      <div className="mt-6">
        {activeTab === 'frotas' ? <FrotasTable /> : <MotoristasTable />}
      </div>

    </div>
  );
};

import { useState } from 'react';
import { Layout } from '@/src/components/Layout';
import { DashboardKPIs } from '@/src/components/dashboard/DashboardKPIs';
import { DashboardFilters } from '@/src/components/dashboard/DashboardFilters';
import { DashboardCharts } from '@/src/components/charts/DashboardCharts';
import { FreightTable } from '@/src/components/tables/FreightTable';
import { ResumoFilters } from '@/src/components/dashboard/ResumoFilters';
import { ResumoKPIs } from '@/src/components/dashboard/ResumoKPIs';
import { ResumoTable } from '@/src/components/dashboard/ResumoTable';
import { BancoDeDadosView } from '@/src/components/banco-de-dados/BancoDeDadosView';
import { useFreightData } from '@/src/hooks/useFreightData';
import { FilterState } from '@/src/types';
import { Loader2, RefreshCcw, Download } from 'lucide-react';

export const DashboardPage = () => {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [trigger, setTrigger] = useState(0);
  const [filters, setFilters] = useState<FilterState>({
    periodo: '',
    ano: '',
    segmento: '',
    unidade: ''
  });

  const { data, loading, error, refetch } = useFreightData(filters, trigger);

  const handleGenerate = () => {
    setTrigger(prev => prev + 1);
  };

  return (
    <Layout activeMenu={activeMenu} onMenuChange={setActiveMenu}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-2">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900 tracking-tight">
              {activeMenu === 'dashboard' ? 'Visão Geral' :
                activeMenu === 'resumo' ? 'Resumo por Motorista/Frota' :
                activeMenu === 'banco_de_dados' ? 'Banco de Dados' :
                activeMenu === 'viagens' ? 'Gestão de Viagens' : 'Em Desenvolvimento'}
            </h1>
          </div>
          <div className="flex items-center gap-3">

            <button
              className="p-2.5 bg-yellow-500 text-slate-900 rounded-xl hover:bg-yellow-600 hover:-translate-y-0.5 hover:shadow-lg active:scale-95 transition-all duration-200 shadow-sm shadow-yellow-500/20"
              title="Exportar Relatório (PDF)"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>

        {activeMenu === 'resumo' ? (
          <ResumoFilters
            filters={filters}
            setFilters={setFilters}
            onGenerate={handleGenerate}
            loading={loading}
          />
        ) : activeMenu !== 'banco_de_dados' ? (
          <DashboardFilters
            filters={filters}
            setFilters={setFilters}
            onGenerate={handleGenerate}
            loading={loading}
          />
        ) : null}

        {activeMenu === 'banco_de_dados' ? (
            <BancoDeDadosView />
        ) : trigger === 0 ? (
          <div className="bg-white border border-white p-12 rounded-2xl flex flex-col items-center justify-center text-center shadow-md h-64">
            <div className="w-16 h-16 bg-amber-50/50 border border-amber-100/50 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl">📊</span>
            </div>
            <h3 className="text-xl font-display font-bold text-slate-800 mb-2">Selecione os filtros para gerar o Dashboard</h3>
            <p className="text-slate-500 max-w-md">Escolha o ano, mês ou segmento desejado e clique em "Gerar Dashboard" para visualizar os dados.</p>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl border border-white shadow-md">
            <Loader2 className="w-8 h-8 text-amber-600 animate-spin mb-4" />
            <span className="text-slate-500 font-medium">Sincronizando dados...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-100 text-red-700 p-6 rounded-2xl flex flex-col items-center justify-center text-center h-64 shadow-sm">
            <div className="w-12 h-12 bg-white shadow-sm border border-red-100 rounded-full flex items-center justify-center mb-3">
              <span className="text-2xl">⚠️</span>
            </div>
            <p className="font-display font-bold text-lg">Não foi possível carregar os dados</p>
            <p className="text-sm mt-1 text-red-600/80 max-w-md">{error}</p>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in duration-500">
            {data.length === 0 && (
              <div className="bg-amber-50 border border-amber-100 text-amber-800 p-6 rounded-2xl text-sm overflow-auto shadow-sm">
                <p className="font-display font-bold text-base mb-2">Nenhum dado encontrado no banco de dados.</p>
                <p className="mb-4">Filtros ativos: Ano: {filters.ano || 'Todos'}, Mês: {filters.periodo || 'Todos'}, Segmento: {filters.segmento || 'Todos'}, Unidade: {filters.unidade || 'Todas'}</p>
                <div className="space-y-2 text-xs bg-white/60 border border-amber-100 p-4 rounded-2xl">
                  <p className="font-semibold text-amber-900">Possíveis causas:</p>
                  <ul className="list-disc pl-5 space-y-1.5 text-amber-800">
                    <li><strong>Tabela vazia:</strong> A tabela <code className="bg-amber-100/50 px-1.5 py-0.5 rounded font-mono">frete_geral</code> não possui nenhum registro.</li>
                    <li><strong>RLS (Row Level Security) ativado:</strong> O Supabase bloqueia a leitura de dados por padrão. Vá no painel do Supabase &gt; Authentication &gt; Policies e crie uma política permitindo leitura (SELECT) para a tabela <code className="bg-amber-100/50 px-1.5 py-0.5 rounded font-mono">frete_geral</code>.</li>
                    <li><strong>Nome da tabela incorreto:</strong> Verifique se a tabela no Supabase se chama exatamente <code className="bg-amber-100/50 px-1.5 py-0.5 rounded font-mono">frete_geral</code> (tudo minúsculo).</li>
                  </ul>
                </div>
              </div>
            )}

            {activeMenu === 'dashboard' && (
              <>
                <DashboardKPIs data={data} filters={filters} />
                <DashboardCharts data={data} />
              </>
            )}

            {activeMenu === 'viagens' && (
              <FreightTable data={data} />
            )}

            {activeMenu === 'resumo' && (
              <>
                <ResumoKPIs data={data} />
                <ResumoTable data={data} filters={filters} />
              </>
            )}

            {activeMenu !== 'dashboard' && activeMenu !== 'viagens' && activeMenu !== 'resumo' && (
              <div className="bg-white border border-slate-200/70 p-12 rounded-2xl flex flex-col items-center justify-center text-center shadow-sm">
                <div className="w-16 h-16 bg-amber-50/50 border border-amber-100/50 rounded-full flex items-center justify-center mb-4">
                  <span className="text-3xl">🚧</span>
                </div>
                <h3 className="text-xl font-display font-bold text-slate-800 mb-2">Módulo em Desenvolvimento</h3>
                <p className="text-slate-500 max-w-md">Esta funcionalidade está sendo construída e estará disponível em breve.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

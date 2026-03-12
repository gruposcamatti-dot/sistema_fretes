import { useState, useRef } from 'react';
import { Layout } from '@/src/components/Layout';
import { DashboardKPIs } from '@/src/components/dashboard/DashboardKPIs';
import { DashboardFilters } from '@/src/components/dashboard/DashboardFilters';
import { DashboardCharts } from '@/src/components/charts/DashboardCharts';
import { FreightTable } from '@/src/components/tables/FreightTable';
import { ResumoFilters } from '@/src/components/dashboard/ResumoFilters';
import { ResumoKPIs } from '@/src/components/dashboard/ResumoKPIs';
import { ResumoTable } from '@/src/components/dashboard/ResumoTable';
import { RateiosView } from '@/src/components/rateios/RateiosView';
import { BancoDeDadosView } from '@/src/components/banco-de-dados/BancoDeDadosView';
import { RastreamentoView } from '@/src/components/rastreamento/RastreamentoView';
import { RelatóriosView } from '@/src/components/relatorios/RelatóriosView';
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

  const dashboardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const { data, loading, error, refetch } = useFreightData(filters, trigger);

  const handleGenerate = () => {
    setTrigger(prev => prev + 1);
  };

  const activeMenuTitle = activeMenu === 'dashboard' ? 'Visão Geral' :
                activeMenu === 'resumo' ? 'Resumo por Motorista/Frota' :
                activeMenu === 'rateios' ? 'Rateios' :
                activeMenu === 'rastreamento' ? 'Rastreamento' :
                activeMenu === 'relatorios' ? 'Relatórios' :
                activeMenu === 'banco_de_dados' ? 'Banco de Dados' :
                activeMenu === 'viagens' ? 'Gestão de Viagens' : 'Relatório';

  const handleExportPDF = () => {
    setIsExporting(true);
    
    // We add a class to body to indicate we are printing the dashboard
    document.body.classList.add('printing-dashboard');
    
    setTimeout(() => {
      window.print();
      document.body.classList.remove('printing-dashboard');
      setIsExporting(false);
    }, 500);
  };

  return (
    <Layout activeMenu={activeMenu} onMenuChange={setActiveMenu}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-2">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900 tracking-tight">
              {activeMenuTitle}
            </h1>
          </div>
          <div className="flex items-center gap-3">

            {activeMenu !== 'rastreamento' && activeMenu !== 'relatorios' && (
              <button
                onClick={handleExportPDF}
                disabled={isExporting || activeMenu === 'banco_de_dados'}
                className="p-2.5 bg-yellow-500 text-slate-900 rounded-xl hover:bg-yellow-600 hover:-translate-y-0.5 hover:shadow-lg active:scale-95 transition-all duration-200 shadow-sm shadow-yellow-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                title="Exportar Relatório (PDF)"
              >
                {isExporting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>

        <div ref={dashboardRef} className="space-y-6 print:space-y-4 print:m-0 print:p-0 print:block">
          
          {/* Print Header (Only visible during print) */}
          <div className="hidden print:block bg-white p-6 rounded-2xl border border-slate-200 mb-6 break-after-avoid">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 m-0 pb-1">Relatório - {activeMenuTitle}</h1>
                    <p className="text-sm text-slate-500 m-0">Filtros aplicados para geração do relatório</p>
                </div>
                <div className="text-right text-xs text-slate-400">
                    Gerado em:<br/>
                    <strong className="text-slate-500">{new Date().toLocaleString('pt-BR')}</strong>
                </div>
            </div>
            
            <div className="flex flex-wrap gap-6 pt-4 border-t border-slate-200">
                {(filters.periodo || filters.ano) && (
                    <div>
                        <span className="block text-[11px] uppercase font-semibold text-slate-400 mb-0.5">Período</span>
                        <span className="text-sm font-medium text-slate-700">{filters.periodo ? filters.periodo.padStart(2, '0') : 'Todos'} / {filters.ano || 'Todos'}</span>
                    </div>
                )}
                
                {filters.segmento && (
                    <div>
                        <span className="block text-[11px] uppercase font-semibold text-slate-400 mb-0.5">Segmento</span>
                        <span className="text-sm font-medium text-slate-700">{filters.segmento}</span>
                    </div>
                )}

                {filters.unidade && (
                    <div>
                        <span className="block text-[11px] uppercase font-semibold text-slate-400 mb-0.5">Unidade</span>
                        <span className="text-sm font-medium text-slate-700">{filters.unidade}</span>
                    </div>
                )}

                {filters.tipo_frete && (
                    <div>
                        <span className="block text-[11px] uppercase font-semibold text-slate-400 mb-0.5">Tipo de Frete</span>
                        <span className="text-sm font-medium text-slate-700">{filters.tipo_frete}</span>
                    </div>
                )}

                {filters.motorista && (
                    <div>
                        <span className="block text-[11px] uppercase font-semibold text-slate-400 mb-0.5">Motorista</span>
                        <span className="text-sm font-medium text-slate-700">{filters.motorista}</span>
                    </div>
                )}

                {filters.frota && (
                    <div>
                        <span className="block text-[11px] uppercase font-semibold text-slate-400 mb-0.5">Frota</span>
                        <span className="text-sm font-medium text-slate-700">{filters.frota}</span>
                    </div>
                )}
                
                {!filters.periodo && !filters.ano && !filters.segmento && !filters.unidade && !filters.tipo_frete && !filters.motorista && !filters.frota && (
                    <div>
                        <span className="text-sm font-medium text-slate-500 italic">Nenhum filtro aplicado. Exibindo todos os dados.</span>
                    </div>
                )}
            </div>
          </div>

        {activeMenu === 'resumo' ? (
          <ResumoFilters
            filters={filters}
            setFilters={setFilters}
            onGenerate={handleGenerate}
            loading={loading}
          />
        ) : activeMenu !== 'banco_de_dados' && activeMenu !== 'rateios' && activeMenu !== 'rastreamento' && activeMenu !== 'relatorios' ? (
          <DashboardFilters
            filters={filters}
            setFilters={setFilters}
            onGenerate={handleGenerate}
            loading={loading}
          />
        ) : null}

        {activeMenu === 'banco_de_dados' ? (
            <BancoDeDadosView />
        ) : activeMenu === 'rateios' ? (
            <RateiosView />
        ) : activeMenu === 'rastreamento' ? (
            <RastreamentoView />
        ) : activeMenu === 'relatorios' ? (
            <RelatóriosView />
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
          <div className="space-y-6 animate-in fade-in duration-500 print:space-y-4 print:block">
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
                <DashboardCharts data={data} filters={filters} />
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

            {activeMenu !== 'dashboard' && activeMenu !== 'viagens' && activeMenu !== 'resumo' && activeMenu !== 'rateios' && activeMenu !== 'rastreamento' && (
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
      </div>
    </Layout>
  );
};

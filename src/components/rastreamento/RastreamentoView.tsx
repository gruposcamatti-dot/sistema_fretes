import React, { useState, useEffect, useRef } from 'react';
import Papa from 'papaparse';
import { RastreamentoRecord, FilterState } from '@/src/types';
import { rastreamentoService } from '@/src/services/rastreamentoService';
import { RastreamentoTable } from './RastreamentoTable';
import { RastreamentoFilters } from './RastreamentoFilters';
import { Upload, MapPin, Loader2, FileCheck, AlertTriangle } from 'lucide-react';

export const RastreamentoView = () => {
  const [data, setData] = useState<RastreamentoRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{ type: 'idle' | 'success' | 'error', message: string }>({ type: 'idle', message: '' });
  const [filters, setFilters] = useState<FilterState>({
    periodo: '',
    ano: new Date().getFullYear().toString(),
    segmento: '',
    unidade: '',
    tipo_frete: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const records = await rastreamentoService.getRastreamentos(filters);
      setData(records);
    } catch (err: any) {
      console.error('Falha ao carregar registros', err);
      setError(err.message || 'Erro ao conectar com o banco de dados.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Não carrega nada no início, aguarda o clique em Gerar
  }, []); // Carga inicial removida

  const handleGenerate = () => {
    setHasGenerated(true);
    loadData();
  };

  const loadAllDiagnostics = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Busca sem filtros para diagnóstico
      const records = await rastreamentoService.getRastreamentos({
        periodo: '',
        ano: '',
        segmento: '',
        unidade: '',
        tipo_frete: ''
      });
      setData(records);
      if (records.length === 0) {
        setError("O banco retornou 0 registros mesmo sem filtros. Verifique o console do navegador e o console do Firebase.");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      setUploadStatus({ type: 'error', message: 'Por favor, selecione um arquivo válido (.CSV).' });
      return;
    }

    setIsUploading(true);
    setUploadStatus({ type: 'idle', message: '' });

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const parsedData = results.data.map((row: any) => {
            // Conversão resiliente baseada no nome esperado das colunas do CSV
            // O usuário deve fornecer: Data, Frota, NF, Pedido, Tempo Descarregamento, Tempo Viagem, KM Rodado, Km Ganho

            // Helper function to find a key matching roughly the column name ignoring case and spaces
            const findValue = (keywords: string[]) => {
              const key = Object.keys(row).find(k => keywords.some(kw => k.toLowerCase().includes(kw)));
              return key ? row[key] : '';
            };

            const rawKmRodado = findValue(['km rodado', 'quilometragem'])?.toString().replace(/[^0-9,-]/g, '').replace(',', '.') || '0';
            const rawKmDif = findValue(['km ganho', 'ganho', 'km diferença', 'diferença', 'diferenca'])?.toString().replace(/[^0-9,-]/g, '').replace(',', '.') || '0';
            const rawDate = findValue(['data', 'emissao', 'emissão']) || '';
            let normalizedDate = rawDate;
            
            // Normalize DD/MM/YYYY to YYYY-MM-DD
            if (rawDate && /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(rawDate)) {
              const [day, month, year] = rawDate.split('/');
              normalizedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
            }

            return {
              origem: findValue(['origem', 'unidade', 'local', 'ponto', 'base']) || '',
              data: normalizedDate,
              frota: findValue(['frota', 'placa', 'veiculo']) || '',
              nf: findValue(['nf', 'nota', 'documento']) || '',
              pedido: findValue(['pedido', 'ordem']) || '',
              tempo_descarregamento: findValue(['descarregamento', 'desc.']) || '',
              tempo_viagem: findValue(['viagem', 'viag.']) || '',
              km_rodado: parseFloat(rawKmRodado) || 0,
              km_diferenca: parseFloat(rawKmDif) || 0,
            };
          }).filter((row) => row.data && row.frota); // Apenas linhas que realmente tem dados

          if (parsedData.length === 0) {
            throw new Error("Nenhum dado válido encontrado. Verifique se as colunas estão corretas.");
          }

          // Salva no Firebase
          await rastreamentoService.importData(parsedData);

          setUploadStatus({ type: 'success', message: `${parsedData.length} registros importados com sucesso!` });
          await loadData(); // Recarrega os dados do banco

        } catch (error: any) {
          console.error("Erro na importação:", error);
          setUploadStatus({ type: 'error', message: error.message || 'Erro ao importar os dados. Verifique a estrutura do CSV.' });
        } finally {
          setIsUploading(false);
          // Limpa o input file
          if (fileInputRef.current) fileInputRef.current.value = '';
        }
      },
      error: (error) => {
        setUploadStatus({ type: 'error', message: `Erro ao ler o arquivo: ${error.message}` });
        setIsUploading(false);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <input
            type="file"
            accept=".csv"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileUpload}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="h-10 px-4 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm shadow-amber-500/20 active:scale-95 disabled:opacity-70 disabled:pointer-events-none"
          >
            {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            Importar CSV
          </button>
        </div>
      </div>

      {uploadStatus.type !== 'idle' && (
        <div className={`p-4 rounded-xl flex items-start gap-3 border ${uploadStatus.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
          {uploadStatus.type === 'success' ? <FileCheck className="w-5 h-5 flex-shrink-0 mt-0.5" /> : <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />}
          <div>
            <h4 className="font-semibold text-sm">{uploadStatus.type === 'success' ? 'Sucesso!' : 'Ocorreu um erro'}</h4>
            <p className="text-sm opacity-90">{uploadStatus.message}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl flex items-start gap-3 border bg-red-50 border-red-200 text-red-800 animate-in fade-in slide-in-from-top-2 duration-300">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-sm">Erro ao carregar dados</h4>
            <p className="text-sm opacity-90">{error}</p>
            <button 
              onClick={loadData}
              className="mt-2 text-xs font-bold underline hover:no-underline"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      )}

      <RastreamentoFilters 
        filters={filters} 
        setFilters={setFilters} 
        onGenerate={handleGenerate}
        loading={isLoading}
      />

      {!hasGenerated ? (
        <div className="bg-white border border-white p-12 rounded-2xl flex flex-col items-center justify-center text-center shadow-md h-64">
          <div className="w-16 h-16 bg-emerald-50/50 border border-emerald-100/50 rounded-full flex items-center justify-center mb-4">
            <span className="text-3xl">📊</span>
          </div>
          <h3 className="text-xl font-display font-bold text-slate-800 mb-2">Selecione os filtros para gerar o Rastreamento</h3>
          <p className="text-slate-500 max-w-md">Escolha o período ou segmento desejado e clique em "Gerar Rastreamento" para visualizar os dados.</p>
        </div>
      ) : isLoading ? (
        <div className="flex flex-col items-center justify-center h-64 bg-slate-50 border border-slate-200 border-dashed rounded-2xl">
          <Loader2 className="w-8 h-8 animate-spin text-amber-500 mb-4" />
          <p className="text-slate-500 font-medium">Carregando registros de rastreamento...</p>
        </div>
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-slate-50 border border-slate-200 border-dashed rounded-2xl p-8 text-center">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <MapPin className="w-6 h-6 text-slate-300" />
          </div>
          <p className="text-slate-600 font-semibold">Nenhum dado de rastreamento encontrado.</p>
          <p className="text-slate-400 text-sm mt-1 mb-6 max-w-sm">
            Verifique se os filtros aplicados estão corretos para o período selecionado ou se o projeto Firebase está configurado adequadamente.
          </p>
          
          {/* Diagnostic Box - Only shown in production error/empty scenarios */}
          {import.meta.env.MODE === 'production' && (
            <div className="mt-4 p-4 bg-white border border-slate-200 rounded-xl text-left w-full max-w-md shadow-sm">
              <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Painel de Diagnóstico</h5>
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500 font-medium">ID do Projeto:</span>
                  <span className="text-slate-700 font-bold">{import.meta.env.VITE_FIREBASE_PROJECT_ID || 'NÃO DEFINIDO'}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500 font-medium">API Key Status:</span>
                  <span className={`font-bold ${import.meta.env.VITE_FIREBASE_API_KEY ? 'text-emerald-600' : 'text-red-500'}`}>
                    {import.meta.env.VITE_FIREBASE_API_KEY ? 'CONFIGURADA' : 'AUSENTE'}
                  </span>
                </div>
              </div>
              <button 
                onClick={loadAllDiagnostics}
                className="mt-3 w-full py-2 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-colors"
              >
                Forçar Recarregamento Total
              </button>
            </div>
          )}
        </div>
      ) : (
        <RastreamentoTable data={data} onRefresh={loadData} />
      )}
    </div>
  );
};

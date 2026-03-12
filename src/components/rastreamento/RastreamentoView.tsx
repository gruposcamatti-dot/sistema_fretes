import React, { useState, useEffect, useRef } from 'react';
import Papa from 'papaparse';
import { RastreamentoRecord, FilterState } from '@/src/types';
import { rastreamentoService } from '@/src/services/rastreamentoService';
import { RastreamentoTable } from './RastreamentoTable';
import { RastreamentoFilters } from './RastreamentoFilters';
import { Upload, MapPin, Loader2, FileCheck, AlertTriangle } from 'lucide-react';

export const RastreamentoView = () => {
  const [data, setData] = useState<RastreamentoRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
    try {
      const records = await rastreamentoService.getRastreamentos(filters);
      setData(records);
    } catch (error) {
      console.error('Falha ao carregar registros', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []); // Carga inicial

  const handleGenerate = () => {
    loadData();
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
            // O usuário deve fornecer: Data, Frota, NF, Pedido, Tempo Descarregamento, Tempo Viagem, KM Rodado, Km Diferença

            // Helper function to find a key matching roughly the column name ignoring case and spaces
            const findValue = (keywords: string[]) => {
              const key = Object.keys(row).find(k => keywords.some(kw => k.toLowerCase().includes(kw)));
              return key ? row[key] : '';
            };

            const rawKmRodado = findValue(['km rodado', 'quilometragem'])?.toString().replace(/[^0-9,-]/g, '').replace(',', '.') || '0';
            const rawKmDif = findValue(['km diferença', 'diferença', 'diferenca'])?.toString().replace(/[^0-9,-]/g, '').replace(',', '.') || '0';
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

      <RastreamentoFilters 
        filters={filters} 
        setFilters={setFilters} 
        onGenerate={handleGenerate}
        loading={isLoading}
      />

      {/* Conteúdo */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64 bg-slate-50 border border-slate-200 border-dashed rounded-2xl">
          <Loader2 className="w-8 h-8 animate-spin text-amber-500 mb-4" />
          <p className="text-slate-500 font-medium">Carregando registros de rastreamento...</p>
        </div>
      ) : (
        <RastreamentoTable data={data} onRefresh={loadData} />
      )}
    </div>
  );
};

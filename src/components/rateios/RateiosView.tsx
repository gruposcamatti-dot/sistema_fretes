import React, { useState, useEffect } from 'react';
import { SEGMENTS, FilterState } from '@/src/types';
import { motoristasService, Motorista } from '@/src/services/motoristasService';
import { Loader2, Calculator, Search } from 'lucide-react';
import { useFreightData } from '@/src/hooks/useFreightData';
import { RateiosFilters } from './RateiosFilters';

type RateioMotorista = {
  motorista: string;
  segmento: string;
  diasTrabalhados: number;
  pedreiras: number;
  portos: number;
  concreteiras: number;
  fabricaTubos: number;
};

export const RateiosView = () => {
  const [dbMotoristas, setDbMotoristas] = useState<Motorista[]>([]);
  const [loadingMotoristas, setLoadingMotoristas] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Controle independente de filtros para a aba Rateios
  const [trigger, setTrigger] = useState(0);
  const [filters, setFilters] = useState<FilterState>({
    periodo: '',
    ano: '',
    segmento: '',
    unidade: ''
  });

  const { data, loading: loadingTrips, error } = useFreightData(filters, trigger);

  const handleGenerate = () => {
    setTrigger(prev => prev + 1);
  };

  useEffect(() => {
    const fetchMotoristas = async () => {
      try {
        setLoadingMotoristas(true);
        const motoristasList = await motoristasService.getMotoristas();
        setDbMotoristas(motoristasList);
      } catch (err) {
        console.error("Erro ao carregar motoristas do banco:", err);
      } finally {
        setLoadingMotoristas(false);
      }
    };
    fetchMotoristas();
  }, []);

  const calculateRateios = (): RateioMotorista[] => {
    return dbMotoristas.map(mDB => {
      // Pega todas as viagens do motorista filtrando em maiúsculas por segurança
      const driverTrips = data.filter(d => 
        (d.motorista || '').trim().toLowerCase() === (mDB.motorista || '').trim().toLowerCase()
      );

      // Coletamos a quantidade de dias passados em cada segmento isoladamente
      const pedreirasDays = new Set(
        driverTrips.filter(d => SEGMENTS.PEDREIRAS.includes(d.origem)).map(d => d.data.split('T')[0])
      ).size;

      const portosDays = new Set(
        driverTrips.filter(d => SEGMENTS.PORTOS.includes(d.origem)).map(d => d.data.split('T')[0])
      ).size;

      const concreteirasDays = new Set(
        driverTrips.filter(d => SEGMENTS.CONCRETEIRAS.includes(d.origem)).map(d => d.data.split('T')[0])
      ).size;

      const fabricaDays = new Set(
        driverTrips.filter(d => SEGMENTS.FABRICA_DE_TUBOS.includes(d.origem)).map(d => d.data.split('T')[0])
      ).size;

      // O total de dias trabalhados considerará apenas os dias válidos nos segmentos conhecidos
      const totalTrabalhadosNoSegmento = pedreirasDays + portosDays + concreteirasDays + fabricaDays;

      return {
        motorista: mDB.motorista,
        segmento: mDB.segmento,
        diasTrabalhados: Math.min(totalTrabalhadosNoSegmento, 31),
        pedreiras: pedreirasDays,
        portos: portosDays,
        concreteiras: concreteirasDays,
        fabricaTubos: fabricaDays
      };
    }).sort((a, b) => (a.motorista || '').localeCompare(b.motorista || ''));
  };

  const rateiosData = calculateRateios();

  const filteredRateios = rateiosData.filter(r => 
    r.motorista.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <RateiosFilters
        filters={filters}
        setFilters={setFilters}
        onGenerate={handleGenerate}
        loading={loadingTrips}
      />

      {trigger === 0 ? (
        <div className="bg-white border border-white p-12 rounded-2xl flex flex-col items-center justify-center text-center shadow-md h-64">
          <div className="w-16 h-16 bg-amber-50/50 border border-amber-100/50 rounded-full flex items-center justify-center mb-4">
            <span className="text-3xl">🧮</span>
          </div>
          <h3 className="text-xl font-display font-bold text-slate-800 mb-2">Selecione o Mês a ser apurado</h3>
          <p className="text-slate-500 max-w-md">Escolha um ano e um mês acima e mande gerar os dados para os rateios.</p>
        </div>
      ) : loadingTrips || loadingMotoristas ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl border border-white shadow-md">
          <Loader2 className="w-8 h-8 text-amber-600 animate-spin mb-4" />
          <span className="text-slate-500 font-medium">Sincronizando viagens e lista de motoristas...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-100 text-red-700 p-6 rounded-2xl flex flex-col items-center justify-center text-center h-64 shadow-sm">
          <p className="font-display font-bold text-lg">Erro na Sincronização</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden flex flex-col mt-6 animate-in fade-in duration-500">
          <div className="p-6 border-b border-slate-200/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-transparent">
            <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-50 border border-slate-200/60 rounded-lg">
            <Calculator className="w-4 h-4 text-slate-500" strokeWidth={2} />
          </div>
          <h3 className="text-xs font-display font-bold text-slate-700 uppercase tracking-widest">Rateio de Motoristas ({data.length} viagens no período)</h3>
        </div>

        <div className="relative flex-1 sm:w-64 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar motorista..." 
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/60">
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Motorista / Segmento</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Dias Trabalhados</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Pedreiras</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Portos</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Concreteiras</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Fábrica de Tubos</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredRateios.length === 0 ? (
              <tr>
                 <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                  Nenhum motorista encontrado no banco de dados.
                </td>
              </tr>
            ) : (
                filteredRateios.map((rateio, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors duration-200">
                        <td className="px-6 py-4">
                             <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                                {rateio.motorista.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-sm text-slate-800 font-bold">{rateio.motorista}</span>
                                  <span className="text-xs font-medium text-slate-500 mt-0.5">{rateio.segmento || 'Sem segmento definido'}</span>
                                </div>
                            </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-center">
                            <span className="font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-md">{rateio.diasTrabalhados}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-center text-slate-600 font-medium">{rateio.pedreiras}</td>
                        <td className="px-6 py-4 text-sm text-center text-slate-600 font-medium">{rateio.portos}</td>
                        <td className="px-6 py-4 text-sm text-center text-slate-600 font-medium">{rateio.concreteiras}</td>
                        <td className="px-6 py-4 text-sm text-center text-slate-600 font-medium">{rateio.fabricaTubos}</td>
                    </tr>
                ))
            )}
          </tbody>
        </table>
       </div>
      </div>
     )}
    </div>
  );
};

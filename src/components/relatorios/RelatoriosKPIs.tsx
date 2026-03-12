import React from 'react';
import { RelatoriosKPIs as RelatoriosKPIsData } from '@/src/hooks/useRelatoriosData';
import { formatTimeFromMinutes } from '@/src/hooks/useRelatoriosData';
import { Clock, Truck, Navigation, AlertCircle, TrendingUp, DollarSign, Package, Route } from 'lucide-react';

type RelatoriosKPIsProps = {
  kpis: RelatoriosKPIsData;
  segment?: string;
};

export const RelatoriosKPIs = ({ kpis, segment }: RelatoriosKPIsProps) => {
  const getVolumeUnit = () => {
    if (segment === 'PEDREIRAS' || segment === 'PORTOS') return 'ton.';
    return 'm³';
  };

  const volumeUnit = getVolumeUnit();

  const cards = [
    {
      title: 'Tempo Médio de Viagem',
      value: formatTimeFromMinutes(kpis.tempoMedioViagem),
      icon: Clock,
      accent: 'bg-blue-500',
      iconBg: 'bg-blue-50 text-blue-600',
      gradient: 'from-blue-50/80 to-white',
    },
    {
      title: 'Tempo Médio de Descarregamento',
      value: formatTimeFromMinutes(kpis.tempoMedioDescarregamento),
      icon: Clock,
      accent: 'bg-indigo-500',
      iconBg: 'bg-indigo-50 text-indigo-600',
      gradient: 'from-indigo-50/80 to-white',
    },
    {
      title: 'Total Km Rodado',
      value: kpis.totalKmRodado.toLocaleString('pt-BR', { maximumFractionDigits: 1 }),
      icon: Navigation,
      accent: 'bg-emerald-500',
      iconBg: 'bg-emerald-50 text-emerald-600',
      gradient: 'from-emerald-50/80 to-white',
    },
    {
      title: 'Total Km Ganho',
      value: kpis.totalKmDiferenca.toLocaleString('pt-BR', { maximumFractionDigits: 1 }),
      icon: AlertCircle,
      accent: 'bg-amber-500',
      iconBg: 'bg-amber-50 text-amber-600',
      gradient: 'from-amber-50/80 to-white',
    },
    {
      title: 'Eficiência Logística',
      value: `${kpis.eficienciaRota.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%`,
      description: `Quilometragem percorrida ${kpis.percentualEconomia.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}% inferior à vendida`,
      icon: Route,
      accent: kpis.eficienciaRota < 100 ? 'bg-red-500' : 'bg-cyan-500',
      iconBg: kpis.eficienciaRota < 100 ? 'bg-red-50 text-red-600' : 'bg-cyan-50 text-cyan-600',
      gradient: kpis.eficienciaRota < 100 ? 'from-red-50/80 to-white' : 'from-cyan-50/80 to-white',
      colorOverride: kpis.eficienciaRota < 100 ? 'text-red-600' : 'text-slate-900',
    },
    {
      title: 'Faturamento / Km',
      value: kpis.faturamentoPorKm.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      icon: DollarSign,
      accent: 'bg-emerald-600',
      iconBg: 'bg-emerald-50 text-emerald-700',
      gradient: 'from-emerald-50/80 to-white',
    },
    {
      title: 'Faturamento / Viagem',
      value: kpis.faturamentoPorViagem.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      icon: TrendingUp,
      accent: 'bg-blue-600',
      iconBg: 'bg-blue-50 text-blue-700',
      gradient: 'from-blue-50/80 to-white',
    },
    {
      title: 'Viagens / Caminhão',
      value: kpis.viagensPorCaminhao.toLocaleString('pt-BR', { maximumFractionDigits: 1 }),
      icon: Truck,
      accent: 'bg-orange-500',
      iconBg: 'bg-orange-50 text-orange-600',
      gradient: 'from-orange-50/80 to-white',
    },
    {
      title: 'Volume / Viagem',
      value: `${kpis.volumePorViagem.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} ${volumeUnit}`,
      icon: Package,
      accent: 'bg-violet-500',
      iconBg: 'bg-violet-50 text-violet-600',
      gradient: 'from-violet-50/80 to-white',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className={`group relative p-6 rounded-3xl border border-slate-100 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1.5 duration-500 overflow-hidden bg-gradient-to-br ${card.gradient}`}
          >
            {/* Subtle side accent bar */}
            <div className={`absolute left-0 top-0 bottom-0 w-[4px] ${card.accent} opacity-60 group-hover:opacity-100 transition-opacity duration-500`}></div>
            
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  {card.title}
                </p>
                <div className={`p-2 rounded-xl ${card.iconBg} transition-all group-hover:rotate-12 duration-500`}>
                  <Icon className="w-5 h-5" strokeWidth={2.5} />
                </div>
              </div>
              
              <div>
                <p className={`text-3xl font-black tracking-tighter tabular-nums ${ (card as any).colorOverride || 'text-slate-900'}`}>
                  {card.value}
                </p>
                {(card as any).description && (
                  <p className="text-[10px] font-medium text-slate-500 mt-1 leading-tight">
                    {(card as any).description}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <div className={`w-8 h-1 rounded-full ${card.accent} opacity-20 group-hover:opacity-60 transition-all duration-500 group-hover:w-16`}></div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

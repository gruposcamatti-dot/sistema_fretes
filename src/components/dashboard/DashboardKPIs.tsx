import { FreightRecord, FilterState } from '@/src/types';
import {
  Wallet,
  Truck,
  Box,
  Activity
} from 'lucide-react';

type DashboardKPIsProps = {
  data: FreightRecord[];
  filters?: FilterState;
};

export const DashboardKPIs = ({ data, filters }: DashboardKPIsProps) => {
  const faturamentoTotal = data.reduce((sum, record) => sum + record.valor, 0);
  const totalViagens = data.length;
  const volumeTotal = data.reduce((sum, record) => sum + record.volume, 0);
  const ticketMedio = totalViagens > 0 ? faturamentoTotal / totalViagens : 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  let volumeUnit = 't';
  if (filters?.segmento === 'CONCRETEIRAS' || filters?.segmento === 'FABRICA_DE_TUBOS') {
    volumeUnit = 'm³';
  }

  const kpis = [
    {
      title: 'Faturamento Total',
      value: formatCurrency(faturamentoTotal),
      icon: Wallet,
      color: 'text-amber-600',
      iconBg: 'bg-amber-100/60',
      cardBg: 'bg-amber-50/40',
      trend: '+12.5%',
      trendUp: true
    },
    {
      title: 'Total de Viagens',
      value: totalViagens.toLocaleString('pt-BR'),
      icon: Truck,
      color: 'text-amber-600',
      iconBg: 'bg-amber-100/60',
      cardBg: 'bg-amber-50/40',
      trend: '+5.2%',
      trendUp: true
    },
    {
      title: 'Volume Transportado',
      value: `${volumeTotal.toLocaleString('pt-BR')} ${volumeUnit}`,
      icon: Box,
      color: 'text-amber-600',
      iconBg: 'bg-amber-100/60',
      cardBg: 'bg-amber-50/40',
      trend: '-2.1%',
      trendUp: false
    },
    {
      title: 'Ticket Médio',
      value: formatCurrency(ticketMedio),
      icon: Activity,
      color: 'text-amber-600',
      iconBg: 'bg-amber-100/60',
      cardBg: 'bg-amber-50/40',
      trend: '+8.4%',
      trendUp: true
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon;
        return (
          <div key={index} className="bg-slate-50/50 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:border-slate-200 hover:bg-white transition-all duration-300 relative overflow-hidden group cursor-pointer">
            <div className="flex justify-between items-start mb-6">
              <div className={`p-3 rounded-2xl ${kpi.iconBg} group-hover:scale-110 transition-transform duration-300`}>
                <Icon className={`w-6 h-6 ${kpi.color}`} strokeWidth={1.5} />
              </div>
              <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${kpi.trendUp ? 'bg-emerald-100/80 text-emerald-700' : 'bg-red-100/80 text-red-700'}`}>
                {kpi.trend}
              </span>
            </div>
            <div className="relative z-10">
              <p className="text-sm font-medium text-slate-500 mb-1.5">{kpi.title}</p>
              <p className="text-2xl md:text-3xl font-display font-bold text-slate-800 tracking-tight">{kpi.value}</p>
            </div>
            {/* Decorative background element */}
            <div className={`absolute -right-10 -bottom-10 w-40 h-40 rounded-full ${kpi.iconBg} opacity-20 pointer-events-none group-hover:scale-110 transition-transform duration-500`}></div>
          </div>
        );
      })}
    </div>
  );
};

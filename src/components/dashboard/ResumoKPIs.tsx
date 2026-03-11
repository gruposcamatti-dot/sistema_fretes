import { FreightRecord } from '@/src/types';
import { TrendingUp, Package, DollarSign } from 'lucide-react';

export const ResumoKPIs = ({ data }: { data: FreightRecord[] }) => {
  const totalViagens = data.length;
  const totalVolume = data.reduce((sum, item) => sum + (item.volume || 0), 0);
  const totalFaturamento = data.reduce((sum, item) => sum + (item.valor || 0), 0);

  const kpis = [
    {
      title: 'Total de Viagens Realizadas',
      value: totalViagens.toLocaleString('pt-BR'),
      icon: TrendingUp,
      color: 'blue'
    },
    {
      title: 'Total de Volume Transportado',
      value: `${totalVolume.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} tons`,
      icon: Package,
      color: 'emerald'
    },
    {
      title: 'Total de Faturamento',
      value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalFaturamento),
      icon: DollarSign,
      color: 'amber'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon;
        
        return (
          <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">{kpi.title}</p>
                <h3 className="text-2xl font-bold text-slate-800">{kpi.value}</h3>
              </div>
              <div className={`p-3 rounded-xl bg-${kpi.color}-50 text-${kpi.color}-600`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

import React from 'react';
import { FreightRecord, SEGMENTS } from '@/src/types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

type DashboardChartsProps = {
  data: FreightRecord[];
};

// Professional SaaS color palette (Varied colors theme)
const COLORS = [
  '#3b82f6', // Blue
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#0ea5e9', // Sky
  '#14b8a6', // Teal
];
const CHART_BG = '#f8fafc';
const GRID_COLOR = '#f1f5f9';
const TEXT_COLOR = '#64748b';

const CustomTooltip = ({ active, payload, label, formatter }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 backdrop-blur-sm border border-slate-800 p-3 rounded-xl shadow-xl text-sm">
        <p className="font-semibold text-slate-100 mb-2">{label || payload[0].name}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
            <span className="text-slate-300">{entry.name}:</span>
            <span className="font-medium text-white">
              {formatter ? formatter(entry.value) : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const DashboardCharts = ({ data }: DashboardChartsProps) => {
  // Process data for Faturamento por Segmento
  const getSegmento = (origem: string) => {
    for (const [segment, units] of Object.entries(SEGMENTS)) {
      if (units.includes(origem)) return segment;
    }
    return 'OUTROS';
  };

  const faturamentoPorSegmento = data.reduce((acc, record) => {
    const segment = getSegmento(record.origem);
    acc[segment] = (acc[segment] || 0) + record.valor;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(faturamentoPorSegmento).map(([name, value]) => ({
    name: name.replace(/_/g, ' '),
    value
  }));

  // Process data for Faturamento por Mês
  const faturamentoPorMes = data.reduce((acc, record) => {
    const date = new Date(record.data);
    const month = date.toLocaleString('pt-BR', { month: 'short' });
    acc[month] = (acc[month] || 0) + record.valor;
    return acc;
  }, {} as Record<string, number>);

  const barData = Object.entries(faturamentoPorMes).map(([name, value]) => ({
    name,
    Faturamento: value
  }));

  // Ranking Motoristas
  const faturamentoPorMotorista = data.reduce((acc, record) => {
    acc[record.motorista] = (acc[record.motorista] || 0) + record.valor;
    return acc;
  }, {} as Record<string, number>);

  const motoristaData = Object.entries(faturamentoPorMotorista)
    .map(([name, value]) => ({ name, Faturamento: value }))
    .sort((a, b) => b.Faturamento - a.Faturamento)
    .slice(0, 5); // Top 5

  // Volume por Origem
  const volumePorOrigem = data.reduce((acc, record) => {
    const shortName = record.origem.split(' - ')[1] || record.origem.substring(0, 15);
    acc[shortName] = (acc[shortName] || 0) + record.volume;
    return acc;
  }, {} as Record<string, number>);

  const origemData = Object.entries(volumePorOrigem)
    .map(([name, value]) => ({ name, Volume: value }))
    .sort((a, b) => b.Volume - a.Volume)
    .slice(0, 5); // Top 5

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(value);
  };

  const ChartCard = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="bg-slate-50/50 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col hover:shadow-md hover:border-slate-200 hover:bg-white transition-all duration-300">
      <h3 className="text-xs font-display font-bold text-slate-700 uppercase tracking-widest mb-6">{title}</h3>
      <div className="flex-1 min-h-[300px] h-[300px] w-full">
        {children}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ChartCard title="Faturamento por Mês">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={GRID_COLOR} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: TEXT_COLOR, fontSize: 12 }} dy={10} />
            <YAxis
              tickFormatter={(value) => `R$${(value / 1000)}k`}
              axisLine={false}
              tickLine={false}
              tick={{ fill: TEXT_COLOR, fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip formatter={(value: number) => formatCurrency(value)} />} cursor={{ fill: '#f8fafc' }} />
            <Bar dataKey="Faturamento" fill={COLORS[0]} radius={[4, 4, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Faturamento por Segmento">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={110}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip formatter={(value: number) => formatCurrency(value)} />} />
            <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', color: TEXT_COLOR }} />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Top 5 Motoristas (Faturamento)">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={motoristaData} layout="vertical" margin={{ top: 0, right: 0, left: 20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={GRID_COLOR} />
            <XAxis type="number" tickFormatter={(value) => `R$${(value / 1000)}k`} axisLine={false} tickLine={false} tick={{ fill: TEXT_COLOR, fontSize: 12 }} />
            <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: TEXT_COLOR, fontSize: 12 }} width={100} />
            <Tooltip content={<CustomTooltip formatter={(value: number) => formatCurrency(value)} />} cursor={{ fill: '#f8fafc' }} />
            <Bar dataKey="Faturamento" fill={COLORS[1]} radius={[0, 4, 4, 0]} maxBarSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Top 5 Origens (Volume)">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={origemData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={GRID_COLOR} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: TEXT_COLOR, fontSize: 12 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: TEXT_COLOR, fontSize: 12 }} />
            <Tooltip content={<CustomTooltip formatter={(value: number) => `${value} ton`} />} cursor={{ fill: '#f8fafc' }} />
            <Bar dataKey="Volume" fill={COLORS[3]} radius={[4, 4, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
};

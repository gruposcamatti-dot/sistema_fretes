import React from 'react';
import { UnidadeSummary, FrotaSummary, UnidadeTimeSummary } from '@/src/hooks/useRelatoriosData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { formatTimeFromMinutes } from '@/src/hooks/useRelatoriosData';

type RelatóriosChartsProps = {
  unidadeSummary: UnidadeSummary[];
  frotaSummary: FrotaSummary[];
  unidadeTimeSummary: UnidadeTimeSummary[];
};

export const RelatóriosCharts = ({ unidadeSummary, frotaSummary, unidadeTimeSummary }: RelatóriosChartsProps) => {
  // Top 5 frotas com maior diferença de km
  const topFrotas = frotaSummary.slice(0, 5);

  // Cores para os gráficos
  const colors = ['#F59E0B', '#EC4899', '#8B5CF6', '#3B82F6', '#10B981'];

  const CustomTooltipTime = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 backdrop-blur-md text-slate-100 p-3 rounded-xl border border-slate-700 shadow-2xl text-sm min-w-[140px] animate-in fade-in zoom-in duration-200">
          <p className="font-bold mb-2 text-slate-400 uppercase tracking-tighter text-[10px]">Unidade / Unidade</p>
          <p className="font-black text-slate-100 text-base mb-1">{label}</p>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${payload[0].dataKey === 'tempoMedioViagem' ? 'bg-blue-400' : 'bg-purple-400'}`}></div>
            <p className="font-bold text-amber-400 text-lg">
              {formatTimeFromMinutes(payload[0].value)}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomTooltipKM = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 backdrop-blur-md text-slate-100 p-3 rounded-xl border border-slate-700 shadow-2xl text-sm min-w-[140px] animate-in fade-in zoom-in duration-200">
          <p className="font-bold mb-2 text-slate-400 uppercase tracking-tighter text-[10px]">Origem / Frota</p>
          <p className="font-black text-slate-100 text-base mb-1">{label}</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-400"></div>
            <p className="font-bold text-amber-400 text-lg">
              {(payload[0].value as number).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} <span className="text-xs text-slate-400 font-medium">KM</span>
            </p>
          </div>
          <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase">Diferença Total</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* Gráfico 1: Unidades com maior diferença de km */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span>📏</span> Diferença de KM por Unidade
        </h3>
        {unidadeSummary.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={unidadeSummary}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
              <XAxis type="number" stroke="#94A3B8" hide />
              <YAxis
                dataKey="unidade"
                type="category"
                width={90}
                tick={{ fontSize: 12, fill: '#64748B', fontWeight: 500 }}
              />
              <Tooltip content={<CustomTooltipKM />} cursor={{ fill: '#f8fafc' }} />
              <Bar dataKey="totalKmDiferenca" fill="#F59E0B" radius={[0, 6, 6, 0]} barSize={24}>
                <LabelList 
                  dataKey="totalKmDiferenca" 
                  position="right" 
                  formatter={(val: number) => val.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                  style={{ fontSize: '10px', fill: '#64748B', fontWeight: 'bold' }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-64 text-slate-400 font-medium">
            Sem dados disponíveis
          </div>
        )}
      </div>

      {/* Gráfico 2: Top 5 Frotas com maior diferença de km */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span>🚛</span> Top 5 Frotas - KM Diferença
        </h3>
        {topFrotas.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topFrotas} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis
                dataKey="frota"
                tick={{ fontSize: 11, fill: '#64748B', fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis hide />
              <Tooltip content={<CustomTooltipKM />} cursor={{ fill: '#f8fafc', opacity: 0.4 }} />
              <Bar dataKey="totalKmDiferenca" radius={[6, 6, 0, 0]} barSize={40}>
                {topFrotas.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
                <LabelList 
                  dataKey="totalKmDiferenca" 
                  position="top" 
                  formatter={(val: number) => val.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                  style={{ fontSize: '10px', fill: '#64748B', fontWeight: 'bold' }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-64 text-slate-400 font-medium">
            Sem dados disponíveis
          </div>
        )}
      </div>

      {/* Gráfico 3: Tempo Médio de Viagem por Unidade */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span>⏱️</span> Tempo Médio de Viagem por Unidade
        </h3>
        {unidadeTimeSummary.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={unidadeTimeSummary}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis
                dataKey="unidade"
                type="category"
                width={90}
                tick={{ fontSize: 12, fill: '#64748B', fontWeight: 500 }}
              />
              <Tooltip content={<CustomTooltipTime />} cursor={{ fill: '#f8fafc' }} />
              <Bar dataKey="tempoMedioViagem" fill="#3B82F6" radius={[0, 6, 6, 0]} barSize={24}>
                <LabelList 
                  dataKey="tempoMedioViagem" 
                  position="right" 
                  formatter={(val: number) => formatTimeFromMinutes(val)}
                  style={{ fontSize: '10px', fill: '#64748B', fontWeight: 'bold' }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-64 text-slate-400 font-medium">
            Sem dados disponíveis
          </div>
        )}
      </div>

      {/* Gráfico 4: Tempo Médio de Descarregamento por Unidade */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span>⏳</span> Tempo Médio Descarregamento por Unidade
        </h3>
        {unidadeTimeSummary.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={[...unidadeTimeSummary].sort((a, b) => b.tempoMedioDescarregamento - a.tempoMedioDescarregamento)}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis
                dataKey="unidade"
                type="category"
                width={90}
                tick={{ fontSize: 12, fill: '#64748B', fontWeight: 500 }}
              />
              <Tooltip content={<CustomTooltipTime />} cursor={{ fill: '#f8fafc' }} />
              <Bar dataKey="tempoMedioDescarregamento" fill="#8B5CF6" radius={[0, 6, 6, 0]} barSize={24}>
                <LabelList 
                  dataKey="tempoMedioDescarregamento" 
                  position="right" 
                  formatter={(val: number) => formatTimeFromMinutes(val)}
                  style={{ fontSize: '10px', fill: '#64748B', fontWeight: 'bold' }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-64 text-slate-400 font-medium">
            Sem dados disponíveis
          </div>
        )}
      </div>
    </div>
  );
};

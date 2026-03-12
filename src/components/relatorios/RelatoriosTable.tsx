import React, { useState } from 'react';
import { FrotaSummary } from '@/src/hooks/useRelatoriosData';
import { formatTimeFromMinutes } from '@/src/hooks/useRelatoriosData';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type RelatoriosTableProps = {
  data: FrotaSummary[];
};

export const RelatoriosTable = ({ data }: RelatoriosTableProps) => {
  const formatNumber = (val: number) => val.toLocaleString('pt-BR', { maximumFractionDigits: 2 });

  // Determinar unidade de medida baseada no segmento predominante ou no primeiro registro
  const getVolumeUnit = () => {
    const firstSegment = data.find(f => f.segmento)?.segmento;
    if (firstSegment === 'PEDREIRAS' || firstSegment === 'PORTOS') return '(ton.)';
    return 'm³';
  };

  const volumeUnit = getVolumeUnit();

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Frota</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Tipo</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Segmento</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Origem</th>
               <th className="px-4 py-3 text-right font-semibold text-slate-700">Viagens</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-700">Volume {volumeUnit}</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-700">Tempo Viagem</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-700">Tempo Desc.</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-700">KM Rodado</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-700">KM Ganho</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {data.length > 0 ? (
              data.map((frota, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-slate-50 transition-colors group"
                >
                  <td className="px-4 py-3 font-medium text-slate-900">{frota.frota}</td>
                  <td className="px-4 py-3 text-slate-600 font-medium">{frota.tipo}</td>
                  <td className="px-4 py-3 text-slate-700">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                      {frota.segmento || '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600 max-w-xs truncate" title={frota.origem}>
                    {(() => {
                      const name = frota.origem || '';
                      if (!name.includes('-')) return name;
                      const parts = name.split('-');
                      return parts[parts.length - 1].trim();
                    })()}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-700">{frota.viagensRealizadas}</td>
                  <td className="px-4 py-3 text-right text-slate-700">
                    {formatNumber(frota.volumeTransportado)}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-700">
                    {formatTimeFromMinutes(frota.tempoMedioViagem)}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-700">
                    {formatTimeFromMinutes(frota.tempoMedioDescarregamento)}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-700">
                    {formatNumber(frota.totalKmRodado)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="bg-amber-100 text-amber-900 px-2 py-1 rounded font-semibold">
                      {formatNumber(frota.totalKmDiferenca)}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10} className="px-4 py-8 text-center text-slate-500">
                  Nenhum dado disponível
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

import { useState, useEffect } from 'react';
import { supabase } from '@/src/services/supabase/client';

export const useDriverFleetOptions = () => {
  const [motoristas, setMotoristas] = useState<string[]>([]);
  const [frotas, setFrotas] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const fetchOptions = async () => {
      setLoading(true);
      try {
        // Fetch up to 5000 recent records to get the active pool of drivers/fleets
        const { data } = await supabase
          .from('frete_geral')
          .select('MOTORISTA, FROTA')
          .order('DATA', { ascending: false })
          .limit(5000);

        if (data && active) {
          const uniqueFrotas = Array.from(new Set(data.map(d => d.FROTA).filter(Boolean))).sort() as string[];
          const uniqueMotoristas = Array.from(new Set(data.map(d => d.MOTORISTA).filter(Boolean))).sort() as string[];
          
          setFrotas(uniqueFrotas);
          setMotoristas(uniqueMotoristas);
        }
      } catch (err) {
        console.error('Erro ao buscar opções de motoristas e frotas', err);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchOptions();

    return () => { active = false; };
  }, []);

  return { motoristas, frotas, loading };
};

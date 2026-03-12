import { collection, query, getDocs, writeBatch, doc, orderBy, limit, where } from 'firebase/firestore';
import { db } from '../firebase';
import { RastreamentoRecord, FilterState } from '../types';
import { normalizeOrigin } from '@/src/utils/originNormalizer';

const COLLECTION_NAME = 'rastreamento';

export const rastreamentoService = {
  // Buscar registros com filtros
  getRastreamentos: async (filters?: FilterState): Promise<RastreamentoRecord[]> => {
    try {
      const rastreamentoCol = collection(db, COLLECTION_NAME);
      
      // Diagnóstico de conexão
      console.log(`Buscando rastreamentos na coleção: ${COLLECTION_NAME}`);
      
      const constraints: any[] = [orderBy('data', 'desc'), limit(5000)];

      if (filters) {
        if (filters.unidade) {
          const normalizedUnidade = normalizeOrigin(filters.unidade);
          constraints.push(where('origem', '==', normalizedUnidade));
        }

        if (filters.ano && filters.periodo) {
          const month = filters.periodo.padStart(2, '0');
          const startDate = `${filters.ano}-${month}-01`;
          const lastDay = new Date(parseInt(filters.ano), parseInt(month), 0).getDate();
          const endDate = `${filters.ano}-${month}-${lastDay}`;
          constraints.push(where('data', '>=', startDate));
          constraints.push(where('data', '<=', endDate));
        } else if (filters.ano) {
          constraints.push(where('data', '>=', `${filters.ano}-01-01`));
          constraints.push(where('data', '<=', `${filters.ano}-12-31`));
        }
      }

      let q = query(rastreamentoCol, ...constraints);
      let snapshot = await getDocs(q);
      
      // Se não retornar nada e houver filtros/orderBy, tentamos uma busca simples como fallback diagnóstico
      if (snapshot.empty && constraints.length > 0) {
        console.warn("Nenhum dado encontrado com filtros. Tentando busca simplificada sem filtros/ordenação...");
        const simpleQuery = query(rastreamentoCol, limit(100));
        const simpleSnapshot = await getDocs(simpleQuery);
        
        if (!simpleSnapshot.empty) {
          console.log(`Busca simplificada encontrou ${simpleSnapshot.size} registros. O problema pode ser nos índices ou nos filtros aplicados.`);
          // Em modo diagnóstico, se a busca simples retornar algo mas a filtrada não, 
          // poderíamos retornar os dados simples, mas vamos manter o fluxo original e apenas logar.
        } else {
          console.log("Busca simplificada também não retornou nada. A coleção pode estar realmente vazia para este projeto Firebase.");
        }
      }

      console.log(`Busca finalizada. Total de documentos: ${snapshot.size}`);

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as RastreamentoRecord[];
    } catch (error: any) {
      console.error("Erro detalhado ao buscar rastreamentos:", error);
      
      // Checar erros comuns de índice do Firebase
      if (error.message?.includes('index')) {
        throw new Error(`O Firebase precisa de um índice para esta busca. Por favor, clique no link que deve aparecer no console do navegador para criá-lo.`);
      }
      
      throw new Error(`Falha ao carregar dados do Firebase: ${error.message || 'Erro desconhecido'}`);
    }
  },

  // Atualizar um registro
  updateRastreamento: async (id: string, data: Partial<RastreamentoRecord>): Promise<void> => {
    try {
      const batch = writeBatch(db);
      const docRef = doc(db, COLLECTION_NAME, id);
      batch.update(docRef, {
        ...data,
        updated_at: new Date().toISOString()
      });
      await batch.commit();
    } catch (error) {
      console.error("Erro ao atualizar rastreamento:", error);
      throw error;
    }
  },

  // Deletar um registro
  deleteRastreamento: async (id: string): Promise<void> => {
    try {
      const batch = writeBatch(db);
      const docRef = doc(db, COLLECTION_NAME, id);
      batch.delete(docRef);
      await batch.commit();
    } catch (error) {
      console.error("Erro ao deletar rastreamento:", error);
      throw error;
    }
  },

  // Deletar em lote
  deleteBulkRastreamentos: async (ids: string[]): Promise<void> => {
    try {
      const batch = writeBatch(db);
      ids.forEach((id) => {
        const docRef = doc(db, COLLECTION_NAME, id);
        batch.delete(docRef);
      });
      await batch.commit();
    } catch (error) {
      console.error("Erro ao deletar rastreamentos em lote:", error);
      throw error;
    }
  },

  // Importar dados em lote
  importData: async (data: Omit<RastreamentoRecord, 'id'>[]): Promise<void> => {
    try {
      const batch = writeBatch(db);
      const rastreamentoCol = collection(db, COLLECTION_NAME);

      data.forEach((record) => {
        const docRef = doc(rastreamentoCol);
        batch.set(docRef, {
          ...record,
          origem: normalizeOrigin(record.origem),
          created_at: new Date().toISOString()
        });
      });

      await batch.commit();
    } catch (error) {
      console.error("Erro ao importar rastreamentos:", error);
      throw error;
    }
  },

  // Deletar todos (útil para limpeza ou reset)
  deleteAll: async (): Promise<void> => {
    try {
      const snapshot = await getDocs(collection(db, COLLECTION_NAME));
      const batch = writeBatch(db);
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
    } catch (error) {
      console.error("Erro ao deletar rastreamentos:", error);
      throw error;
    }
  }
};

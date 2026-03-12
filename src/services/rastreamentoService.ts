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

      const q = query(rastreamentoCol, ...constraints);
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as RastreamentoRecord[];
    } catch (error: any) {
      console.error("Erro detalhado ao buscar rastreamentos:", error);
      // Propagar o erro para que a UI possa exibir
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

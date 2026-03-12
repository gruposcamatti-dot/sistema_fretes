import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { db } from '../firebase';

export interface Frota {
  id?: string;
  frota: string;
  placa: string;
  tipo: string;
  modelo: string;
  marca: string;
  segmento: string;
  unidade: string;
}

const COLLECTION_NAME = 'frotas';

export const frotasService = {
  // Obter todas as frotas
  getFrotas: async (): Promise<Frota[]> => {
    try {
      const frotasCol = collection(db, COLLECTION_NAME);
      const frotasSnapshot = await getDocs(frotasCol);
      const frotasList = frotasSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Frota[];
      return frotasList;
    } catch (error) {
      console.error("Erro ao buscar frotas:", error);
      throw error;
    }
  },

  // Adicionar uma nova frota
  addFrota: async (frota: Omit<Frota, 'id'>): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), frota);
      return docRef.id;
    } catch (error) {
      console.error("Erro ao adicionar frota:", error);
      throw error;
    }
  },

  // Atualizar uma frota existente
  updateFrota: async (id: string, frota: Partial<Frota>): Promise<void> => {
    try {
      const frotaRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(frotaRef, frota as any);
    } catch (error) {
      console.error("Erro ao atualizar frota:", error);
      throw error;
    }
  },

  // Excluir uma frota
  deleteFrota: async (id: string): Promise<void> => {
    try {
      const frotaRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(frotaRef);
    } catch (error) {
      console.error("Erro ao excluir frota:", error);
      throw error;
    }
  },

  // Importar frotas em lote (batch) - Para o CSV
  batchAddFrotas: async (frotas: Omit<Frota, 'id'>[]): Promise<void> => {
    try {
      const batch = writeBatch(db);
      
      frotas.forEach((frota) => {
        const novoDocRef = doc(collection(db, COLLECTION_NAME));
        batch.set(novoDocRef, frota);
      });

      await batch.commit();
    } catch (error) {
      console.error("Erro ao importar lote de frotas:", error);
      throw error;
    }
  }
};

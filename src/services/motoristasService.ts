import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { db } from '../firebase';

export interface Motorista {
  id?: string;
  motorista: string;
  funcao: string;
  segmento: string;
}

const COLLECTION_NAME = 'motoristas';

export const motoristasService = {
  // Obter todos os motoristas
  getMotoristas: async (): Promise<Motorista[]> => {
    try {
      const motoristasCol = collection(db, COLLECTION_NAME);
      const motoristasSnapshot = await getDocs(motoristasCol);
      const motoristasList = motoristasSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Motorista[];
      return motoristasList;
    } catch (error) {
      console.error("Erro ao buscar motoristas:", error);
      throw error;
    }
  },

  // Adicionar um novo motorista
  addMotorista: async (motorista: Omit<Motorista, 'id'>): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), motorista);
      return docRef.id;
    } catch (error) {
      console.error("Erro ao adicionar motorista:", error);
      throw error;
    }
  },

  // Atualizar um motorista existente
  updateMotorista: async (id: string, motorista: Partial<Motorista>): Promise<void> => {
    try {
      const motoristaRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(motoristaRef, motorista as any); // cast safely here or type Partial properties
    } catch (error) {
      console.error("Erro ao atualizar motorista:", error);
      throw error;
    }
  },

  // Excluir um motorista
  deleteMotorista: async (id: string): Promise<void> => {
    try {
      const motoristaRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(motoristaRef);
    } catch (error) {
      console.error("Erro ao excluir motorista:", error);
      throw error;
    }
  },

  // Importar motoristas em lote (batch) - Para o CSV
  batchAddMotoristas: async (motoristas: Omit<Motorista, 'id'>[]): Promise<void> => {
    try {
      const batch = writeBatch(db);
      
      motoristas.forEach((motorista) => {
        const novoDocRef = doc(collection(db, COLLECTION_NAME));
        batch.set(novoDocRef, motorista);
      });

      await batch.commit();
    } catch (error) {
      console.error("Erro ao importar lote de motoristas:", error);
      throw error;
    }
  }
};

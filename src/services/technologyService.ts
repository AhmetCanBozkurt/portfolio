import { collection, getDocs, query, orderBy, doc, getDoc, addDoc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { db } from './firebaseConfig';

const COLLECTION_NAME = 'technologies';

export interface Technology {
  id: string;
  name: string;
  icon: string;
  category: string;
  level: string;
  description: string;
  yearsOfExperience: number;
  createdAt?: string;
  updatedAt?: string;
  order?: number;
}

export const technologyService = {
  getAllTechnologies: async (): Promise<Technology[]> => {
    try {
      const techRef = collection(db, COLLECTION_NAME);
      const q = query(techRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || '',
          icon: data.icon || '',
          category: data.category || '',
          level: data.level || '',
          description: data.description || '',
          yearsOfExperience: data.yearsOfExperience || 0,
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt || '',
          updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : data.updatedAt || '',
          order: data.order || 0
        } as Technology;
      });
    } catch (error) {
      //console.error('Teknolojiler yüklenirken hata:', error);
      return [];
    }
  },

  getTechnologyById: async (id: string): Promise<Technology | null> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return null;
      }

      const data = docSnap.data();
      return {
        id: docSnap.id,
        name: data.name || '',
        icon: data.icon || '',
        category: data.category || '',
        level: data.level || '',
        description: data.description || '',
        yearsOfExperience: data.yearsOfExperience || 0,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt || '',
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : data.updatedAt || '',
        order: data.order || 0
      } as Technology;
    } catch (error) {
      //console.error('Teknoloji getirme hatası:', error);
      return null;
    }
  },

  addTechnology: async (technology: Omit<Technology, 'id'>): Promise<boolean> => {
    try {
      const docRef = collection(db, COLLECTION_NAME);
      await addDoc(docRef, {
        ...technology,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return true;
    } catch (error) {
      //console.error('Teknoloji ekleme hatası:', error);
      return false;
    }
  },

  updateTechnology: async (id: string, technology: Partial<Technology>): Promise<boolean> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        ...technology,
        updatedAt: Timestamp.now()
      });
      return true;
    } catch (error) {
      //console.error('Teknoloji güncelleme hatası:', error);
      return false;
    }
  },

  deleteTechnology: async (id: string): Promise<boolean> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      //console.error('Teknoloji silme hatası:', error);
      return false;
    }
  }
}; 
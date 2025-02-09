import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebaseConfig';

export const FirebaseService = {
  // Test bağlantısı
  testConnection: async () => {
    try {
      const testCollection = collection(db, 'test');
      await getDocs(testCollection);
      //console.log('Firebase bağlantısı başarılı!');
      return true;
    } catch (error) {
      //console.error('Firebase bağlantı hatası:', error);
      if (error instanceof Error) {
        /*console.error('Bağlantı hata detayları:', {
          message: error.message,
          name: error.name,
          code: (error as any).code
        });*/
      }

      return false;
    }
  },

  // Koleksiyondan tüm verileri getir
  getAll: async (collectionName: string) => {
    try {
      //console.log(`${collectionName} koleksiyonu getiriliyor...`);
      const collectionRef = collection(db, collectionName);
      const querySnapshot = await getDocs(collectionRef);
      
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      //console.log(`${collectionName} verileri başarıyla getirildi:`, data);
      return data;
    } catch (error) {
      //console.error(`${collectionName} getirme hatası:`, error);
      if (error instanceof Error) {
        /*console.error('Veri getirme hata detayları:', {
          collection: collectionName,
          message: error.message,
          name: error.name,
          code: (error as any).code
        });*/
      }

      throw error;
    }
  },

  // Yeni döküman ekle
  add: async (collectionName: string, data: any) => {
    try {
      //console.log(`${collectionName} koleksiyonuna veri ekleniyor:`, data);
      const docRef = await addDoc(collection(db, collectionName), data);
      //console.log(`${collectionName} verisi eklendi, ID:`, docRef.id);
      return { id: docRef.id, ...data };
    } catch (error) {
      //console.error(`${collectionName} ekleme hatası:`, error);
      if (error instanceof Error) {
        /*console.error('Veri ekleme hata detayları:', {
          collection: collectionName,
          message: error.message,
          name: error.name,
          code: (error as any).code
        });*/
      }

      throw error;
    }
  },

  // Döküman güncelle
  update: async (collectionName: string, id: string, data: any) => {
    try {
      //console.log(`${collectionName}/${id} güncelleniyor:`, data);
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, data);
      //console.log(`${collectionName}/${id} güncellendi`);
      return { id, ...data };
    } catch (error) {
      //console.error(`${collectionName} güncelleme hatası:`, error);
      if (error instanceof Error) {
        /*console.error('Güncelleme hata detayları:', {
          collection: collectionName,
          id,
          message: error.message,
          name: error.name,
          code: (error as any).code
        });*/
      }
      throw error;
    }

  },

  // Döküman sil
  delete: async (collectionName: string, id: string) => {
    try {
      //console.log(`${collectionName}/${id} siliniyor...`);
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
      //console.log(`${collectionName}/${id} silindi`);
      return id;
    } catch (error) {
      //console.error(`${collectionName} silme hatası:`, error);
      if (error instanceof Error) {
        /*console.error('Silme hata detayları:', {
          collection: collectionName,
          id,
          message: error.message,
          name: error.name,
          code: (error as any).code
        });*/
      }
      throw error;
    }
  }
}; 
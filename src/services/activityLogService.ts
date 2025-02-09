import { collection, addDoc, getDocs, query, orderBy, limit, Timestamp } from 'firebase/firestore';
import { db } from './firebaseConfig';

const COLLECTION_NAME = 'activity_logs';

interface ActivityLog {
  action: 'create' | 'update' | 'delete' | 'publish' | 'unpublish';
  entityType: 'project' | 'blog' | 'blog_post' | 'technology' | 'education' | 'certificate' | 'about';
  entityId: string;
  entityName: string;
  details: string;
  timestamp?: Date;
}

export const activityLogService = {
  // Yeni log ekle
  addLog: async (log: Omit<ActivityLog, 'timestamp'>): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...log,
        timestamp: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      //console.error('Aktivite logu ekleme hatası:', error);
      throw error;
    }
  },

  // Son aktiviteleri getir
  getRecentActivities: async (limit_count: number = 10): Promise<ActivityLog[]> => {
    try {
      const q = query(
        collection(db, 'activity_logs'),
        orderBy('timestamp', 'desc'),
        limit(limit_count)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate()
      })) as ActivityLog[];
    } catch (error) {
      //console.error('Aktivite logları getirme hatası:', error);
      return [];
    }
  }
}; 
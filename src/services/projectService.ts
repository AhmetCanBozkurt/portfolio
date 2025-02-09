import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  updateDoc,
  deleteDoc,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebaseConfig';
import { Project } from '../types/project';
import { activityLogService } from './activityLogService';

const COLLECTION_NAME = 'projects';

const convertFirestoreDate = (timestamp: any): Date => {
  if (timestamp?.seconds) {
    return new Date(timestamp.seconds * 1000);
  }
  if (timestamp instanceof Date) {
    return timestamp;
  }
  if (typeof timestamp === 'string') {
    return new Date(timestamp);
  }
  return new Date();
};

const convertToProject = (doc: any): Project => {
  const data = doc.data();
  //console.log('Firestore\'dan gelen ham veri:', data);
  
  const project: Project = {
    id: doc.id,
    title: data.title || '',
    description: data.description || '',
    technologies: Array.isArray(data.technologies) ? data.technologies : [],
    imageUrl: data.imageUrl || '',
    liveUrl: data.liveUrl || '',
    githubUrl: data.githubUrl || '',
    createdAt: convertFirestoreDate(data.createdAt),
    updatedAt: data.updatedAt ? convertFirestoreDate(data.updatedAt) : undefined,
    featured: Boolean(data.featured)
  };
  
  //console.log('Dönüştürülmüş proje verisi:', project);
  return project;
};

export const projectService = {
  // Ana sayfada gösterilecek öne çıkan projeleri getir
  getFeaturedProjects: async (): Promise<Project[]> => {
    try {
      //console.log('Öne çıkan projeler sorgusu başlatılıyor...');
      const projectsRef = collection(db, COLLECTION_NAME);
      const featuredQuery = query(
        projectsRef,
        where('featured', '==', true),
        orderBy('createdAt', 'desc'),
        limit(3)
      );
      
      //console.log('Firestore sorgusu yapılıyor...');
      const querySnapshot = await getDocs(featuredQuery);
      //console.log('Bulunan öne çıkan proje sayısı:', querySnapshot.size);
      
      const projects = querySnapshot.docs.map(convertToProject);
      //console.log('Dönüştürülen projeler:', projects);
      
      return projects;
    } catch (error) {
      //console.error('Öne çıkan projeler getirme hatası:', error);
      return []; // Hata durumunda boş dizi döndür
    }
  },

  // Tüm projeleri getir
  getAllProjects: async (): Promise<Project[]> => {
    try {
      const projectsRef = collection(db, COLLECTION_NAME);
      const querySnapshot = await getDocs(projectsRef);
      return querySnapshot.docs.map(convertToProject)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } catch (error) {
      //console.error('Projeler getirme hatası:', error);
      return []; // Hata durumunda boş dizi döndür
    }
  },

  // Tek bir projenin detaylarını getir
  getProjectById: async (id: string): Promise<Project | null> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return null;
      }

      return convertToProject(docSnap);
    } catch (error) {
      //console.error('Proje getirme hatası:', error);
      return null; // Hata durumunda null döndür
    }
  },

  // Yeni proje ekle
  createProject: async (project: Omit<Project, 'id' | 'createdAt'>): Promise<string> => {
    try {
      const projectData = {
        ...project,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        featured: Boolean(project.featured)
      };

      //console.log('Oluşturulacak proje verisi:', projectData);
      
      const docRef = await addDoc(collection(db, COLLECTION_NAME), projectData);

      await activityLogService.addLog({
        action: 'create',
        entityType: 'project',
        entityId: docRef.id,
        entityName: project.title,
        details: `"${project.title}" başlıklı yeni proje eklendi`
      });

      return docRef.id;
    } catch (error) {
      //console.error('Proje oluşturma hatası:', error);
      throw error;
    }
  },

  // Projeyi güncelle
  updateProject: async (id: string, project: Partial<Project>): Promise<boolean> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const oldDoc = await getDoc(docRef);
      const oldData = oldDoc.data();

      const updateData = {
        ...project,
        updatedAt: Timestamp.now(),
        featured: project.featured !== undefined ? Boolean(project.featured) : oldData?.featured
      };

      //console.log('Güncellenecek proje verisi:', updateData);

      await updateDoc(docRef, updateData);

      await activityLogService.addLog({
        action: 'update',
        entityType: 'project',
        entityId: id,
        entityName: project.title || oldData?.title,
        details: `"${project.title || oldData?.title}" başlıklı proje güncellendi`
      });

      return true;
    } catch (error) {
      //console.error('Proje güncelleme hatası:', error);
      throw error;
    }
  },

  // Projeyi sil
  deleteProject: async (id: string): Promise<boolean> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      const project = convertToProject(docSnap);

      await deleteDoc(docRef);

      await activityLogService.addLog({
        action: 'delete',
        entityType: 'project',
        entityId: id,
        entityName: project.title,
        details: `"${project.title}" başlıklı proje silindi`
      });

      return true;
    } catch (error) {
      //console.error('Proje silme hatası:', error);
      throw error;
    }
  }
}; 
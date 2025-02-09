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
import { BlogPost } from '../types/blog';
import { activityLogService } from './activityLogService';

const COLLECTION_NAME = 'blogPosts';

const convertFirestoreDate = (timestamp: any): Date => {
  if (timestamp?.toDate) {
    return timestamp.toDate();
  }
  if (timestamp?.seconds) {
    return new Date(timestamp.seconds * 1000);
  }
  if (timestamp instanceof Date) {
    return timestamp;
  }
  return new Date();
};

const convertToPost = (doc: any): BlogPost => {
  const data = doc.data();
  return {
    id: doc.id,
    title: data.title || '',
    slug: data.slug || '',
    excerpt: data.excerpt || '',
    content: data.content || '',
    coverImage: data.coverImage || '',
    tags: Array.isArray(data.tags) ? data.tags : [],
    createdAt: convertFirestoreDate(data.createdAt),
    updatedAt: data.updatedAt ? convertFirestoreDate(data.updatedAt) : undefined,
    status: data.status || 'draft'
  };
};

export const blogPostService = {
  // Ana sayfada gösterilecek son blog yazılarını getir
  getRecentPosts: async (): Promise<BlogPost[]> => {
    try {
      const postsRef = collection(db, COLLECTION_NAME);
      const recentQuery = query(
        postsRef,
        where('status', '==', 'published'),
        orderBy('createdAt', 'desc'),
        limit(3)
      );
      
      //console.log('Son blog yazıları sorgusu yapılıyor...');
      const querySnapshot = await getDocs(recentQuery);
      //console.log('Bulunan blog yazısı sayısı:', querySnapshot.size);
      
      return querySnapshot.docs.map(convertToPost);
    } catch (error) {
      //console.error('Son blog yazıları getirme hatası:', error);
      return [];
    }
  },

  // Tüm blog yazılarını getir
  getAllBlogPosts: async (): Promise<BlogPost[]> => {
    try {
      const postsRef = collection(db, COLLECTION_NAME);
      const allPostsQuery = query(
        postsRef,
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(allPostsQuery);
      return querySnapshot.docs.map(convertToPost);
    } catch (error) {
      //console.error('Blog yazıları getirme hatası:', error);
      return [];
    }
  },

  // Tek bir blog yazısının detaylarını getir
  getBlogPost: async (id: string): Promise<BlogPost | null> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return null;
      }

      return convertToPost(docSnap);
    } catch (error) {
      //console.error('Blog yazısı getirme hatası:', error);
      return null;
    }
  },

  // Slug'a göre blog yazısı getir
  getBlogPostBySlug: async (slug: string): Promise<BlogPost | null> => {
    try {
      const postsRef = collection(db, COLLECTION_NAME);
      const slugQuery = query(postsRef, where('slug', '==', slug));
      const querySnapshot = await getDocs(slugQuery);
      
      if (querySnapshot.empty) {
        return null;
      }

      return convertToPost(querySnapshot.docs[0]);
    } catch (error) {
      //console.error('Blog yazısı getirme hatası:', error);
      return null;
    }
  },

  // Yeni blog yazısı ekle
  createBlogPost: async (post: Omit<BlogPost, 'id' | 'createdAt'>): Promise<string> => {
    try {
      const postData = {
        ...post,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      const docRef = await addDoc(collection(db, COLLECTION_NAME), postData);

      await activityLogService.addLog({
        action: 'create',
        entityType: 'blog_post',
        entityId: docRef.id,
        entityName: post.title,
        details: `"${post.title}" başlıklı yeni blog yazısı eklendi`
      });

      return docRef.id;
    } catch (error) {
      //console.error('Blog yazısı oluşturma hatası:', error);
      throw error;
    }
  },

  // Blog yazısını güncelle
  updateBlogPost: async (id: string, post: Partial<BlogPost>): Promise<boolean> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const oldDoc = await getDoc(docRef);
      const oldData = oldDoc.data();

      const updateData = {
        ...post,
        updatedAt: Timestamp.now()
      };

      await updateDoc(docRef, updateData);

      await activityLogService.addLog({
        action: 'update',
        entityType: 'blog_post',
        entityId: id,
        entityName: post.title || oldData?.title,
        details: `"${post.title || oldData?.title}" başlıklı blog yazısı güncellendi`
      });

      return true;
    } catch (error) {
      //console.error('Blog yazısı güncelleme hatası:', error);
      throw error;
    }
  },

  // Blog yazısını sil
  deleteBlogPost: async (id: string): Promise<boolean> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      const post = convertToPost(docSnap);

      await deleteDoc(docRef);

      await activityLogService.addLog({
        action: 'delete',
        entityType: 'blog_post',
        entityId: id,
        entityName: post.title,
        details: `"${post.title}" başlıklı blog yazısı silindi`
      });

      return true;
    } catch (error) {
      //console.error('Blog yazısı silme hatası:', error);
      throw error;
    }
  },

  // Blog yazısını yayınla
  publishBlogPost: async (id: string): Promise<boolean> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      const post = convertToPost(docSnap);

      await updateDoc(docRef, {
        status: 'published',
        updatedAt: Timestamp.now()
      });

      await activityLogService.addLog({
        action: 'publish',
        entityType: 'blog_post',
        entityId: id,
        entityName: post.title,
        details: `"${post.title}" başlıklı blog yazısı yayınlandı`
      });

      return true;
    } catch (error) {
      //console.error('Blog yazısı yayınlama hatası:', error);
      throw error;
    }
  },

  // Blog yazısını yayından kaldır
  unpublishBlogPost: async (id: string): Promise<boolean> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      const post = convertToPost(docSnap);

      await updateDoc(docRef, {
        status: 'draft',
        updatedAt: Timestamp.now()
      });

      await activityLogService.addLog({
        action: 'unpublish',
        entityType: 'blog_post',
        entityId: id,
        entityName: post.title,
        details: `"${post.title}" başlıklı blog yazısı yayından kaldırıldı`
      });

      return true;
    } catch (error) {
      //console.error('Blog yazısı yayından kaldırma hatası:', error);
      throw error;
    }
  }
}; 
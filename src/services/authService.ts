import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut,
  sendEmailVerification,
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';
import { db } from './firebaseConfig';
import { collection, getDocs, query, where, addDoc, Timestamp, updateDoc, doc } from 'firebase/firestore';
import { emailService } from './emailService';

const auth = getAuth();

interface AdminUser {
  email: string | null;
}

// 6 haneli rastgele kod oluştur
const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const authService = {
  // Giriş yap
  login: async (email: string, password: string) => {
    try {
      // Önce Firebase Auth ile giriş yap
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Admin rolünü kontrol et
      const isAdmin = await authService.checkAdminRole({ email: user.email });
      if (!isAdmin) {
        await signOut(auth);
        throw new Error('Bu sayfaya erişim yetkiniz yok');
      }

      return user;
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('auth/invalid-credential')) {
          throw new Error('Geçersiz e-posta veya şifre');
        }
        if (error.message.includes('auth/too-many-requests')) {
          throw new Error('Çok fazla başarısız deneme. Lütfen daha sonra tekrar deneyin');
        }
      }
      throw error;
    }
  },

  // 2FA kod doğrulama
  verifyCode: async (userId: string, code: string) => {
    try {
      const verificationRef = collection(db, 'verificationCodes');
      const q = query(
        verificationRef, 
        where('userId', '==', userId),
        where('code', '==', code),
        where('used', '==', false)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error('Geçersiz veya kullanılmış kod');
      }

      const verificationDoc = querySnapshot.docs[0];
      const verificationData = verificationDoc.data();

      // Süre kontrolü
      if (verificationData.expiresAt.toDate() < new Date()) {
        // Süresi geçmiş kodu işaretle
        await updateDoc(verificationDoc.ref, { used: true });
        throw new Error('Doğrulama kodunun süresi dolmuş');
      }

      // Kodu kullanıldı olarak işaretle
      await updateDoc(verificationDoc.ref, { 
        used: true,
        usedAt: Timestamp.now()
      });

      // Session'a admin bilgisini kaydet
      localStorage.setItem('isAdmin', 'true');
      localStorage.setItem('adminLastLogin', new Date().toISOString());

      return true;
    } catch (error) {
      //console.error('Kod doğrulama hatası:', error);
      throw error;
    }
  },

  // Çıkış yap
  logout: async () => {
    try {
      await signOut(auth);
      // Session'dan admin bilgilerini temizle
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('adminLastLogin');
      // Tarayıcı önbelleğini temizle
      if (window.caches) {
        const cacheNames = await window.caches.keys();
        await Promise.all(cacheNames.map(cacheName => window.caches.delete(cacheName)));
      }
      //console.log('Çıkış başarılı, session temizlendi');
    } catch (error) {
      //console.error('Çıkış hatası:', error);
      throw error;
    }
  },

  // Oturum durumunu kontrol et
  getCurrentUser: () => {
    return new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe();
        if (user) {
          // Session kontrolü
          const isAdmin = localStorage.getItem('isAdmin') === 'true';
          const lastLogin = localStorage.getItem('adminLastLogin');
          const sessionTimeout = 24 * 60 * 60 * 1000; // 24 saat

          if (!isAdmin || !lastLogin || (Date.now() - new Date(lastLogin).getTime() > sessionTimeout)) {
            // Session süresi dolmuş veya admin değil
            authService.logout().then(() => resolve(null));
            return;
          }
        }
        resolve(user);
      }, reject);
    });
  },

  // Admin kontrolü
  isAdmin: async () => {
    try {
      const user = await authService.getCurrentUser();
      if (!user || !user.email) return false;

      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', user.email), where('role', '==', 'admin'));
      const querySnapshot = await getDocs(q);
      
      return !querySnapshot.empty;
    } catch (error) {
      //console.error('Admin kontrolü hatası:', error);
      return false;
    }
  },

  // Admin rolünü kontrol et
  checkAdminRole: async (user: { email: string | null }) => {
    try {
      if (!user?.email) {
        //console.error('Kullanıcı e-postası bulunamadı');
        return false;
      }

      //console.log('Admin rolü kontrol ediliyor:', user.email);

      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', user.email), where('role', '==', 'admin'));
      const querySnapshot = await getDocs(q);
      
      const isAdmin = !querySnapshot.empty;
      //console.log('Admin rolü kontrolü sonucu:', isAdmin);
      
      return isAdmin;
    } catch (error) {
      //console.error('Admin kontrol hatası:', error);
      return false;
    }
  },

  // Şifre sıfırlama e-postası gönder
  sendPasswordReset: async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      //console.error('Şifre sıfırlama hatası:', error);
      if (error instanceof Error) {
        if (error.message.includes('auth/invalid-email')) {
          throw new Error('Geçersiz e-posta adresi');
        }
        if (error.message.includes('auth/user-not-found')) {
          throw new Error('Bu e-posta adresi ile kayıtlı kullanıcı bulunamadı');
        }
      }
      throw error;
    }
  },

  // Admin kullanıcısı oluştur
  createAdminUser: async (email: string, password: string) => {
    try {
      // Önce giriş yap
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Users koleksiyonuna admin kaydı ekle
      const usersRef = collection(db, 'users');
      await addDoc(usersRef, {
        email: user.email,
        role: 'admin',
        createdAt: Timestamp.now()
      });

      //console.log('Admin kullanıcısı oluşturuldu:', user.email);
      return user;
    } catch (error) {
      //console.error('Admin kullanıcısı oluşturma hatası:', error);
      throw error;
    }
  },

  // Doğrulama kodunu al
  getVerificationCode: async (userId: string): Promise<string | null> => {
    try {
      // 6 haneli kod oluştur
      const verificationCode = generateVerificationCode();
      
      // Firestore'a kaydet
      const verificationRef = collection(db, 'verificationCodes');
      await addDoc(verificationRef, {
        userId: userId,
        code: verificationCode,
        createdAt: Timestamp.now(),
        used: false,
        expiresAt: Timestamp.fromDate(new Date(Date.now() + 5 * 60 * 1000)) // 5 dakika geçerli
      });

      return verificationCode;
    } catch (error) {
      //console.error('Doğrulama kodu oluşturma hatası:', error);
      return null;
    }
  }
}; 
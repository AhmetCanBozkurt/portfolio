import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebaseConfig';
import { getAuth } from 'firebase/auth';

export const StorageService = {
  // Görsel yükle
  uploadImage: async (file: File, path: string): Promise<string> => {
    try {
      // Auth kontrolü
      const auth = getAuth();
      /*console.log('Auth durumu:', {
        currentUser: auth.currentUser ? 'Var' : 'Yok',
        uid: auth.currentUser?.uid
      });*/


      if (!auth.currentUser) {
        throw new Error('Oturum açmanız gerekiyor');
      }

      const timestamp = Date.now();
      const safeFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
      const uniqueFileName = `${path}/${timestamp}_${safeFileName}`;
      
      /*console.log('Dosya bilgileri:', {
        originalName: file.name,
        safeFileName,
        uniqueFileName,
        type: file.type,
        size: file.size
      });*/


      const storageRef = ref(storage, uniqueFileName);
      //console.log('Storage referansı oluşturuldu:', storageRef.fullPath);

      //Blob olarak yükle
      const blob = new Blob([file], { type: file.type });
      /* //console.log('Blob oluşturuldu:', {
        size: blob.size,
        type: blob.type
      });*/

      // Firebase Storage'a yükle
      //console.log('Yükleme başlıyor...');
      const snapshot = await uploadBytes(storageRef, blob, {
        contentType: file.type,
        customMetadata: {
          uploadedBy: auth.currentUser.uid,
          originalName: file.name
        }
      });
      //console.log('Yükleme tamamlandı:', snapshot.metadata);

      // URL al
      //console.log('Download URL alınıyor...');
      const downloadURL = await getDownloadURL(snapshot.ref);
      //console.log('Download URL alındı:', downloadURL);
      
      return downloadURL;

    } catch (error) {
      /*console.error('Görsel yükleme hatası - Detaylı bilgi:', {
        error,
        errorMessage: error instanceof Error ? error.message : 'Bilinmeyen hata',
        errorStack: error instanceof Error ? error.stack : undefined
      });*/


      if (error instanceof Error) {
        if (error.message.includes('storage/unauthorized')) {
          throw new Error('Görsel yükleme izniniz yok. Lütfen giriş yapın.');
        }
        if (error.message.includes('storage/canceled')) {
          throw new Error('Görsel yükleme iptal edildi.');
        }
        if (error.message.includes('storage/unknown')) {
          throw new Error('Bilinmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
        }
        if (error.message.includes('storage/invalid-argument')) {
          throw new Error('Geçersiz dosya formatı veya boyutu.');
        }
      }
      throw new Error(`Görsel yüklenirken bir hata oluştu: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    }
  },

  // Görsel sil
  deleteImage: async (imageUrl: string): Promise<void> => {
    if (!imageUrl) {
      //console.log('Silinecek görsel URL\'i bulunamadı');
      return;
    }

    try {
      // Auth kontrolü
      const auth = getAuth();
      /*console.log('Auth durumu (silme):', {
        currentUser: auth.currentUser ? 'Var' : 'Yok',
        uid: auth.currentUser?.uid
      });*/


      if (!auth.currentUser) {
        throw new Error('Oturum açmanız gerekiyor');
      }

      // URL'den dosya yolunu çıkar
      let filePath = '';
      
      // Firebase Storage URL formatını kontrol et
      if (imageUrl.includes('firebasestorage.googleapis.com')) {
        const decodedUrl = decodeURIComponent(imageUrl);
        //console.log('URL decode edildi:', decodedUrl);

        const urlParts = decodedUrl.split('/o/')[1]?.split('?')[0];
        if (!urlParts) {
          //console.log('Geçersiz Storage URL formatı, silme işlemi atlanıyor');
          return;
        }
        filePath = urlParts.replace(/%2F/g, '/');
      } else {
        // Direkt dosya yolu verilmişse
        filePath = imageUrl.startsWith('/') ? imageUrl.substring(1) : imageUrl;
      }

      //console.log('Silinecek dosya yolu:', filePath);
      
      // Dosyanın varlığını kontrol et
      const fileRef = ref(storage, filePath);
      
      try {
        await getDownloadURL(fileRef);
      } catch (urlError) {
        //console.log('Dosya bulunamadı, silme işlemi atlanıyor');
        return;
      }
      
      //console.log('Storage referansı oluşturuldu (silme):', fileRef.fullPath);
      
      await deleteObject(fileRef);
      //console.log('Görsel başarıyla silindi');
    } catch (error) {
      /*console.error('Görsel silme hatası - Detaylı bilgi:', {
        error,
        errorMessage: error instanceof Error ? error.message : 'Bilinmeyen hata',
        errorStack: error instanceof Error ? error.stack : undefined
      });*/


      // Hata yönetimi
      if (error instanceof Error) {
        if (error.message.includes('storage/object-not-found')) {
          //console.log('Dosya zaten silinmiş veya bulunamadı');
          return;
        }
        if (error.message.includes('storage/unauthorized')) {
          throw new Error('Görsel silme izniniz yok. Lütfen giriş yapın.');
        }
        if (error.message.includes('storage/invalid-url')) {
          //console.log('Geçersiz URL formatı, silme işlemi atlanıyor');
          return;
        }
      }
      // Diğer hataları sessizce geç
      //console.log('Görsel silme hatası yoksayıldı:', error);
    }
  }
}; 
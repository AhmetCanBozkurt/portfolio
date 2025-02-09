import { FirebaseService } from '../services/firebaseService';
import { initialData } from '../data/initial-data';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';

export const migrateAboutDataToFirebase = async () => {
  try {
    //console.log('\nHakkımda bilgileri aktarılıyor...');
    
    // Önce mevcut about verilerini kontrol et
    const existingAbout = await FirebaseService.getAll('about');
    if (existingAbout.length > 0) {
      //console.log('Zaten hakkımda bilgileri mevcut. Aktarım yapılmayacak.');
      return;
    }

    // Hakkımda bilgilerini aktar
    for (const about of initialData.about) {
      try {
        const aboutData = {
          ...about,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        await FirebaseService.add('about', aboutData);
        //console.log(`✓ Hakkımda bilgisi aktarıldı: ${about.title}`);
      } catch (error) {
        //console.error(`✗ Hakkımda bilgisi aktarım hatası (${about.title}):`, error);
      }
    }

    // Aktarılan veri sayısını göster
    const aboutCount = (await FirebaseService.getAll('about')).length;
    //console.log(`\nAktarılan Hakkımda Bilgisi Sayısı: ${aboutCount}`);

  } catch (error) {
    //console.error('Veri aktarımı sırasında hata:', error);
    throw error;
  }
};

export const migrateDataToFirebase = async () => {
  try {
    //console.log('Veri aktarımı başlıyor...');
    
    // Projeleri Aktar
    //console.log('\nProjeler aktarılıyor...');
    for (const project of initialData.projects) {
      try {
        const projectData = {
          ...project,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        await FirebaseService.add('projects', projectData);
        //console.log(`✓ Proje aktarıldı: ${project.title}`);
      } catch (error) {
        //console.error(`✗ Proje aktarım hatası (${project.title}):`, error);
      }
    }

    // Teknolojileri Aktar
    //console.log('\nTeknolojiler aktarılıyor...');
    for (const tech of initialData.technologies) {
      try {
        const techData = {
          ...tech,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        await FirebaseService.add('technologies', techData);
        //console.log(`✓ Teknoloji aktarıldı: ${tech.name}`);
      } catch (error) {
        //console.error(`✗ Teknoloji aktarım hatası (${tech.name}):`, error);
      }
    }

    // Eğitim Bilgilerini Aktar
    //console.log('\nEğitim bilgileri aktarılıyor...');
    for (const edu of initialData.education) {
      try {
        const eduData = {
          ...edu,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        await FirebaseService.add('education', eduData);
        //console.log(`✓ Eğitim bilgisi aktarıldı: ${edu.school}`);
      } catch (error) {
        //console.error(`✗ Eğitim bilgisi aktarım hatası (${edu.school}):`, error);
      }
    }

    // Sertifikaları Aktar
    //console.log('\nSertifikalar aktarılıyor...');
    for (const cert of initialData.certificates) {
      try {
        const certData = {
          ...cert,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        await FirebaseService.add('certificates', certData);
        //console.log(`✓ Sertifika aktarıldı: ${cert.title}`);
      } catch (error) {
        //console.error(`✗ Sertifika aktarım hatası (${cert.title}):`, error);
      }
    }

    // Blog Yazılarını Aktar
    //console.log('\nBlog yazıları aktarılıyor...');
    for (const post of initialData.blogPosts) {
      try {
        const postData = {
          ...post,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        await FirebaseService.add('blogPosts', postData);
        //console.log(`✓ Blog yazısı aktarıldı: ${post.title}`);
      } catch (error) {
        //console.error(`✗ Blog yazısı aktarım hatası (${post.title}):`, error);
      }
    }

    // Hakkımda Bilgilerini Aktar
    await migrateAboutDataToFirebase();

    //console.log('\nVeri aktarımı tamamlandı!');
    
    // Aktarılan veri sayılarını göster
    const projectCount = (await FirebaseService.getAll('projects')).length;
    const techCount = (await FirebaseService.getAll('technologies')).length;
    const eduCount = (await FirebaseService.getAll('education')).length;
    const certCount = (await FirebaseService.getAll('certificates')).length;
    const blogCount = (await FirebaseService.getAll('blogPosts')).length;

    //console.log('\nAktarılan Veri Sayıları:');
    //console.log(`Projeler: ${projectCount}`);
    //console.log(`Teknolojiler: ${techCount}`);
    //console.log(`Eğitim Bilgileri: ${eduCount}`);
    //console.log(`Sertifikalar: ${certCount}`);
    //console.log(`Blog Yazıları: ${blogCount}`);

  } catch (error) {
    //console.error('Veri aktarımı sırasında hata:', error);
    throw error;
  }
};

export const createAdminUser = async () => {
  try {
    //console.log('\nAdmin kullanıcısı oluşturuluyor...');
    
    // Önce mevcut admin kullanıcısını kontrol et
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('role', '==', 'admin'));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      //console.log('Admin kullanıcısı zaten mevcut.');
      return;
    }

    // Admin kullanıcısını oluştur
    const adminUser = {
      email: 'ahmetcanb785@gmail.com', // Kendi e-posta adresinizi girin
      role: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await FirebaseService.add('users', adminUser);
    //console.log('Admin kullanıcısı başarıyla oluşturuldu.');

  } catch (error) {
    //console.error('Admin kullanıcısı oluşturma hatası:', error);
    throw error;
  }
}; 
# Modern Portfolio Web Uygulaması

![Portfolio Preview](public/portfolio-preview.png)

Bu proje, modern web teknolojileri kullanılarak geliştirilmiş, tam kapsamlı bir portföy web uygulamasıdır. Dinamik içerik yönetimi, blog yazıları, proje vitrinleri ve iletişim özellikleri ile profesyonel bir portföy deneyimi sunar.

## 🚀 Özellikler

- **Modern ve Duyarlı Tasarım**
  - Tüm cihazlarda kusursuz görüntüleme
  - Karanlık/Aydınlık tema desteği
  - Smooth scroll ve sayfa geçişleri
  - Framer Motion ile etkileyici animasyonlar

- **Dinamik İçerik Yönetimi**
  - Firebase ile gerçek zamanlı veri yönetimi
  - Güvenli admin paneli
  - Blog yazıları yönetimi
  - Proje portföyü yönetimi
  - Teknoloji stack'i yönetimi

- **Blog Sistemi**
  - Markdown desteği
  - Kategori ve etiket sistemi
  - Dinamik URL yapısı
  - Zengin metin editörü

- **İletişim Sistemi**
  - EmailJS entegrasyonu
  - Otomatik e-posta bildirimleri
  - İletişim formu spam koruması
  - Admin yanıt sistemi

- **Güvenlik**
  - Firebase Authentication
  - İki faktörlü doğrulama (2FA)
  - Role-based access control
  - Güvenli dosya yükleme

## 🛠️ Kullanılan Teknolojiler

### Frontend
- **React 18** - Modern UI geliştirme
- **TypeScript** - Tip güvenliği ve geliştirici deneyimi
- **Vite** - Hızlı geliştirme ve build süreci
- **Tailwind CSS** - Modern ve özelleştirilebilir stil sistemi
- **Framer Motion** - Gelişmiş animasyonlar
- **React Router v6** - Sayfa yönlendirme ve navigasyon
- **React Icons** - Kapsamlı ikon kütüphanesi
- **React Markdown** - Markdown içerik görüntüleme
- **React Toastify** - Bildirim sistemi

### Backend ve Veritabanı
- **Firebase** 
  - Firestore - NoSQL veritabanı
  - Authentication - Kullanıcı yönetimi
  - Storage - Dosya depolama
  - Hosting - Web hosting
  - Security Rules - Güvenlik kuralları

### İletişim ve Bildirimler
- **EmailJS** - E-posta gönderimi ve şablonları
- **UUID** - Benzersiz ID üretimi

### Geliştirme Araçları
- **ESLint** - Kod kalitesi ve standartları
- **Prettier** - Kod formatlama
- **Git** - Versiyon kontrolü
- **npm** - Paket yönetimi

## 🌟 Öne Çıkan Özellikler

1. **3D Uzay Teması**
   - Three.js ile geliştirilmiş interaktif 3D arkaplan
   - Özelleştirilebilir gezegen ve yıldız animasyonları

2. **Admin Paneli**
   - Kapsamlı içerik yönetimi
   - Gerçek zamanlı istatistikler
   - Aktivite logları
   - Mesaj yönetimi

3. **SEO Optimizasyonu**
   - Meta tag yönetimi
   - Dinamik başlıklar
   - Sitemap oluşturma
   - Robots.txt yapılandırması

4. **Performans**
   - Lazy loading
   - Code splitting
   - Image optimization
   - Caching stratejileri

## 📦 Kurulum

1. Repoyu klonlayın:
```bash
git clone https://github.com/yourusername/portfolio.git
```

2. Bağımlılıkları yükleyin:
```bash
cd portfolio
npm install
```

3. `.env` dosyasını oluşturun:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

4. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

## 🚀 Deployment

1. Production build oluşturun:
```bash
npm run build
```

2. Firebase'e deploy edin:
```bash
firebase deploy
```

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 🤝 İletişim

Ahmet Can Bozkurt - [LinkedIn](https://www.linkedin.com/in/ahmetcanbozkurt/) - ahmetcanb785@gmail.com

Proje Link: [https://github.com/yourusername/portfolio](https://github.com/yourusername/portfolio)

---

⭐️ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!

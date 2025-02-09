import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';
type Language = 'tr' | 'en';

interface AppContextType {
  theme: Theme;
  language: Language;
  toggleTheme: () => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Çeviriler
const translations = {
  tr: {
    'nav.home': 'Ana Sayfa',
    'nav.about': 'Hakkımda',
    'nav.projects': 'Projeler',
    'nav.blog': 'Blog',
    'nav.contact': 'İletişim',
    'projects.title': 'Tüm Projeler',
    'projects.description': 'Geliştirdiğim tüm projeler. Arama yapabilir, teknolojiye göre filtreleyebilir veya detaylı bilgi için projelere tıklayabilirsiniz.',
    'projects.search': 'Proje ara...',
    'projects.filter': 'Filtrele',
    'projects.all': 'Tümü',
    'projects.viewDetails': 'Detayları Gör',
    'projects.noResults': 'Arama kriterlerinize uygun proje bulunamadı.',
    'projects.noTechResults': 'Seçilen teknoloji ile ilgili proje bulunamadı.',
    'projects.showAll': 'Tüm projeleri göster',
    // Diğer çeviriler...
  },
  en: {
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.projects': 'Projects',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',
    'projects.title': 'All Projects',
    'projects.description': 'All projects I have developed. You can search, filter by technology, or click for detailed information.',
    'projects.search': 'Search projects...',
    'projects.filter': 'Filter',
    'projects.all': 'All',
    'projects.viewDetails': 'View Details',
    'projects.noResults': 'No projects found matching your search criteria.',
    'projects.noTechResults': 'No projects found with the selected technology.',
    'projects.showAll': 'Show all projects',
    // Other translations...
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Başlangıç değerlerini localStorage'dan al veya varsayılan değerleri kullan
  const [theme, setTheme] = useState<Theme>(() => 
    (localStorage.getItem('theme') as Theme) || 'dark'
  );
  const [language, setLanguage] = useState<Language>(() =>
    (localStorage.getItem('language') as Language) || 'tr'
  );

  // Theme değiştiğinde localStorage'a kaydet ve HTML class'ını güncelle
  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.style.setProperty('--background', '#000000');
      document.documentElement.style.setProperty('--text', '#ffffff');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.setProperty('--background', '#ffffff');
      document.documentElement.style.setProperty('--text', '#1a1a1a');
    }
  }, [theme]);

  // Dil değiştiğinde localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'tr' ? 'en' : 'tr');
  };

  // Çeviri fonksiyonu
  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <AppContext.Provider value={{ theme, language, toggleTheme, toggleLanguage, t }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook
export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}; 
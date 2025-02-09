import React, { useEffect, useState } from 'react';
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram } from 'react-icons/fa';
import { useApp } from '../contexts/AppContext';
import { aboutService } from '../services/aboutService';

interface AboutData {
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  };
}

const Footer = () => {
  const { theme } = useApp();
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  
  useEffect(() => {
    const loadAboutData = async () => {
      try {
        const data = await aboutService.getAllAbout();
        if (data.length > 0) {
          setAboutData(data[0]);
        }
      } catch (error) {
        ////console.error('Footer about verisi yüklenirken hata:', error);
      }
    };

    loadAboutData();
  }, []);
  
  return (
    <footer className={`py-8 transition-colors duration-300
      ${theme === 'dark'
        ? 'bg-dark-surface border-t border-dark-border'
        : 'bg-light-surface border-t border-light-border'}`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Sol Taraf - Telif Hakkı */}
          <div className={`text-sm transition-colors
            ${theme === 'dark' ? 'text-dark-secondary' : 'text-light-secondary'}`}>
            © 2025 Ahmet Can Bozkurt Tarafından Geliştirilmiştir.
          </div>

          {/* Orta - Sosyal Medya */}
          <div className="flex items-center space-x-4">
            {aboutData?.socialLinks?.github && (
              <a
                href={aboutData.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-full transition-colors hover:text-primary
                  ${theme === 'dark' ? 'text-dark-secondary' : 'text-light-secondary'}`}
              >
                <FaGithub className="text-xl" />
              </a>
            )}
            {aboutData?.socialLinks?.linkedin && (
              <a
                href={aboutData.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-full transition-colors hover:text-primary
                  ${theme === 'dark' ? 'text-dark-secondary' : 'text-light-secondary'}`}
              >
                <FaLinkedin className="text-xl" />
              </a>
            )}
            {aboutData?.socialLinks?.twitter && (
              <a
                href={aboutData.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-full transition-colors hover:text-primary
                  ${theme === 'dark' ? 'text-dark-secondary' : 'text-light-secondary'}`}
              >
                <FaTwitter className="text-xl" />
              </a>
            )}
            {aboutData?.socialLinks?.instagram && (
              <a
                href={aboutData.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-full transition-colors hover:text-primary
                  ${theme === 'dark' ? 'text-dark-secondary' : 'text-light-secondary'}`}
              >
                <FaInstagram className="text-xl" />
              </a>
            )}
          </div>

          {/* Sağ Taraf - E-posta */}
          <a
            href="mailto:ahmetcanb785@gmail.com"
            className={`text-sm transition-colors hover:text-primary
              ${theme === 'dark' ? 'text-dark-secondary' : 'text-light-secondary'}`}
          >
            ahmetcanb785@gmail.com
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
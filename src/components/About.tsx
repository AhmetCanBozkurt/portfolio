import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { aboutService } from '../services/aboutService';
import { technologyService } from '../services/technologyService';
import { useApp } from '../contexts/AppContext';

interface AboutData {
  id?: string;
  title: string;
  content: string;
  profileImage?: string;
}

interface Technology {
  id: string;
  name: string;
  icon: string;
  category: string;
  level: string;
  description: string;
  yearsOfExperience: number;
}

const About: React.FC = () => {
  const { theme } = useApp();
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [aboutResult, techResult] = await Promise.all([
        aboutService.getAllAbout(),
        technologyService.getAllTechnologies()
      ]);

      if (aboutResult.length > 0) {
        setAboutData(aboutResult[0]);
      }
      setTechnologies(techResult);
    } catch (error) {
    //  //console.error('Veriler yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="about" className="py-32">
        <div className="max-w-screen-lg mx-auto px-4">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-700 rounded w-1/4"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-700 rounded w-5/6"></div>
              <div className="h-4 bg-gray-700 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className={`py-20 overflow-hidden transition-colors duration-300
      ${theme === 'dark' ? 'bg-dark-background' : 'bg-light-background'}`}
    >
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 transition-colors
            ${theme === 'dark' ? 'text-dark-text' : 'text-light-text'}`}>
            Hakkımda
          </h2>
        </motion.div>

        {/* Profil Fotoğrafı */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex justify-center mb-8"
        >
          <div className={`relative w-48 h-48 rounded-full overflow-hidden border-4
            ${theme === 'dark' 
              ? 'border-primary shadow-lg shadow-primary/20' 
              : 'border-primary shadow-lg shadow-primary/20'}`}
          >
            {aboutData?.profileImage ? (
              <img
                src={aboutData.profileImage}
                alt="Profil"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-profile.jpg';
                }}
              />
            ) : (
              <div className={`w-full h-full flex items-center justify-center text-4xl
                ${theme === 'dark' ? 'bg-dark-surface' : 'bg-light-surface'}`}>
                👤
              </div>
            )}
          </div>
        </motion.div>

        {/* Hakkımda Metni */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className={`max-w-2xl mx-auto text-lg transition-colors
            ${theme === 'dark' ? 'text-dark-secondary' : 'text-light-secondary'}`}>
            {aboutData?.content || 'Yazılım geliştirme tutkum ve modern teknolojilere olan ilgimle, kullanıcı deneyimini ön planda tutan projeler geliştiriyorum.'}
          </p>
        </motion.div>

        {/* Teknoloji Slider */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className={`text-2xl font-bold mb-8 text-center transition-colors
            ${theme === 'dark' ? 'text-dark-text' : 'text-light-text'}`}>
            Teknolojiler
          </h3>
          
          {/* Sonsuz Döngülü Teknoloji Kartları */}
          <div className="relative w-full overflow-hidden py-4">
            <div className={`absolute left-0 top-0 w-20 h-full z-10 pointer-events-none
              ${theme === 'dark' 
                ? 'bg-gradient-to-r from-dark-background to-transparent'
                : 'bg-gradient-to-r from-light-background to-transparent'}`} />
            <div className={`absolute right-0 top-0 w-20 h-full z-10 pointer-events-none
              ${theme === 'dark'
                ? 'bg-gradient-to-l from-dark-background to-transparent'
                : 'bg-gradient-to-l from-light-background to-transparent'}`} />
            
            <motion.div
              initial={{ x: "0%" }}
              animate={{ x: "-50%" }}
              transition={{
                x: {
                  duration: 30,
                  repeat: Infinity,
                  ease: "linear",
                  repeatType: "mirror"
                }
              }}
              className="flex gap-6 whitespace-nowrap"
              style={{ width: "fit-content" }}
            >
              {[...technologies, ...technologies, ...technologies].map((tech, index) => (
                <motion.div
                  key={`${tech.id}-${index}`}
                  whileHover={{ scale: 1.05 }}
                  className={`flex flex-col items-center gap-3 p-6 rounded-xl transition-all cursor-pointer
                    ${theme === 'dark'
                      ? 'bg-dark-surface/80 border border-purple-500/20 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/20'
                      : 'bg-light-surface/80 border border-purple-500/20 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/20'}`}
                  style={{ width: "140px" }}
                >
                  {tech.icon && (
                    <div className="w-16 h-16 flex items-center justify-center">
                      <img
                        src={tech.icon}
                        alt={tech.name}
                        className="w-12 h-12 object-contain"
                      />
                    </div>
                  )}
                  <span className={`font-medium text-center transition-colors text-sm
                    ${theme === 'dark' ? 'text-dark-text' : 'text-light-text'}`}>
                    {tech.name}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full bg-purple-500/10 text-purple-500`}>
                    {tech.level}
                  </span>
                  <span className={`text-xs
                    ${theme === 'dark' ? 'text-dark-secondary' : 'text-light-secondary'}`}>
                    {tech.yearsOfExperience} Yıl
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About; 
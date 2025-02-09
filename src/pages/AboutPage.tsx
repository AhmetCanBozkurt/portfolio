import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { aboutService } from '../services/aboutService';
import { technologyService } from '../services/technologyService';
import { educationService } from '../services/educationService';
import { certificateService } from '../services/certificateService';
import { projectService } from '../services/projectService';
import { useApp } from '../contexts/AppContext';
import Layout from '../components/Layout';
import { FaGraduationCap, FaCertificate, FaCode, FaProjectDiagram, FaDownload, FaUser } from 'react-icons/fa';

interface AboutData {
  id?: string;
  title: string;
  content: string;
  profileImage?: string;
  cvFile?: string;
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

interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description: string;
  location: string;
}

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
  imageUrl?: string;
  credentialUrl?: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
}

const AboutPage = () => {
  const { theme } = useApp();
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [aboutResult, techResult, eduResult, certResult, projResult] = await Promise.all([
        aboutService.getAllAbout(),
        technologyService.getAllTechnologies(),
        educationService.getAllEducation(),
        certificateService.getAllCertificates(),
        projectService.getAllProjects()
      ]);

      if (aboutResult.length > 0) {
        setAboutData(aboutResult[0]);
      }
      setTechnologies(techResult);
      setEducation(eduResult);
      setCertificates(certResult);
      setProjects(projResult);
    } catch (error) {
      //console.error('Veriler yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2
            ${theme === 'dark' ? 'border-primary' : 'border-primary'}`} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={`min-h-screen pt-20 transition-colors duration-300
        ${theme === 'dark' ? 'bg-dark-background' : 'bg-light-background'}`}
      >
        {/* Üst Bölüm - Profil */}
        <section className={`py-20 ${theme === 'dark' ? 'bg-dark-surface' : 'bg-light-surface'}`}>
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-12">
              {/* Profil Fotoğrafı */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-48 h-48 relative"
              >
                <div className={`w-full h-full rounded-full overflow-hidden border-4
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
                      <FaUser />
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Profil Bilgileri */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex-1 text-center md:text-left"
              >
                {/* CV İndirme Butonu */}
                {aboutData?.cvFile && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mb-8"
                  >
                    <a
                      href={aboutData.cvFile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center px-6 py-3 rounded-lg transition-colors
                        ${theme === 'dark'
                          ? 'bg-primary/10 hover:bg-primary/20 text-primary'
                          : 'bg-primary/10 hover:bg-primary/20 text-primary'}`}
                    >
                      <FaDownload className="mr-2" />
                      CV'yi İndir
                    </a>
                  </motion.div>
                )}

                <h1 className={`text-4xl md:text-5xl font-bold mb-4 transition-colors
                  ${theme === 'dark' ? 'text-dark-text' : 'text-light-text'}`}>
                  {aboutData?.title || 'Hakkımda'}
                </h1>
                
                <p className={`max-w-2xl mx-auto text-lg transition-colors
                  ${theme === 'dark' ? 'text-dark-secondary' : 'text-light-secondary'}`}>
                  {aboutData?.content || 'Yükleniyor...'}
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Eğitim Bölümü */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className={`text-3xl font-bold mb-4 flex items-center justify-center gap-3 transition-colors
                ${theme === 'dark' ? 'text-dark-text' : 'text-light-text'}`}>
                <FaGraduationCap className="text-primary" />
                Eğitim
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {education.map((edu, index) => (
                <motion.div
                  key={edu.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`p-6 rounded-lg transition-all
                    ${theme === 'dark'
                      ? 'bg-dark-surface hover:shadow-lg hover:shadow-primary/5'
                      : 'bg-light-surface hover:shadow-lg hover:shadow-primary/5'}`}
                >
                  <h3 className={`text-xl font-bold mb-2 transition-colors
                    ${theme === 'dark' ? 'text-dark-text' : 'text-light-text'}`}>
                    {edu.school}
                  </h3>
                  <p className={`text-primary font-medium mb-2`}>
                    {edu.degree} - {edu.field}
                  </p>
                  <p className={`text-sm mb-2 transition-colors
                    ${theme === 'dark' ? 'text-dark-secondary' : 'text-light-secondary'}`}>
                    {edu.startDate} - {edu.endDate}
                  </p>
                  <p className={`text-sm transition-colors
                    ${theme === 'dark' ? 'text-dark-secondary' : 'text-light-secondary'}`}>
                    {edu.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Sertifikalar Bölümü */}
        <section className={`py-20 ${theme === 'dark' ? 'bg-dark-surface' : 'bg-light-surface'}`}>
          <div className="max-w-7xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className={`text-3xl font-bold mb-4 flex items-center justify-center gap-3 transition-colors
                ${theme === 'dark' ? 'text-dark-text' : 'text-light-text'}`}>
                <FaCertificate className="text-primary" />
                Sertifikalar
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {certificates.map((cert, index) => (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`p-6 rounded-lg transition-all
                    ${theme === 'dark'
                      ? 'bg-dark-background hover:shadow-lg hover:shadow-primary/5'
                      : 'bg-light-background hover:shadow-lg hover:shadow-primary/5'}`}
                >
                  {cert.imageUrl && (
                    <img
                      src={cert.imageUrl}
                      alt={cert.title}
                      className="w-full h-32 object-cover rounded-lg mb-4"
                    />
                  )}
                  <h3 className={`text-lg font-bold mb-2 transition-colors
                    ${theme === 'dark' ? 'text-dark-text' : 'text-light-text'}`}>
                    {cert.title}
                  </h3>
                  <p className={`text-primary font-medium mb-2`}>
                    {cert.issuer}
                  </p>
                  <p className={`text-sm mb-2 transition-colors
                    ${theme === 'dark' ? 'text-dark-secondary' : 'text-light-secondary'}`}>
                    {new Date(cert.date).toLocaleDateString('tr-TR')}
                  </p>
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-accent transition-colors text-sm"
                    >
                      Sertifikayı Görüntüle →
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Teknolojiler Bölümü */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className={`text-3xl font-bold mb-4 flex items-center justify-center gap-3 transition-colors
                ${theme === 'dark' ? 'text-dark-text' : 'text-light-text'}`}>
                <FaCode className="text-primary" />
                Teknolojiler
              </h2>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {technologies.map((tech, index) => (
                <motion.div
                  key={tech.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`p-6 rounded-lg text-center transition-all
                    ${theme === 'dark'
                      ? 'bg-dark-surface hover:shadow-lg hover:shadow-primary/5'
                      : 'bg-light-surface hover:shadow-lg hover:shadow-primary/5'}`}
                >
                  {tech.icon && (
                    <img
                      src={tech.icon}
                      alt={tech.name}
                      className="w-16 h-16 mx-auto mb-4 object-contain"
                    />
                  )}
                  <h3 className={`text-lg font-bold mb-2 transition-colors
                    ${theme === 'dark' ? 'text-dark-text' : 'text-light-text'}`}>
                    {tech.name}
                  </h3>
                  <p className={`text-sm font-medium mb-2 text-primary`}>
                    {tech.level}
                  </p>
                  <p className={`text-sm transition-colors
                    ${theme === 'dark' ? 'text-dark-secondary' : 'text-light-secondary'}`}>
                    {tech.yearsOfExperience} Yıl Deneyim
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Projeler Bölümü */}
        <section className={`py-20 ${theme === 'dark' ? 'bg-dark-surface' : 'bg-light-surface'}`}>
          <div className="max-w-7xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className={`text-3xl font-bold mb-4 flex items-center justify-center gap-3 transition-colors
                ${theme === 'dark' ? 'text-dark-text' : 'text-light-text'}`}>
                <FaProjectDiagram className="text-primary" />
                Öne Çıkan Projeler
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.slice(0, 6).map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`rounded-lg overflow-hidden transition-all
                    ${theme === 'dark'
                      ? 'bg-dark-background hover:shadow-lg hover:shadow-primary/5'
                      : 'bg-light-background hover:shadow-lg hover:shadow-primary/5'}`}
                >
                  {project.imageUrl && (
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <h3 className={`text-xl font-bold mb-2 transition-colors
                      ${theme === 'dark' ? 'text-dark-text' : 'text-light-text'}`}>
                      {project.title}
                    </h3>
                    <p className={`text-sm mb-4 line-clamp-2 transition-colors
                      ${theme === 'dark' ? 'text-dark-secondary' : 'text-light-secondary'}`}>
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className={`px-2 py-1 text-xs rounded-full
                            ${theme === 'dark'
                              ? 'bg-primary/10 text-primary'
                              : 'bg-primary/10 text-primary'}`}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-4">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-accent transition-colors"
                        >
                          GitHub
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-accent transition-colors"
                        >
                          Canlı Demo
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default AboutPage; 
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaArrowLeft } from 'react-icons/fa';
import { projectService } from '../services/projectService';
import { useApp } from '../contexts/AppContext';
import Layout from '../components/Layout';

interface Project {
  id: string;
  title: string;
  description: string;
  content?: string;
  imageUrl?: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  features?: string[];
  challenges?: string[];
  learnings?: string[];
}

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useApp();

  useEffect(() => {
    const loadProject = async () => {
      try {
        if (!id) return;
        const data = await projectService.getProjectById(id);
        setProject(data);
      } catch (error) {
        //console.error('Proje yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen pt-20 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <div className="min-h-screen pt-20 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Proje bulunamadı</h1>
            <a href="/projects" className="text-primary hover:text-accent">
              Projelere Dön
            </a>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <article className={`min-h-screen pt-20 transition-colors duration-300
        ${theme === 'dark' ? 'bg-dark-background' : 'bg-light-background'}`}
      >
        {/* Hero Section */}
        <div className="relative h-[50vh] min-h-[400px] w-full overflow-hidden">
          {project.imageUrl ? (
            <>
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${project.imageUrl})` }}
              />
              <div className="absolute inset-0 bg-black/50" />
            </>
          ) : (
            <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-dark-surface' : 'bg-light-surface'}`} />
          )}
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl md:text-5xl font-bold mb-6 text-white"
              >
                {project.title}
              </motion.h1>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-wrap justify-center gap-4 mb-8"
              >
                {project.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 rounded-full bg-primary/20 text-white text-sm font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex justify-center gap-4"
              >
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary hover:bg-accent transition-colors text-white font-medium"
                  >
                    <FaGithub /> GitHub
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary hover:bg-accent transition-colors text-white font-medium"
                  >
                    <FaExternalLinkAlt /> Canlı Demo
                  </a>
                )}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-4xl mx-auto px-4 py-16">
          {/* Proje Açıklaması */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h2 className={`text-2xl font-bold mb-4 transition-colors
              ${theme === 'dark' ? 'text-dark-text' : 'text-light-text'}`}>
              Proje Hakkında
            </h2>
            <p className={`text-lg leading-relaxed transition-colors
              ${theme === 'dark' ? 'text-dark-secondary' : 'text-light-secondary'}`}>
              {project.description}
            </p>
            {project.content && (
              <div className={`mt-4 text-lg leading-relaxed transition-colors
                ${theme === 'dark' ? 'text-dark-secondary' : 'text-light-secondary'}`}>
                {project.content}
              </div>
            )}
          </motion.div>

          {/* Özellikler */}
          {project.features && project.features.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-12"
            >
              <h2 className={`text-2xl font-bold mb-4 transition-colors
                ${theme === 'dark' ? 'text-dark-text' : 'text-light-text'}`}>
                Özellikler
              </h2>
              <ul className="list-disc list-inside space-y-2">
                {project.features.map((feature, index) => (
                  <li
                    key={index}
                    className={`transition-colors
                      ${theme === 'dark' ? 'text-dark-secondary' : 'text-light-secondary'}`}
                  >
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Zorluklar ve Çözümler */}
          {project.challenges && project.challenges.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-12"
            >
              <h2 className={`text-2xl font-bold mb-4 transition-colors
                ${theme === 'dark' ? 'text-dark-text' : 'text-light-text'}`}>
                Zorluklar ve Çözümler
              </h2>
              <ul className="list-disc list-inside space-y-2">
                {project.challenges.map((challenge, index) => (
                  <li
                    key={index}
                    className={`transition-colors
                      ${theme === 'dark' ? 'text-dark-secondary' : 'text-light-secondary'}`}
                  >
                    {challenge}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Öğrenilen Dersler */}
          {project.learnings && project.learnings.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h2 className={`text-2xl font-bold mb-4 transition-colors
                ${theme === 'dark' ? 'text-dark-text' : 'text-light-text'}`}>
                Öğrenilen Dersler
              </h2>
              <ul className="list-disc list-inside space-y-2">
                {project.learnings.map((learning, index) => (
                  <li
                    key={index}
                    className={`transition-colors
                      ${theme === 'dark' ? 'text-dark-secondary' : 'text-light-secondary'}`}
                  >
                    {learning}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>

        {/* Geri Dön Butonu */}
        <div className="max-w-4xl mx-auto px-4 pb-16">
          <motion.a
            href="/projects"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg transition-colors
              ${theme === 'dark'
                ? 'bg-dark-surface hover:bg-dark-border text-dark-text'
                : 'bg-light-surface hover:bg-light-border text-light-text'}`}
          >
            <FaArrowLeft /> Projelere Dön
          </motion.a>
        </div>
      </article>
    </Layout>
  );
};

export default ProjectDetail; 
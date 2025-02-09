import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '../types/project';
import { projectService } from '../services/projectService';
import ProjectCard from '../components/ProjectCard';
import { FaFilter } from 'react-icons/fa';
import Layout from '../components/Layout';
import { useApp } from '../contexts/AppContext';

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const { theme, t } = useApp();

  // Sayfa yüklendiğinde scroll'u en üste al
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await projectService.getAllProjects();
        setProjects(data);
      } catch (err) {
        setError('Projeler yüklenirken bir hata oluştu.');
        //console.error('Proje yükleme hatası:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Tüm teknolojileri topla ve sırala
  const allTechnologies = Array.from(
    new Set(projects.flatMap((project) => project.technologies))
  ).sort();

  // Projeleri filtrele
  const filteredProjects = projects
    .filter((project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((project) =>
      selectedTech ? project.technologies.includes(selectedTech) : true
    );

  const content = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center min-h-screen pt-16">
          <div className="relative w-20 h-20">
            <div className={`absolute top-0 left-0 w-full h-full border-4 rounded-full animate-ping
              ${theme === 'dark' ? 'border-primary/30' : 'border-primary/30'}`} />
            <div className={`absolute top-0 left-0 w-full h-full border-4 border-t-primary rounded-full animate-spin`} />
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="min-h-screen pt-16 flex items-center justify-center">
          <div className={`text-center p-8 rounded-lg border
            ${theme === 'dark'
              ? 'bg-dark-surface/50 border-red-500/20'
              : 'bg-light-surface/50 border-red-500/20'}`}
          >
            <p className="text-red-500 font-medium">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              {t('projects.retry')}
            </button>
          </div>
        </div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`min-h-screen pt-16 pb-20 px-4 transition-colors duration-300
          ${theme === 'dark'
            ? 'bg-gradient-to-b from-dark-surface to-dark-background'
            : 'bg-gradient-to-b from-light-surface to-light-background'}`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <motion.h1
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={`text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r
                ${theme === 'dark'
                  ? 'from-purple-500 to-purple-300'
                  : 'from-purple-600 to-purple-400'}`}
            >
              {t('projects.title')}
            </motion.h1>
            <motion.p
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className={theme === 'dark' ? 'text-dark-secondary' : 'text-light-secondary'}
            >
              {t('projects.description')}
            </motion.p>
          </div>

          {/* Arama ve Filtre Alanı */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between max-w-4xl mx-auto">
              {/* Arama Kutusu */}
              <div className="relative w-full md:w-96">
                <input
                  type="text"
                  placeholder={t('projects.search')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors
                    ${theme === 'dark'
                      ? 'bg-dark-surface/50 border border-dark-border text-dark-text placeholder-dark-secondary'
                      : 'bg-light-surface/50 border border-light-border text-light-text placeholder-light-secondary'}`}
                />
              </div>

              {/* Filtre Butonu */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors
                  ${theme === 'dark'
                    ? 'bg-dark-surface/50 border border-dark-border hover:bg-dark-surface'
                    : 'bg-light-surface/50 border border-light-border hover:bg-light-surface'}`}
              >
                <FaFilter className={theme === 'dark' ? 'text-dark-secondary' : 'text-light-secondary'} />
                <span className={theme === 'dark' ? 'text-dark-text' : 'text-light-text'}>
                  {t('projects.filter')}
                </span>
                <span className={`ml-2 px-2 py-0.5 text-xs rounded-full
                  ${theme === 'dark'
                    ? 'bg-primary/20 text-primary'
                    : 'bg-primary/20 text-primary'}`}
                >
                  {selectedTech || t('projects.all')}
                </span>
              </button>
            </div>

            {/* Teknoloji Filtreleri */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-wrap justify-center gap-2 mt-6 max-w-4xl mx-auto">
                    <button
                      onClick={() => setSelectedTech(null)}
                      className={`px-4 py-2 rounded-lg transition-all
                        ${!selectedTech
                          ? 'bg-primary text-white shadow-lg shadow-primary/30'
                          : theme === 'dark'
                            ? 'bg-dark-surface/50 text-dark-text hover:bg-dark-surface border border-dark-border'
                            : 'bg-light-surface/50 text-light-text hover:bg-light-surface border border-light-border'}`}
                    >
                      {t('projects.all')}
                    </button>
                    {allTechnologies.map((tech) => (
                      <button
                        key={tech}
                        onClick={() => setSelectedTech(tech)}
                        className={`px-4 py-2 rounded-lg transition-all
                          ${selectedTech === tech
                            ? 'bg-primary text-white shadow-lg shadow-primary/30'
                            : theme === 'dark'
                              ? 'bg-dark-surface/50 text-dark-text hover:bg-dark-surface border border-dark-border'
                              : 'bg-light-surface/50 text-light-text hover:bg-light-surface border border-light-border'}`}
                      >
                        {tech}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Proje Listesi */}
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence>
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredProjects.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className={`p-8 max-w-md mx-auto rounded-lg border
                ${theme === 'dark'
                  ? 'bg-dark-surface/50 border-dark-border'
                  : 'bg-light-surface/50 border-light-border'}`}
              >
                <p className={theme === 'dark' ? 'text-dark-secondary' : 'text-light-secondary'}>
                  {searchTerm
                    ? t('projects.noResults')
                    : t('projects.noTechResults')}
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedTech(null);
                  }}
                  className="mt-4 text-primary hover:text-accent transition-colors"
                >
                  {t('projects.showAll')}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    );
  };

  return <Layout>{content()}</Layout>;
};

export default Projects; 
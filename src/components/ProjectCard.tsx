import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Project } from '../types/project';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import { useApp } from '../contexts/AppContext';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const { theme } = useApp();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 group relative
        ${theme === 'dark'
          ? 'bg-gradient-to-br from-dark-surface to-dark-background shadow-purple-500/20 hover:shadow-purple-500/40 border border-purple-500/20 hover:border-purple-500/30'
          : 'bg-gradient-to-br from-light-surface to-light-background shadow-purple-500/30 hover:shadow-purple-500/50 border border-purple-500/20 hover:border-purple-500/30'}`}
    >
      {/* Görsel Alanı */}
      <div className="relative h-48 overflow-hidden">
        {project.imageUrl ? (
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-project.jpg';
            }}
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center
            ${theme === 'dark' ? 'bg-dark-surface' : 'bg-light-surface'}`}>
            <span className="text-4xl">🖼️</span>
          </div>
        )}
        <div className={`absolute inset-0 bg-gradient-to-t opacity-80
          ${theme === 'dark'
            ? 'from-dark-background via-dark-background/50 to-transparent'
            : 'from-light-background via-light-background/50 to-transparent'}`} />
      </div>

      {/* İçerik Alanı */}
      <div className="p-6 relative z-10">
        <h3 className={`text-2xl font-bold mb-3 group-hover:text-primary transition-colors duration-300
          ${theme === 'dark' ? 'text-dark-text' : 'text-light-text'}`}>
          {project.title}
        </h3>
        
        <p className={`mb-4 line-clamp-2 text-sm
          ${theme === 'dark' ? 'text-dark-secondary' : 'text-light-secondary'}`}>
          {project.description}
        </p>

        {/* Teknolojiler */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.technologies.map((tech, index) => (
            <span
              key={index}
              className={`px-3 py-1 text-xs font-medium rounded-full border
                ${theme === 'dark'
                  ? 'bg-dark-surface text-primary border-primary/20'
                  : 'bg-light-surface text-primary border-primary/20'}`}
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Alt Kısım - Linkler */}
        <div className="flex justify-between items-center mt-auto">
          <Link
            to={`/projects/${project.id}`}
            className={`inline-flex items-center text-sm font-medium hover:text-primary transition-colors group/link
              ${theme === 'dark' ? 'text-dark-text' : 'text-light-text'}`}
          >
            Detayları Gör
            <span className="ml-1 transform group-hover/link:translate-x-1 transition-transform">→</span>
          </Link>

          <div className="flex gap-4">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`hover:text-primary transition-colors
                  ${theme === 'dark' ? 'text-dark-secondary' : 'text-light-secondary'}`}
                title="GitHub'da Görüntüle"
              >
                <FaGithub className="text-xl" />
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`hover:text-primary transition-colors
                  ${theme === 'dark' ? 'text-dark-secondary' : 'text-light-secondary'}`}
                title="Canlı Projeyi Görüntüle"
              >
                <FaExternalLinkAlt className="text-lg" />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard; 
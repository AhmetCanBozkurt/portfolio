import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Project } from '../types/project';
import { projectService } from '../services/projectService';
import ProjectCard from './ProjectCard';

const FeaturedProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        //.log('Öne çıkan projeler yükleniyor...');
        const data = await projectService.getFeaturedProjects();
       // //console.log('Öne çıkan projeler yüklendi:', data);
        if (data.length === 0) {
         // //console.log('Hiç öne çıkan proje bulunamadı');
        }
        setProjects(data);
      } catch (err) {
        ////console.error('Proje yükleme hatası (detaylı):', err);
        setError('Projeler yüklenirken bir hata oluştu.');

      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        <p>{error}</p>
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Öne Çıkan Projeler
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Henüz öne çıkan proje bulunmuyor.
            </p>
          </div>
          <div className="text-center mt-12">
            <Link
              to="/projects"
              className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-full text-white transition-colors"
            >
              Tüm Projeleri Gör
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Öne Çıkan Projeler
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Son dönemde geliştirdiğim bazı projeler. Tüm projelerimi görmek için
            projeler sayfasını ziyaret edebilirsiniz.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/projects"
            className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-full text-white transition-colors"
          >
            Tüm Projeleri Gör
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects; 
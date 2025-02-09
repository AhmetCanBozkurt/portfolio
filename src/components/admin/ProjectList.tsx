import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Project, projectService } from '../../services/projectService';
import { FaEdit, FaTrash, FaPlus, FaImage } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

interface ProjectListProps {}

const ProjectList: React.FC<ProjectListProps> = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await projectService.getAllProjects();
      setProjects(data);
      setError(null);
    } catch (err) {
      setError('Projeler yüklenirken bir hata oluştu.');
      //console.error('Proje yükleme hatası:', err);
      toast.error('Projeler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Emin misiniz?',
      text: "Bu proje kalıcı olarak silinecektir!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Evet, sil!',
      cancelButtonText: 'İptal'
    });

    if (result.isConfirmed) {
      try {
        const success = await projectService.deleteProject(id);
        if (success) {
          setProjects(projects.filter(project => project.id !== id));
          await Swal.fire(
            'Silindi!',
            'Proje başarıyla silindi.',
            'success'
          );
        } else {
          await Swal.fire(
            'Hata!',
            'Proje silinirken bir hata oluştu.',
            'error'
          );
        }
      } catch (err) {
        //console.error('Proje silme hatası:', err);
        await Swal.fire(
          'Hata!',
          'Proje silinirken bir hata oluştu.',
          'error'
        );
      }
    }
  };

  if (loading) {
    return <div className="p-4">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800"></h1>
        <Link
          to="/admin/projects/new"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
        >
          <FaPlus className="mr-2" /> Yeni Proje
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[768px]">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Görsel
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Başlık
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Teknolojiler
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tarih
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projects.map((project) => (
                  <tr key={project.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {project.imageUrl ? (
                        <div className="flex-shrink-0 h-16 w-16">
                          <div className="relative">
                            <img
                              src={project.imageUrl}
                              alt={project.title}
                              className="h-16 w-16 rounded-lg object-cover shadow-sm cursor-pointer"
                              onClick={() => {
                                Swal.fire({
                                  title: project.title,
                                  imageUrl: project.imageUrl,
                                  imageWidth: 800,
                                  imageHeight: 600,
                                  imageAlt: project.title,
                                  showCloseButton: true,
                                  showConfirmButton: false,
                                  customClass: {
                                    popup: 'swal2-image-preview'
                                  }
                                });
                              }}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.closest('.relative')?.classList.add('hidden');
                                target.closest('td')?.querySelector('.no-image-fallback')?.classList.remove('hidden');
                              }}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="no-image-fallback h-16 w-16 rounded-lg bg-gray-100 flex flex-col items-center justify-center">
                          <FaImage className="h-6 w-6 text-gray-400 mb-1" />
                          <span className="text-xs text-gray-500">Görsel Yok</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{project.title}</div>
                      <div className="text-sm text-gray-500">{project.description.substring(0, 100)}...</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.map((tech, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(project.updatedAt).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/admin/projects/edit/${project.id}`}
                        className="text-blue-500 hover:text-blue-700 mr-4"
                      >
                        <FaEdit className="inline-block" />
                      </Link>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash className="inline-block" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectList; 
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Technology, technologyService } from '../../services/technologyService';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const TechnologyList: React.FC = () => {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTechnologies();
  }, []);

  const loadTechnologies = async () => {
    try {
      setLoading(true);
      const data = await technologyService.getAllTechnologies();
      //console.log('Yüklenen teknolojiler:', data);
      setTechnologies(data);
      setError(null);
    } catch (err) {
      setError('Teknolojiler yüklenirken bir hata oluştu.');
      //console.error('Teknoloji yükleme hatası:', err);
      toast.error('Teknolojiler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Emin misiniz?',
      text: "Bu teknoloji kalıcı olarak silinecektir!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Evet, sil!',
      cancelButtonText: 'İptal'
    });

    if (result.isConfirmed) {
      try {
        const success = await technologyService.deleteTechnology(id);
        if (success) {
          setTechnologies(technologies.filter(tech => tech.id !== id));
          toast.success('Teknoloji başarıyla silindi.');
          await Swal.fire(
            'Silindi!',
            'Teknoloji başarıyla silindi.',
            'success'
          );
        } else {
          await Swal.fire(
            'Hata!',
            'Teknoloji silinirken bir hata oluştu.',
            'error'
          );
        }
      } catch (err) {
        //console.error('Teknoloji silme hatası:', err);
        await Swal.fire(
          'Hata!',
          'Teknoloji silinirken bir hata oluştu.',
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
        <h1 className="text-2xl font-bold text-gray-800">Teknolojiler</h1>
        <Link
          to="/admin/technologies/new"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
        >
          <FaPlus className="mr-2" /> Yeni Teknoloji
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[768px]">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Teknoloji
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Seviye
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deneyim (Yıl)
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {technologies.map((tech) => (
                  <tr key={tech.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {tech.icon ? (
                          <div className="flex-shrink-0 h-16 w-16">
                            <div className="relative">
                              <img
                                src={tech.icon}
                                alt={tech.name}
                                className="h-16 w-16 rounded-lg object-cover shadow-sm cursor-pointer"
                                onClick={() => {
                                  Swal.fire({
                                    title: tech.name,
                                    imageUrl: tech.icon,
                                    imageWidth: 800,
                                    imageHeight: 600,
                                    imageAlt: tech.name,
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
                          <div className="no-image-fallback h-16 w-16 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                            Görsel Yok
                          </div>
                        )}
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{tech.name}</div>
                          <div className="text-sm text-gray-500">{tech.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {tech.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        {tech.level}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {tech.yearsOfExperience}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/admin/technologies/edit/${tech.id}`}
                        className="text-blue-500 hover:text-blue-700 mr-4"
                      >
                        <FaEdit className="inline-block" />
                      </Link>
                      <button
                        onClick={() => handleDelete(tech.id)}
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

export default TechnologyList; 
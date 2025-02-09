import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { About, aboutService } from '../../services/aboutService';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import Swal from 'sweetalert2';

const AboutList: React.FC = () => {
  const [aboutList, setAboutList] = useState<About[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAbout();
  }, []);

  const loadAbout = async () => {
    try {
      const data = await aboutService.getAllAbout();
      setAboutList(data);
      setError(null);
    } catch (err) {
      setError('Hakkımda bilgileri yüklenirken bir hata oluştu.');
      ////console.error('Hakkımda bilgileri yükleme hatası:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Emin misiniz?',
      text: "Bu hakkımda bilgisi kalıcı olarak silinecektir!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Evet, sil!',
      cancelButtonText: 'İptal'
    });

    if (result.isConfirmed) {
      try {
        const success = await aboutService.deleteAbout(id);
        if (success) {
          setAboutList(aboutList.filter(about => about.id !== id));
          await Swal.fire(
            'Silindi!',
            'Hakkımda bilgisi başarıyla silindi.',
            'success'
          );
        } else {
          await Swal.fire(
            'Hata!',
            'Hakkımda bilgisi silinirken bir hata oluştu.',
            'error'
          );
        }
      } catch (err) {
       // //console.error('Hakkımda bilgisi silme hatası:', err);
        await Swal.fire(
          'Hata!',
          'Hakkımda bilgisi silinirken bir hata oluştu.',
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
        <h1 className="text-2xl font-bold text-gray-800">Hakkımda</h1>
        <Link
          to="/admin/about/new"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
        >
          <FaPlus className="mr-2" /> Yeni Hakkımda
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[768px]">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Başlık
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İçerik
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Yetenekler
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İletişim
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {aboutList.map((about) => (
                  <tr key={about.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{about.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 line-clamp-2">{about.content}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {about.skills.slice(0, 3).map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                        {about.skills.length > 3 && (
                          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                            +{about.skills.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{about.email}</div>
                      {about.phone && (
                        <div className="text-sm text-gray-500">{about.phone}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <Link
                          to={`/admin/about/edit/${about.id}`}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <FaEdit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(about.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
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

export default AboutList; 
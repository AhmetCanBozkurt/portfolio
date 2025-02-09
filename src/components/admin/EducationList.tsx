import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Education, educationService } from '../../services/educationService';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

interface EducationListProps {}

const EducationList: React.FC<EducationListProps> = () => {
  const [educations, setEducations] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEducations();
  }, []);

  const loadEducations = async () => {
    try {
      const data = await educationService.getAllEducation();
      setEducations(data);
      setError(null);
    } catch (err) {
      setError('Eğitim bilgileri yüklenirken bir hata oluştu.');
      //console.error('Eğitim bilgileri yükleme hatası:', err);
      toast.error('Eğitim bilgileri yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Emin misiniz?',
      text: "Bu eğitim bilgisi kalıcı olarak silinecektir!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Evet, sil!',
      cancelButtonText: 'İptal'
    });

    if (result.isConfirmed) {
      try {
        const success = await educationService.deleteEducation(id);
        if (success) {
          setEducations(educations.filter(edu => edu.id !== id));
          toast.success('Eğitim bilgisi başarıyla silindi.');
          Swal.fire(
            'Silindi!',
            'Eğitim bilgisi başarıyla silindi.',
            'success'
          );
        } else {
          setError('Eğitim bilgisi silinirken bir hata oluştu.');
          toast.error('Eğitim bilgisi silinirken bir hata oluştu.');
        }
      } catch (err) {
        setError('Eğitim bilgisi silinirken bir hata oluştu.');
        //console.error('Eğitim bilgisi silme hatası:', err);
        toast.error('Eğitim bilgisi silinirken bir hata oluştu.');
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
          to="/admin/education/new"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
        >
          <FaPlus className="mr-2" /> Yeni Eğitim Bilgisi
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                  Okul
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                  Bölüm
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                  Derece
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                  Tarih
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {educations.map((education) => (
                <tr key={education.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{education.school}</div>
                    <div className="text-sm text-gray-500">
                      {education.grade && `Not: ${education.grade}`}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{education.fieldOfStudy}</div>
                    <div className="text-sm text-gray-500 line-clamp-2">{education.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {education.degree}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(education.startDate).toLocaleDateString('tr-TR')} - 
                    {education.endDate ? new Date(education.endDate).toLocaleDateString('tr-TR') : 'Devam Ediyor'}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <div className="flex justify-end space-x-3">
                      <Link
                        to={`/admin/education/edit/${education.id}`}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <FaEdit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(education.id)}
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
  );
};

export default EducationList; 
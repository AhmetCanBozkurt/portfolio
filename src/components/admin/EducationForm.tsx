import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Education, educationService } from '../../services/educationService';
import { toast } from 'react-toastify';

interface EducationFormData {
  school: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  grade: string;
  description: string;
}

const initialFormData: EducationFormData = {
  school: '',
  degree: '',
  fieldOfStudy: '',
  startDate: '',
  endDate: '',
  grade: '',
  description: ''
};

const EducationForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<EducationFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadEducation(id);
    }
  }, [id]);

  const loadEducation = async (eduId: string) => {
    try {
      setLoading(true);
      const education = await educationService.getEducationById(eduId);
      if (education) {
        setFormData({
          school: education.school,
          degree: education.degree,
          fieldOfStudy: education.fieldOfStudy,
          startDate: education.startDate.split('T')[0],
          endDate: education.endDate ? education.endDate.split('T')[0] : '',
          grade: education.grade,
          description: education.description
        });
      } else {
        setError('Eğitim bilgisi bulunamadı');
        toast.error('Eğitim bilgisi bulunamadı');
      }
    } catch (err) {
      setError('Eğitim bilgisi yüklenirken bir hata oluştu');
      //console.error('Eğitim bilgisi yükleme hatası:', err);
      toast.error('Eğitim bilgisi yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (id) {
        await educationService.updateEducation(id, formData);
        toast.success('Eğitim bilgisi başarıyla güncellendi');
      } else {
        await educationService.addEducation(formData);
        toast.success('Eğitim bilgisi başarıyla eklendi');
      }
      navigate('/admin/education');
    } catch (err) {
      setError('Eğitim bilgisi kaydedilirken bir hata oluştu');
      //console.error('Eğitim bilgisi kaydetme hatası:', err);
      toast.error('Eğitim bilgisi kaydedilirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const degrees = [
    'Lise',
    'Ön Lisans',
    'Lisans',
    'Yüksek Lisans',
    'Doktora'
  ];

  if (loading && id) {
    return <div className="p-4">Yükleniyor...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {id ? 'Eğitim Bilgisini Düzenle' : 'Yeni Eğitim Bilgisi'}
      </h2>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-500 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Okul Adı
          </label>
          <input
            type="text"
            name="school"
            value={formData.school}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Derece
          </label>
          <select
            name="degree"
            value={formData.degree}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
            required
          >
            <option value="">Derece Seçin</option>
            {degrees.map(degree => (
              <option key={degree} value={degree}>
                {degree}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bölüm
          </label>
          <input
            type="text"
            name="fieldOfStudy"
            value={formData.fieldOfStudy}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Başlangıç Tarihi
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bitiş Tarihi (Devam ediyorsa boş bırakın)
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Not Ortalaması
          </label>
          <input
            type="text"
            name="grade"
            value={formData.grade}
            onChange={handleChange}
            placeholder="4.00 üzerinden"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Açıklama
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
            required
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/admin/education')}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            İptal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Kaydediliyor...' : id ? 'Güncelle' : 'Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EducationForm; 
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Technology, technologyService } from '../../services/technologyService';
import { StorageService } from '../../services/storageService';
import { toast } from 'react-toastify';
import { FaImage } from 'react-icons/fa';
import Swal from 'sweetalert2';

interface TechnologyFormData {
  name: string;
  category: string;
  level: string;
  description: string;
  icon: string;
  yearsOfExperience: number;
}

const initialFormData: TechnologyFormData = {
  name: '',
  category: '',
  level: '',
  description: '',
  icon: '',
  yearsOfExperience: 0
};

const TechnologyForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<TechnologyFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadTechnology(id);
    }
  }, [id]);

  const loadTechnology = async (techId: string) => {
    try {
      setLoading(true);
      const technology = await technologyService.getTechnologyById(techId);
      if (technology) {
        setFormData({
          name: technology.name,
          category: technology.category,
          level: technology.level,
          description: technology.description,
          icon: technology.icon,
          yearsOfExperience: technology.yearsOfExperience
        });
      } else {
        setError('Teknoloji bulunamadı');
        toast.error('Teknoloji bulunamadı');
      }
    } catch (err) {
      setError('Teknoloji yüklenirken bir hata oluştu');
      //console.error('Teknoloji yükleme hatası:', err);
      toast.error('Teknoloji yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      // Dosya boyutu kontrolü (2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('İkon boyutu 2MB\'dan küçük olmalıdır');
        return;
      }

      // Dosya tipi kontrolü
      if (!file.type.startsWith('image/')) {
        toast.error('Lütfen geçerli bir görsel dosyası seçin');
        return;
      }

      setSelectedFile(file);
      
      // Önizleme için URL oluştur
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      // Yükleme işlemini başlat
      const iconUrl = await StorageService.uploadImage(file, 'technologies');
      
      if (!iconUrl) {
        throw new Error('İkon URL\'i alınamadı');
      }

      setFormData(prev => ({ ...prev, icon: iconUrl }));
      toast.success('İkon başarıyla yüklendi');
    } catch (error) {
      //console.error('İkon yükleme hatası:', error);
      setImagePreview(null);
      setSelectedFile(null);
      
      if (error instanceof Error) {
        toast.error(`İkon yükleme hatası: ${error.message}`);
      } else {
        toast.error('İkon yüklenirken beklenmeyen bir hata oluştu');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (formData.icon && id) {
      const result = await Swal.fire({
        title: 'Emin misiniz?',
        text: "İkon kalıcı olarak silinecektir!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Evet, sil!',
        cancelButtonText: 'İptal'
      });

      if (result.isConfirmed) {
        try {
          await StorageService.deleteImage(formData.icon);
          setImagePreview(null);
          setSelectedFile(null);
          setFormData(prev => ({ ...prev, icon: '' }));
          toast.success('İkon başarıyla silindi');
        } catch (error) {
          //console.error('İkon silme hatası:', error);
          toast.error('İkon silinirken bir hata oluştu');
        }
      }
    } else {
      setImagePreview(null);
      setSelectedFile(null);
      setFormData(prev => ({ ...prev, icon: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Eğer yeni bir ikon seçildiyse, önce eski ikonu sil
      if (id && selectedFile) {
        const oldTech = await technologyService.getTechnologyById(id);
        if (oldTech?.icon && oldTech.icon !== formData.icon) {
          try {
            await StorageService.deleteImage(oldTech.icon);
          } catch (error) {
            //console.error('Eski ikon silinirken hata:', error);
          }
        }
      }

      if (id) {
        await technologyService.updateTechnology(id, formData);
        toast.success('Teknoloji başarıyla güncellendi');
      } else {
        await technologyService.addTechnology(formData);
        toast.success('Teknoloji başarıyla eklendi');
      }
      navigate('/admin/technologies');
    } catch (err) {
      setError('Teknoloji kaydedilirken bir hata oluştu');
      //console.error('Teknoloji kaydetme hatası:', err);
      toast.error('Teknoloji kaydedilirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'yearsOfExperience' ? parseInt(value) : value
    }));
  };

  const categories = [
    'Frontend',
    'Backend',
    'Database',
    'DevOps',
    'Mobile',
    'Diğer'
  ];

  const levels = [
    'Başlangıç',
    'Orta',
    'İleri'
  ];

  if (loading && id) {
    return <div className="p-4">Yükleniyor...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {id ? 'Teknolojiyi Düzenle' : 'Yeni Teknoloji Ekle'}
      </h2>
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-500 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Teknoloji Adı
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kategori
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
            required
          >
            <option value="">Kategori Seçin</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Seviye
          </label>
          <select
            name="level"
            value={formData.level}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
            required
          >
            <option value="">Seviye Seçin</option>
            {levels.map(level => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Deneyim (Yıl)
          </label>
          <input
            type="number"
            name="yearsOfExperience"
            value={formData.yearsOfExperience}
            onChange={handleChange}
            min="0"
            max="50"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Teknoloji İkonu
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="iconUpload"
            />
            <label
              htmlFor="iconUpload"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 cursor-pointer"
            >
              İkon Seç
            </label>
            {(imagePreview || formData.icon) && (
              <div className="relative">
                <img
                  src={imagePreview || formData.icon}
                  alt="Teknoloji ikonu önizleme"
                  className="h-16 w-16 rounded-lg object-cover shadow-sm"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.closest('.relative')?.classList.add('hidden');
                    target.closest('div')?.querySelector('.no-image-fallback')?.classList.remove('hidden');
                  }}
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-sm hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            )}
            {(!formData.icon || formData.icon.trim() === '') && (
              <div className="no-image-fallback h-16 w-16 rounded-lg bg-gray-100 flex flex-col items-center justify-center">
                <FaImage className="h-6 w-6 text-gray-400 mb-1" />
                <span className="text-xs text-gray-500">İkon Yok</span>
              </div>
            )}
          </div>
          {formData.icon && (
            <p className="mt-2 text-sm text-gray-500">
              Mevcut ikon: {formData.icon}
            </p>
          )}
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
            onClick={() => navigate('/admin/technologies')}
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

export default TechnologyForm; 
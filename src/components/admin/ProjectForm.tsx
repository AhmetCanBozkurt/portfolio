import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { projectService } from '../../services/projectService';
import { StorageService } from '../../services/storageService';
import Swal from 'sweetalert2';

interface ProjectFormData {
  title: string;
  description: string;
  technologies: string[];
  imageUrl: string;
  githubUrl: string;
  liveUrl: string;
  featured: boolean;
}

const initialFormData: ProjectFormData = {
  title: '',
  description: '',
  technologies: [],
  imageUrl: '',
  githubUrl: '',
  liveUrl: '',
  featured: false
};

const ProjectForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProjectFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [techInput, setTechInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadProject(id);
    }
  }, [id]);

  const loadProject = async (projectId: string) => {
    try {
      setLoading(true);
      const project = await projectService.getProjectById(projectId);
      if (project) {
        setFormData({
          title: project.title,
          description: project.description,
          technologies: project.technologies,
          imageUrl: project.imageUrl || '',
          githubUrl: project.githubUrl || '',
          liveUrl: project.liveUrl || '',
          featured: project.featured || false
        });
        if (project.imageUrl) {
          setImagePreview(project.imageUrl);
        }
      } else {
        setError('Proje bulunamadı');
        toast.error('Proje bulunamadı');
      }
    } catch (err) {
      setError('Proje yüklenirken bir hata oluştu');
      //console.error('Proje yükleme hatası:', err);
      toast.error('Proje yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      // Dosya boyutu kontrolü (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Görsel boyutu 5MB\'dan küçük olmalıdır');
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

      /*console.log('Görsel yükleme başlıyor...', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      });*/

      // Yükleme işlemini başlat
      const imageUrl = await StorageService.uploadImage(file, 'projects');
      
      if (!imageUrl) {
        throw new Error('Görsel URL\'i alınamadı');
      }

      //console.log('Görsel başarıyla yüklendi:', imageUrl);
      
      setFormData(prev => ({ ...prev, imageUrl }));
      toast.success('Görsel başarıyla yüklendi');
    } catch (error) {
      //console.error('Görsel yükleme hatası:', error);
      setImagePreview(null);
      setSelectedFile(null);
      
      if (error instanceof Error) {
        toast.error(`Görsel yükleme hatası: ${error.message}`);
      } else {
        toast.error('Görsel yüklenirken beklenmeyen bir hata oluştu');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (formData.imageUrl && id) {
      const result = await Swal.fire({
        title: 'Emin misiniz?',
        text: "Görsel kalıcı olarak silinecektir!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Evet, sil!',
        cancelButtonText: 'İptal'
      });

      if (result.isConfirmed) {
        try {
          await StorageService.deleteImage(formData.imageUrl);
          setImagePreview(null);
          setSelectedFile(null);
          setFormData(prev => ({ ...prev, imageUrl: '' }));
          Swal.fire(
            'Silindi!',
            'Görsel başarıyla silindi.',
            'success'
          );
        } catch (error) {
          //console.error('Görsel silme hatası:', error);
          Swal.fire(
            'Hata!',
            'Görsel silinirken bir hata oluştu.',
            'error'
          );
        }
      }
    } else {
      setImagePreview(null);
      setSelectedFile(null);
      setFormData(prev => ({ ...prev, imageUrl: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const projectData = {
        ...formData
      };

      if (id) {
        // Eğer eski bir görsel varsa ve yeni görsel yüklendiyse, eski görseli sil
        const oldProject = await projectService.getProjectById(id);
        if (oldProject?.imageUrl && oldProject.imageUrl !== formData.imageUrl) {
          try {
            await StorageService.deleteImage(oldProject.imageUrl);
          } catch (error) {
            //console.error('Eski görsel silinirken hata:', error);
          }
        }

        await projectService.updateProject(id, projectData);
        await Swal.fire({
          title: 'Başarılı!',
          text: 'Proje başarıyla güncellendi.',
          icon: 'success',
          confirmButtonColor: '#3085d6'
        });
      } else {
        await projectService.createProject(projectData);
        await Swal.fire({
          title: 'Başarılı!',
          text: 'Proje başarıyla eklendi.',
          icon: 'success',
          confirmButtonColor: '#3085d6'
        });
      }
      navigate('/admin/projects');
    } catch (err) {
      setError('Proje kaydedilirken bir hata oluştu');
      //console.error('Proje kaydetme hatası:', err);
      await Swal.fire({
        title: 'Hata!',
        text: 'Proje kaydedilirken bir hata oluştu.',
        icon: 'error',
        confirmButtonColor: '#3085d6'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleAddTechnology = () => {
    if (techInput.trim()) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, techInput.trim()]
      }));
      setTechInput('');
    }
  };

  const handleRemoveTechnology = async (index: number) => {
    const result = await Swal.fire({
      title: 'Emin misiniz?',
      text: "Bu teknoloji projeden kaldırılacaktır!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Evet, kaldır!',
      cancelButtonText: 'İptal'
    });

    if (result.isConfirmed) {
      setFormData(prev => ({
        ...prev,
        technologies: prev.technologies.filter((_, i) => i !== index)
      }));
      await Swal.fire(
        'Kaldırıldı!',
        'Teknoloji başarıyla kaldırıldı.',
        'success'
      );
    }
  };

  if (loading && id) {
    return <div className="p-4">Yükleniyor...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {id ? 'Projeyi Düzenle' : 'Yeni Proje Ekle'}
      </h2>
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-500 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Proje Adı
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Proje Görseli
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="imageUpload"
            />
            <label
              htmlFor="imageUpload"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 cursor-pointer"
            >
              Görsel Seç
            </label>
            {imagePreview && (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Proje görseli önizleme"
                  className="h-20 w-20 object-cover rounded-md"
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
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Teknolojiler
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTechnology();
                }
              }}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
              placeholder="Teknoloji ekle"
            />
            <button
              type="button"
              onClick={handleAddTechnology}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Ekle
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.technologies.map((tech, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-blue-100 text-blue-800"
              >
                {tech}
                <button
                  type="button"
                  onClick={() => handleRemoveTechnology(index)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            GitHub URL
          </label>
          <input
            type="url"
            name="githubUrl"
            value={formData.githubUrl}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Canlı Site URL
          </label>
          <input
            type="url"
            name="liveUrl"
            value={formData.liveUrl}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
          />
        </div>

        <div className="mb-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span>Öne Çıkan Proje</span>
          </label>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/admin/projects')}
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

export default ProjectForm; 
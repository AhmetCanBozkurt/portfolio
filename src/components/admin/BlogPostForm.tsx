import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { blogPostService } from '../../services/blogPostService';
import { BlogPost } from '../../types/blog';
import { StorageService } from '../../services/storageService';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEye, FaEdit } from 'react-icons/fa';

interface BlogPostFormData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  tags: string[];
  status: 'draft' | 'published';
}

const initialFormData: BlogPostFormData = {
  title: '',
  slug: '',
  content: '',
  excerpt: '',
  coverImage: '',
  tags: [],
  status: 'draft'
};

const BlogPostForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<BlogPostFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  useEffect(() => {
    if (id) {
      loadBlogPost(id);
    }
  }, [id]);

  const loadBlogPost = async (postId: string) => {
    try {
      setLoading(true);
      const post = await blogPostService.getBlogPost(postId);
      if (post) {
        setFormData({
          title: post.title,
          slug: post.slug,
          content: post.content,
          excerpt: post.excerpt,
          tags: post.tags || [],
          coverImage: post.coverImage || '',
          status: post.status
        });
      } else {
        setError('Blog yazısı bulunamadı');
        toast.error('Blog yazısı bulunamadı');
      }
    } catch (err) {
      setError('Blog yazısı yüklenirken bir hata oluştu');
      ////console.error('Blog yazısı yükleme hatası:', err);
      toast.error('Blog yazısı yüklenirken bir hata oluştu');
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

      // Yükleme işlemini başlat
      const imageUrl = await StorageService.uploadImage(file, 'blogs');
      
      if (!imageUrl) {
        throw new Error('Görsel URL\'i alınamadı');
      }

      setFormData(prev => ({ ...prev, coverImage: imageUrl }));
      toast.success('Görsel başarıyla yüklendi');
    } catch (error) {
     // //console.error('Görsel yükleme hatası:', error);
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
    if (formData.coverImage && id) {
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
          await StorageService.deleteImage(formData.coverImage);
          setImagePreview(null);
          setSelectedFile(null);
          setFormData(prev => ({ ...prev, coverImage: '' }));
          toast.success('Görsel başarıyla silindi');
        } catch (error) {
          ////console.error('Görsel silme hatası:', error);
          toast.error('Görsel silinirken bir hata oluştu');
        }
      }
    } else {
      setImagePreview(null);
      setSelectedFile(null);
      setFormData(prev => ({ ...prev, coverImage: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Form verilerini hazırla
      const postData = {
        ...formData,
        tags: formData.tags || []
      };

      // Eğer yeni bir görsel seçildiyse, önce eski görseli sil
      if (id && selectedFile) {
        const oldPost = await blogPostService.getBlogPost(id);
        if (oldPost?.coverImage && oldPost.coverImage !== formData.coverImage) {
          try {
            await StorageService.deleteImage(oldPost.coverImage);
          } catch (error) {
            ////console.error('Eski görsel silinirken hata:', error);
          }
        }
      }

      if (id) {
        await blogPostService.updateBlogPost(id, postData);
        toast.success('Blog yazısı başarıyla güncellendi');
      } else {
        await blogPostService.createBlogPost(postData);
        toast.success('Blog yazısı başarıyla oluşturuldu');
      }
      navigate('/admin/blog');
    } catch (err) {
      setError('Blog yazısı kaydedilirken bir hata oluştu');
      ////console.error('Blog yazısı kaydetme hatası:', err);
      toast.error('Blog yazısı kaydedilirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'title' && !id) {
      // Başlıktan otomatik slug oluştur (sadece yeni yazılarda)
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Özel karakterleri kaldır
        .replace(/\s+/g, '-') // Boşlukları tire ile değiştir
        .replace(/-+/g, '-') // Ardışık tireleri tek tireye dönüştür
        .trim();
      setFormData(prev => ({ ...prev, [name]: value, slug }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleTagAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()]
        }));
      }
      setTagInput('');
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  if (loading && id) {
    return <div className="p-4">Yükleniyor...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {id ? 'Blog Yazısını Düzenle' : 'Yeni Blog Yazısı'}
      </h2>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-500 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Başlık
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 bg-white"
            placeholder="Blog yazısı başlığı"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL (Slug)
          </label>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 bg-white"
            placeholder="blog-yazisi-url"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Özet
          </label>
          <textarea
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            required
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 bg-white"
            placeholder="Blog yazısının kısa özeti"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <label className="text-lg font-medium text-gray-800">
              İçerik
            </label>
            <button
              type="button"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className="flex items-center gap-2 px-6 py-3 text-base font-medium rounded-lg text-white transition-all duration-300 shadow-lg hover:shadow-xl
                bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800
                border border-indigo-500 hover:border-indigo-600"
            >
              {isPreviewMode ? (
                <>
                  <FaEdit className="w-5 h-5" />
                  <span className="font-semibold">Düzenlemeye Dön</span>
                </>
              ) : (
                <>
                  <FaEye className="w-5 h-5" />
                  <span className="font-semibold">Önizleme</span>
                </>
              )}
            </button>
          </div>
          
          <AnimatePresence mode="wait">
            {isPreviewMode ? (
              <motion.div
                key="preview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="prose prose-lg max-w-none p-8 border rounded-lg bg-white shadow-inner min-h-[400px] overflow-auto"
              >
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({node, ...props}) => <h1 className="text-3xl font-bold mb-4" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-2xl font-bold mb-3" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-xl font-bold mb-2" {...props} />,
                    p: ({node, ...props}) => <p className="mb-4 text-gray-800" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4" {...props} />,
                    li: ({node, ...props}) => <li className="mb-1" {...props} />,
                    a: ({node, ...props}) => <a className="text-primary hover:text-primary/80 underline" {...props} />,
                    blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4" {...props} />,
                    code: ({node, inline, ...props}) => 
                      inline ? 
                        <code className="bg-gray-100 rounded px-1 py-0.5" {...props} /> :
                        <code className="block bg-gray-100 p-4 rounded-md my-4 overflow-x-auto" {...props} />,
                    img: ({node, ...props}) => <img className="max-w-full h-auto rounded-lg my-4" {...props} />
                  }}
                >
                  {formData.content || '*Önizleme için içerik giriniz...*'}
                </ReactMarkdown>
              </motion.div>
            ) : (
              <motion.div
                key="editor"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  required
                  rows={15}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary font-mono text-gray-900 bg-white"
                  placeholder="Blog yazısı içeriği (Markdown formatında)"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Etiketler
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm flex items-center"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleTagRemove(tag)}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagAdd}
              placeholder="Etiket eklemek için yazın ve Enter'a basın"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kapak Görseli
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
              {(imagePreview || formData.coverImage) && (
                <div className="relative">
                  <img
                    src={imagePreview || formData.coverImage}
                    alt="Blog görseli önizleme"
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
            {formData.coverImage && (
              <p className="mt-2 text-sm text-gray-500">
                Mevcut görsel: {formData.coverImage}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Durum
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
            required
          >
            <option value="draft">Taslak</option>
            <option value="published">Yayında</option>
          </select>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/admin/blog')}
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

export default BlogPostForm; 
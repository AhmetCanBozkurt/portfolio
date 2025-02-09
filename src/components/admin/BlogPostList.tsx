import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BlogPost, blogPostService } from '../../services/blogPostService';
import { FaEdit, FaTrash, FaPlus, FaEye, FaEyeSlash, FaImage } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

interface BlogPostListProps {}

const BlogPostList: React.FC<BlogPostListProps> = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBlogPosts();
  }, []);

  const loadBlogPosts = async () => {
    try {
      const data = await blogPostService.getAllBlogPosts();
      setBlogPosts(data);
      setError(null);
    } catch (err) {
      setError('Blog yazıları yüklenirken bir hata oluştu.');
      ////console.error('Blog yazıları yükleme hatası:', err);
      toast.error('Blog yazıları yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Emin misiniz?',
      text: "Bu blog yazısı kalıcı olarak silinecektir!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Evet, sil!',
      cancelButtonText: 'İptal'
    });

    if (result.isConfirmed) {
      try {
        const success = await blogPostService.deleteBlogPost(id);
        if (success) {
          setBlogPosts(blogPosts.filter(post => post.id !== id));
          toast.success('Blog yazısı başarıyla silindi.');
          Swal.fire(
            'Silindi!',
            'Blog yazısı başarıyla silindi.',
            'success'
          );
        } else {
          setError('Blog yazısı silinirken bir hata oluştu.');
          toast.error('Blog yazısı silinirken bir hata oluştu.');
        }
      } catch (err) {
        setError('Blog yazısı silinirken bir hata oluştu.');
        ////console.error('Blog yazısı silme hatası:', err);
        toast.error('Blog yazısı silinirken bir hata oluştu.');
      }
    }
  };

  const handleStatusChange = async (id: string, currentStatus: 'draft' | 'published') => {
    const newStatus = currentStatus === 'draft' ? 'published' : 'draft';
    const action = newStatus === 'published' ? 'yayınlamak' : 'taslağa almak';

    const result = await Swal.fire({
      title: 'Emin misiniz?',
      text: `Bu blog yazısını ${action} istediğinizden emin misiniz?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Evet',
      cancelButtonText: 'İptal'
    });

    if (result.isConfirmed) {
      try {
        const updatedPost = await (newStatus === 'published' 
          ? blogPostService.publishBlogPost(id)
          : blogPostService.unpublishBlogPost(id));

        if (updatedPost) {
          setBlogPosts(blogPosts.map(post => 
            post.id === id ? { ...post, status: newStatus } : post
          ));
          toast.success(`Blog yazısı başarıyla ${newStatus === 'published' ? 'yayınlandı' : 'taslağa alındı'}.`);
        }
      } catch (err) {
       // //console.error('Blog yazısı durum değiştirme hatası:', err);
        toast.error('Blog yazısı durumu değiştirilirken bir hata oluştu.');
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
        <h1 className="text-2xl font-bold text-gray-800">Blog Yazıları</h1>
        <Link
          to="/admin/blog/new"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
        >
          <FaPlus className="mr-2" /> Yeni Blog Yazısı
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
                    Yazar
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tarih
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {blogPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {post.coverImage ? (
                        <div className="flex-shrink-0 h-16 w-16">
                          <div className="relative">
                            <img
                              src={post.coverImage}
                              alt={post.title}
                              className="h-16 w-16 rounded-lg object-cover shadow-sm cursor-pointer"
                              onClick={() => {
                                Swal.fire({
                                  title: post.title,
                                  imageUrl: post.coverImage,
                                  imageWidth: 800,
                                  imageHeight: 600,
                                  imageAlt: post.title,
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
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 mb-1">{post.title}</div>
                      <div className="text-sm text-gray-500 line-clamp-2">{post.excerpt}</div>
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {post.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {post.author}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {post.createdAt instanceof Date 
                        ? post.createdAt.toLocaleDateString('tr-TR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })
                        : new Date(post.createdAt).toLocaleDateString('tr-TR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleStatusChange(post.id, post.status)}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          post.status === 'published'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {post.status === 'published' ? (
                          <>
                            <FaEye className="mr-1" /> Yayında
                          </>
                        ) : (
                          <>
                            <FaEyeSlash className="mr-1" /> Taslak
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/admin/blog/edit/${post.id}`}
                        className="text-blue-500 hover:text-blue-700 mr-4"
                        title="Düzenle"
                      >
                        <FaEdit className="inline-block" />
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="text-red-500 hover:text-red-700"
                        title="Sil"
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

export default BlogPostList; 
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BlogPost } from '../types/blog';
import { blogPostService } from '../services/blogPostService';
import { useApp } from '../contexts/AppContext';
import Layout from './Layout';
import { FaFilter } from 'react-icons/fa';

const BlogList = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const { theme } = useApp();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await blogPostService.getAllBlogPosts();
        setPosts(data);
      } catch (err) {
        setError('Blog yazıları yüklenirken bir hata oluştu.');
       // //console.error('Blog yükleme hatası:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen pt-16">
          <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2
            ${theme === 'dark' ? 'border-primary' : 'border-primary'}`} />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen pt-16 flex items-center justify-center">
          <div className={`text-center p-8 rounded-lg border
            ${theme === 'dark'
              ? 'bg-dark-surface/50 border-red-500/20 text-red-400'
              : 'bg-light-surface/50 border-red-500/20 text-red-500'}`}
          >
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Tekrar Dene
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={`min-h-screen pt-16 pb-20 transition-colors duration-300
        ${theme === 'dark'
          ? 'bg-gradient-to-b from-dark-surface to-dark-background'
          : 'bg-gradient-to-b from-light-surface to-light-background'}`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`text-4xl md:text-5xl font-bold mb-4 transition-colors
                ${theme === 'dark' ? 'text-dark-text' : 'text-light-text'}`}
            >
              Blog
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={`max-w-2xl mx-auto transition-colors
                ${theme === 'dark' ? 'text-dark-secondary' : 'text-light-secondary'}`}
            >
              Yazılım, teknoloji ve deneyimlerim hakkında paylaşımlar.
            </motion.p>
          </div>

          {/* Arama ve Filtre Alanı */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between max-w-4xl mx-auto">
              {/* Arama Kutusu */}
              <div className="relative w-full md:w-96">
                <input
                  type="text"
                  placeholder="Blog yazılarında ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors
                    ${theme === 'dark'
                      ? 'bg-dark-surface/50 border border-dark-border text-dark-text placeholder-dark-secondary'
                      : 'bg-light-surface/50 border border-light-border text-light-text placeholder-light-secondary'}`}
                />
              </div>

              {/* Filtre Butonu */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors
                  ${theme === 'dark'
                    ? 'bg-dark-surface/50 border border-dark-border hover:bg-dark-surface'
                    : 'bg-light-surface/50 border border-light-border hover:bg-light-surface'}`}
              >
                <FaFilter className={theme === 'dark' ? 'text-dark-secondary' : 'text-light-secondary'} />
                <span className={theme === 'dark' ? 'text-dark-text' : 'text-light-text'}>
                  Filtrele
                </span>
                <span className={`ml-2 px-2 py-0.5 text-xs rounded-full
                  ${theme === 'dark'
                    ? 'bg-primary/20 text-primary'
                    : 'bg-primary/20 text-primary'}`}
                >
                  {selectedTag || 'Tümü'}
                </span>
              </button>
            </div>

            {/* Etiket Filtreleri */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-wrap justify-center gap-2 mt-6 max-w-4xl mx-auto">
                    <button
                      onClick={() => setSelectedTag(null)}
                      className={`px-4 py-2 rounded-lg transition-all
                        ${!selectedTag
                          ? 'bg-primary text-white shadow-lg shadow-primary/30'
                          : theme === 'dark'
                            ? 'bg-dark-surface/50 text-dark-text hover:bg-dark-surface border border-dark-border'
                            : 'bg-light-surface/50 text-light-text hover:bg-light-surface border border-light-border'}`}
                    >
                      Tümü
                    </button>
                    {Array.from(new Set(posts.flatMap(post => post.tags || []))).sort().map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setSelectedTag(tag)}
                        className={`px-4 py-2 rounded-lg transition-all
                          ${selectedTag === tag
                            ? 'bg-primary text-white shadow-lg shadow-primary/30'
                            : theme === 'dark'
                              ? 'bg-dark-surface/50 text-dark-text hover:bg-dark-surface border border-dark-border'
                              : 'bg-light-surface/50 text-light-text hover:bg-light-surface border border-light-border'}`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts
              .filter((post) =>
                post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .filter((post) =>
                selectedTag ? post.tags?.includes(selectedTag) : true
              )
              .map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300
                  ${theme === 'dark'
                    ? 'bg-gradient-to-br from-dark-surface to-dark-background shadow-purple-500/20 hover:shadow-purple-500/40 border border-purple-500/20 hover:border-purple-500/30'
                    : 'bg-gradient-to-br from-light-surface to-light-background shadow-purple-500/30 hover:shadow-purple-500/50 border border-purple-500/20 hover:border-purple-500/30'}`}
              >
                {post.coverImage ? (
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-blog.jpg';
                    //  //console.log('Blog görseli yüklenemedi:', post.coverImage);
                    }}
                  />
                ) : (
                  <div className={`w-full h-48 flex items-center justify-center
                    ${theme === 'dark' 
                      ? 'bg-dark-surface/50' 
                      : 'bg-light-surface/50'}`}
                  >
                    <span className="text-4xl">📝</span>
                  </div>
                )}
                <div className="p-6">
                  <h2 className={`text-xl font-bold mb-2 transition-colors
                    ${theme === 'dark' ? 'text-dark-text' : 'text-light-text'}`}>
                    {post.title}
                  </h2>
                  <p className={`mb-4 line-clamp-2 transition-colors
                    ${theme === 'dark' ? 'text-dark-secondary' : 'text-light-secondary'}`}>
                    {post.excerpt}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags?.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className={`px-3 py-1 text-xs font-medium rounded-full
                          ${theme === 'dark'
                            ? 'bg-dark-surface/50 text-primary border border-primary/20'
                            : 'bg-light-surface/50 text-primary border border-primary/20'}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm transition-colors
                      ${theme === 'dark' ? 'text-dark-secondary' : 'text-light-secondary'}`}>
                      {new Date(post.createdAt).toLocaleDateString('tr-TR')}
                    </span>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="text-primary hover:text-accent transition-colors"
                    >
                      Devamını Oku →
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {posts
            .filter((post) =>
              post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .filter((post) =>
              selectedTag ? post.tags?.includes(selectedTag) : true
            ).length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12 col-span-full"
            >
              <div className={`p-8 max-w-md mx-auto rounded-lg border
                ${theme === 'dark'
                  ? 'bg-dark-surface/50 border-dark-border'
                  : 'bg-light-surface/50 border-light-border'}`}
              >
                <p className={theme === 'dark' ? 'text-dark-secondary' : 'text-light-secondary'}>
                  {searchTerm
                    ? 'Aradığınız kriterlere uygun blog yazısı bulunamadı.'
                    : selectedTag
                      ? `"${selectedTag}" etiketine sahip blog yazısı bulunamadı.`
                      : 'Henüz blog yazısı bulunmuyor.'}
                </p>
                {(searchTerm || selectedTag) && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedTag(null);
                    }}
                    className="mt-4 text-primary hover:text-accent transition-colors"
                  >
                    Tüm Yazıları Göster
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default BlogList; 
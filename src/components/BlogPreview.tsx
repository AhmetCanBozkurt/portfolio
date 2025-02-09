import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { BlogPost } from '../types/blog';
import { blogPostService } from '../services/blogPostService';
import { useApp } from '../contexts/AppContext';
import { FaArrowRight, FaCalendar, FaUser } from 'react-icons/fa';

const BlogPreview = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useApp();
  const navigate = useNavigate();

  // Teknoloji renklerini belirle
  const getTagColor = (tag: string): string => {
    const colors = {
      'React': 'bg-blue-100 text-blue-800',
      'JavaScript': 'bg-yellow-100 text-yellow-800',
      'TypeScript': 'bg-blue-100 text-blue-800',
      'Node.js': 'bg-green-100 text-green-800',
      'Python': 'bg-indigo-100 text-indigo-800',
      'Java': 'bg-red-100 text-red-800',
      'HTML': 'bg-orange-100 text-orange-800',
      'CSS': 'bg-pink-100 text-pink-800',
      'Firebase': 'bg-yellow-100 text-yellow-800',
      'MongoDB': 'bg-green-100 text-green-800',
      'SQL': 'bg-blue-100 text-blue-800',
      'Docker': 'bg-blue-100 text-blue-800',
      'AWS': 'bg-orange-100 text-orange-800',
      'DevOps': 'bg-purple-100 text-purple-800',
      'Mobile': 'bg-indigo-100 text-indigo-800',
      'UI/UX': 'bg-pink-100 text-pink-800',
      'Testing': 'bg-green-100 text-green-800',
      'State Management': 'bg-purple-100 text-purple-800'
    };
    
    // Eğer özel renk tanımlanmamışsa rastgele bir renk seç
    const defaultColors = [
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-yellow-100 text-yellow-800',
      'bg-red-100 text-red-800',
      'bg-purple-100 text-purple-800',
      'bg-indigo-100 text-indigo-800',
      'bg-pink-100 text-pink-800'
    ];
    
    return colors[tag] || defaultColors[Math.floor(Math.random() * defaultColors.length)];
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await blogPostService.getRecentPosts();
        setPosts(data);
      } catch (err) {
        setError('Blog yazıları yüklenirken bir hata oluştu.');
        //.error('Blog yükleme hatası:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2
          ${theme === 'dark' ? 'border-primary' : 'border-primary'}`} />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-8 ${theme === 'dark' ? 'text-red-400' : 'text-red-500'}`}>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <section className={`py-20 transition-colors duration-300
      ${theme === 'dark' ? 'bg-dark-background' : 'bg-light-background'}`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className={`text-3xl md:text-4xl font-bold mb-4 transition-colors
              ${theme === 'dark' ? 'text-dark-text' : 'text-light-text'}`}
          >
            Son Blog Yazıları
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className={`max-w-2xl mx-auto transition-colors
              ${theme === 'dark' ? 'text-dark-secondary' : 'text-light-secondary'}`}
          >
            Yazılım, teknoloji ve deneyimlerim hakkında paylaşımlar.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer
                ${theme === 'dark'
                  ? 'bg-gradient-to-br from-dark-surface to-dark-background shadow-purple-500/20 hover:shadow-purple-500/40 border border-purple-500/20 hover:border-purple-500/30'
                  : 'bg-gradient-to-br from-light-surface to-light-background shadow-purple-500/30 hover:shadow-purple-500/50 border border-purple-500/20 hover:border-purple-500/30'}`}
              onClick={() => navigate(`/blog/${post.slug}`)}
            >
              {post.coverImage ? (
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder-blog.jpg';
                    ////console.log('Blog görseli yüklenemedi:', post.coverImage);
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
                <h3 className={`text-xl font-bold mb-2 transition-colors
                  ${theme === 'dark' ? 'text-dark-text' : 'text-light-text'}`}>
                  {post.title}
                </h3>
                <p className={`mb-4 line-clamp-2 transition-colors
                  ${theme === 'dark' ? 'text-dark-secondary' : 'text-light-secondary'}`}>
                  {post.excerpt}
                </p>
                <div className="flex justify-between items-center">
                  <span className={`text-sm transition-colors
                    ${theme === 'dark' ? 'text-dark-secondary' : 'text-light-secondary'}`}>
                    {new Date(post.createdAt).toLocaleDateString('tr-TR')}
                  </span>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="text-primary hover:text-accent transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Devamını Oku →
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/blog"
            className={`inline-block px-8 py-3 rounded-lg font-medium transition-colors
              ${theme === 'dark'
                ? 'bg-dark-surface border border-dark-border hover:bg-dark-border text-dark-text'
                : 'bg-light-surface border border-light-border hover:bg-light-border text-light-text'}`}
          >
            Tüm Yazıları Gör
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogPreview; 
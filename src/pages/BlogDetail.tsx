import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { blogPostService } from '../services/blogPostService';
import { useApp } from '../contexts/AppContext';
import Layout from '../components/Layout';
import { FaCalendar, FaUser, FaClock } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  coverImage?: string;
  author?: string;
  tags: string[];
  createdAt: string;
  readTime?: string;
  status: 'draft' | 'published';
}

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useApp();

  useEffect(() => {
    const loadBlogPost = async () => {
      try {
        setLoading(true);
        if (!slug) {
          setError('Blog yazısı bulunamadı');
          return;
        }

        const posts = await blogPostService.getAllBlogPosts();
        const foundPost = posts.find(p => p.slug === slug);

        if (foundPost) {
          setPost({
            ...foundPost,
            author: foundPost.author || 'Ahmet Can Bozkurt' // Varsayılan yazar
          });
        } else {
          setError('Blog yazısı bulunamadı');
        }
      } catch (err) {
        //console.error('Blog yazısı yükleme hatası:', err);
        setError('Blog yazısı yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    loadBlogPost();
  }, [slug]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen pt-20 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout>
        <div className="min-h-screen pt-20 flex items-center justify-center">
          <div className={`text-center p-8 rounded-lg border
            ${theme === 'dark'
              ? 'bg-dark-surface/50 border-red-500/20 text-dark-text'
              : 'bg-light-surface/50 border-red-500/20 text-light-text'}`}
          >
            <p className="text-red-500">{error || 'Blog yazısı bulunamadı'}</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <article className={`min-h-screen pt-20 transition-colors duration-300
        ${theme === 'dark' ? 'bg-dark-background' : 'bg-light-background'}`}
      >
        {/* Hero Section */}
        <div className="relative h-[40vh] min-h-[400px] w-full overflow-hidden">
          {post.coverImage ? (
            <>
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${post.coverImage})` }}
              />
              <div className="absolute inset-0 bg-black/50" />
            </>
          ) : (
            <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-dark-surface' : 'bg-light-surface'}`} />
          )}
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl md:text-5xl font-bold mb-4 text-white"
              >
                {post.title}
              </motion.h1>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-wrap items-center justify-center gap-4 text-white/80"
              >
                <div className="flex items-center">
                  <FaUser className="mr-2" />
                  {post.author}
                </div>
                <div className="flex items-center">
                  <FaCalendar className="mr-2" />
                  {new Date(post.createdAt).toLocaleDateString('tr-TR')}
                </div>
                {post.readTime && (
                  <div className="flex items-center">
                    <FaClock className="mr-2" />
                    {post.readTime} dk okuma
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Tags */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap gap-3 mb-8"
          >
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                  ${theme === 'dark'
                    ? 'bg-dark-surface/80 border border-purple-500/20 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/20 text-primary'
                    : 'bg-light-surface/80 border border-purple-500/20 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/20 text-primary'}`}
              >
                {tag}
              </span>
            ))}
          </motion.div>

          {/* Blog Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`prose prose-lg max-w-none
              ${theme === 'dark' ? 'prose-invert' : ''}`}
          >
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({node, ...props}) => <h1 className="text-3xl font-bold mb-4" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-2xl font-bold mb-3" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-xl font-bold mb-2" {...props} />,
                p: ({node, ...props}) => <p className="mb-4" {...props} />,
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
              {post.content}
            </ReactMarkdown>
          </motion.div>
        </div>
      </article>
    </Layout>
  );
};

export default BlogDetail; 
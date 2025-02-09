import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ActivityLog, activityLogService } from '../../services/activityLogService';
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaProjectDiagram, FaBlog, FaEnvelope } from 'react-icons/fa';
import { projectService } from '../../services/projectService';
import { blogPostService } from '../../services/blogPostService';
import { contactService } from '../../services/contactService';

const Dashboard: React.FC = () => {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    projects: 0,
    blogs: 0,
    messages: 0
  });

  useEffect(() => {
    loadActivities();
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [projects, blogs, messages] = await Promise.all([
        projectService.getAllProjects(),
        blogPostService.getAllBlogPosts(),
        contactService.getAllMessages()
      ]);

      setStats({
        projects: projects.length,
        blogs: blogs.length,
        messages: messages.length
      });
    } catch (error) {
      //console.error('İstatistikler yüklenirken hata:', error);
    }
  };

  const loadActivities = async () => {
    try {
      setLoading(true);
      const data = await activityLogService.getRecentActivities(10); // Son 10 aktiviteyi getir
      setActivities(data);
    } catch (error) {
      //console.error('Aktiviteler yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionColor = (action: ActivityLog['action']) => {
    switch (action) {
      case 'create':
        return 'text-green-500';
      case 'update':
        return 'text-purple-500';
      case 'delete':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getActionIcon = (action: ActivityLog['action']) => {
    switch (action) {
      case 'create':
        return <FaPlus className="w-4 h-4" />;
      case 'update':
        return <FaEdit className="w-4 h-4" />;
      case 'delete':
        return <FaTrash className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getEntityTypeText = (type: ActivityLog['entityType']) => {
    switch (type) {
      case 'project':
        return 'Proje';
      case 'blog':
        return 'Blog';
      case 'technology':
        return 'Teknoloji';
      case 'education':
        return 'Eğitim';
      case 'certificate':
        return 'Sertifika';
      case 'about':
        return 'Hakkımda';
      default:
        return type;
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Proje İstatistikleri */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-sm font-medium mb-1">Toplam Proje</p>
              <p className="text-3xl font-bold text-white">{stats.projects}</p>
            </div>
            <div className="bg-white/20 rounded-full p-3">
              <FaProjectDiagram className="w-6 h-6 text-white" />
            </div>
          </div>
          <Link to="/admin/projects" className="text-white/80 text-sm hover:text-white mt-4 inline-block">
            Projeleri Yönet →
          </Link>
        </div>

        {/* Blog İstatistikleri */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-sm font-medium mb-1">Blog Yazıları</p>
              <p className="text-3xl font-bold text-white">{stats.blogs}</p>
            </div>
            <div className="bg-white/20 rounded-full p-3">
              <FaBlog className="w-6 h-6 text-white" />
            </div>
          </div>
          <Link to="/admin/blog" className="text-white/80 text-sm hover:text-white mt-4 inline-block">
            Blog Yazılarını Yönet →
          </Link>
        </div>

        {/* Mesaj İstatistikleri */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-sm font-medium mb-1">Mesajlar</p>
              <p className="text-3xl font-bold text-white">{stats.messages}</p>
            </div>
            <div className="bg-white/20 rounded-full p-3">
              <FaEnvelope className="w-6 h-6 text-white" />
            </div>
          </div>
          <Link to="/admin/messages" className="text-white/80 text-sm hover:text-white mt-4 inline-block">
            Mesajları Görüntüle →
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Son Aktiviteler</h2>
        
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : activities.length > 0 ? (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className={`flex-shrink-0 ${getActionColor(activity.action)}`}>
                  {getActionIcon(activity.action)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{getEntityTypeText(activity.entityType)}</span>
                    <span className={`text-sm ${getActionColor(activity.action)}`}>
                      {activity.details}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(activity.timestamp).toLocaleString('tr-TR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>Henüz aktivite bulunmuyor</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 
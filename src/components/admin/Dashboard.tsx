import React, { useEffect, useState } from 'react';
import { FirebaseService } from '../../services/firebaseService';
import { FaProjectDiagram, FaCode, FaGraduationCap, FaCertificate, FaBlog, FaUser, FaEye, FaEnvelope } from 'react-icons/fa';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { blogPostService } from '../../services/blogPostService';
import { projectService } from '../../services/projectService';
import { contactService } from '../../services/contactService';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface Stats {
  projects: number;
  technologies: number;
  education: number;
  certificates: number;
  blogPosts: number;
  about: number;
  visitors: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    projects: 0,
    technologies: 0,
    education: 0,
    certificates: 0,
    blogPosts: 0,
    about: 0,
    visitors: Math.floor(Math.random() * 1000) // Örnek ziyaretçi sayısı
  });

  const [loading, setLoading] = useState(true);
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalMessages, setTotalMessages] = useState(0);
  const [newMessages, setNewMessages] = useState(0);

  useEffect(() => {
    loadStats();
    loadData();
  }, []);

  const loadStats = async () => {
    try {
      const projectCount = (await FirebaseService.getAll('projects')).length;
      const techCount = (await FirebaseService.getAll('technologies')).length;
      const eduCount = (await FirebaseService.getAll('education')).length;
      const certCount = (await FirebaseService.getAll('certificates')).length;
      const blogCount = (await FirebaseService.getAll('blogPosts')).length;
      const aboutCount = (await FirebaseService.getAll('about')).length;

      setStats({
        projects: projectCount,
        technologies: techCount,
        education: eduCount,
        certificates: certCount,
        blogPosts: blogCount,
        about: aboutCount,
        visitors: Math.floor(Math.random() * 1000) // Örnek ziyaretçi sayısı
      });
    } catch (error) {
      //console.error('İstatistikler yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadData = async () => {
    try {
      // Projeleri yükle
      const projects = await projectService.getAllProjects();
      setTotalProjects(projects.length);

      // Blog yazılarını yükle
      const posts = await blogPostService.getAllBlogPosts();
      setTotalPosts(posts.length);

      // Mesajları yükle
      const messages = await contactService.getAllMessages();
      setTotalMessages(messages.length);
      setNewMessages(messages.filter(msg => msg.status === 'new').length);
    } catch (error) {
      //console.error('Veri yükleme hatası:', error);
    }
  };

  // Ziyaretçi grafiği için örnek veri
  const visitorData = {
    labels: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran'],
    datasets: [
      {
        label: 'Aylık Ziyaretçi',
        data: Array.from({ length: 6 }, () => Math.floor(Math.random() * 1000)),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.4,
        fill: true,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  // İçerik dağılımı için veri
  const contentDistribution = {
    labels: ['Projeler', 'Teknolojiler', 'Eğitim', 'Sertifikalar', 'Blog Yazıları'],
    datasets: [
      {
        data: [
          stats.projects,
          stats.technologies,
          stats.education,
          stats.certificates,
          stats.blogPosts,
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
        ],
      },
    ],
  };

  // Blog yazıları istatistikleri için örnek veri
  const blogStats = {
    labels: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran'],
    datasets: [
      {
        label: 'Blog Yazıları',
        data: Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)),
        backgroundColor: 'rgba(153, 102, 255, 0.8)',
      },
    ],
  };

  const cards = [
    {
      title: 'Toplam Proje',
      value: totalProjects,
      icon: FaProjectDiagram,
      color: 'bg-blue-500'
    },
    {
      title: 'Blog Yazıları',
      value: totalPosts,
      icon: FaBlog,
      color: 'bg-pink-500'
    },
    {
      title: 'Mesajlar',
      value: totalMessages,
      badge: newMessages > 0 ? newMessages : undefined,
      badgeColor: 'bg-red-500',
      icon: FaEnvelope,
      color: 'bg-green-500'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Dashboard</h1>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-gray-800 rounded-lg p-6 shadow-lg relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">{card.title}</p>
                <h3 className="text-3xl font-bold">{card.value}</h3>
                {card.badge && (
                  <span className={`${card.badgeColor} text-white text-xs px-2 py-1 rounded-full absolute top-2 right-2`}>
                    {card.badge} yeni
                  </span>
                )}
              </div>
              <div className={`${card.color} p-3 rounded-lg`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Grafikler */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Ziyaretçi Grafiği */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Ziyaretçi İstatistikleri</h2>
          <Line
            data={visitorData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top' as const,
                },
              },
            }}
          />
        </div>

        {/* İçerik Dağılımı */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">İçerik Dağılımı</h2>
          <Doughnut
            data={contentDistribution}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'right' as const,
                },
              },
            }}
          />
        </div>

        {/* Blog İstatistikleri */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Blog Yazıları İstatistikleri</h2>
          <Bar
            data={blogStats}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top' as const,
                },
              },
            }}
          />
        </div>

        {/* Son Aktiviteler */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Son Aktiviteler</h2>
          <div className="space-y-4">
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <p className="text-gray-600">Yeni bir proje eklendi</p>
              <span className="ml-auto text-gray-400">2 saat önce</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <p className="text-gray-600">Blog yazısı güncellendi</p>
              <span className="ml-auto text-gray-400">5 saat önce</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
              <p className="text-gray-600">Yeni sertifika eklendi</p>
              <span className="ml-auto text-gray-400">1 gün önce</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 
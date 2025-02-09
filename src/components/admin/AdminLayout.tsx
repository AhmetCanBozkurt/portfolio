import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation, useParams } from 'react-router-dom';
import { FaHome, FaProjectDiagram, FaCode, FaGraduationCap, FaCertificate, FaBlog, FaUser, FaTachometerAlt, FaChevronRight, FaEnvelope, FaSignOutAlt } from 'react-icons/fa';
import { projectService } from '../../services/projectService';
import { blogPostService } from '../../services/blogPostService';
import { certificateService } from '../../services/certificateService';
import { educationService } from '../../services/educationService';
import { technologyService } from '../../services/technologyService';
import { aboutService } from '../../services/aboutService';
import { authService } from '../../services/authService';
import { toast } from 'react-toastify';

interface MenuItem {
  path: string;
  icon: JSX.Element;
  text: string;
}

interface Breadcrumb {
  path: string;
  text: string;
  isLast: boolean;
}

const AdminLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [editItemTitle, setEditItemTitle] = useState<string>('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const loadEditItemTitle = async () => {
      const pathParts = location.pathname.split('/');
      const section = pathParts[2]; // projects, blog, certificates, etc.
      const action = pathParts[3]; // edit
      const id = pathParts[4]; // item id

      if (action === 'edit' && id) {
        try {
          let title = '';
          switch (section) {
            case 'projects':
              const project = await projectService.getProjectById(id);
              title = project?.title || '';
              break;
            case 'blog':
              const post = await blogPostService.getBlogPost(id);
              title = post?.title || '';
              break;
            case 'certificates':
              const certificate = await certificateService.getCertificateById(id);
              title = certificate?.title || '';
              break;
            case 'education':
              const education = await educationService.getEducationById(id);
              title = education?.school || '';
              break;
            case 'technologies':
              const technology = await technologyService.getTechnologyById(id);
              title = technology?.name || '';
              break;
            case 'about':
              const about = await aboutService.getAboutById(id);
              title = about?.title || '';
              break;
          }
          setEditItemTitle(title);
        } catch (error) {
         // //console.error('Başlık yüklenirken hata:', error);
        }
      }
    };

    loadEditItemTitle();
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await authService.logout();
      toast.success('Başarıyla çıkış yapıldı');
      navigate('/admin/login');
    } catch (error) {
      ////console.error('Çıkış hatası:', error);
      toast.error('Çıkış yapılırken bir hata oluştu');
    }
  };

  const menuItems: MenuItem[] = [
    { path: '/admin', icon: <FaTachometerAlt />, text: 'Dashboard' },
    { path: '/admin/about', icon: <FaUser />, text: 'Hakkımda' },
    { path: '/admin/projects', icon: <FaProjectDiagram />, text: 'Projeler' },
    { path: '/admin/technologies', icon: <FaCode />, text: 'Teknolojiler' },
    { path: '/admin/education', icon: <FaGraduationCap />, text: 'Eğitim' },
    { path: '/admin/certificates', icon: <FaCertificate />, text: 'Sertifikalar' },
    { path: '/admin/blog', icon: <FaBlog />, text: 'Blog' },
    { path: '/admin/messages', icon: <FaEnvelope />, text: 'Mesajlar' }
  ];

  const getBreadcrumbs = (): Breadcrumb[] => {
    const pathnames = location.pathname.split('/').filter((x) => x);
    const breadcrumbs: Breadcrumb[] = [];

    let currentPath = '';
    pathnames.forEach((name, index) => {
      currentPath += `/${name}`;
      
      // İlk eleman için (admin)
      if (index === 0) {
        breadcrumbs.push({
          path: currentPath,
          text: 'Admin Panel',
          isLast: index === pathnames.length - 1
        });
        return;
      }

      // ID kontrolü (/edit/123 gibi durumlar için)
      if (name === 'edit' && pathnames[index + 1]) {
        breadcrumbs.push({
          path: currentPath + `/${pathnames[index + 1]}`,
          text: editItemTitle || 'Yükleniyor...',
          isLast: true
        });
        return;
      }

      if (name === 'new') {
        breadcrumbs.push({
          path: currentPath,
          text: 'Yeni Ekle',
          isLast: true
        });
        return;
      }

      // Menü itemlarından eşleşen varsa onun text'ini kullan
      const menuItem = menuItems.find(item => item.path === currentPath);
      if (menuItem && !name.match(/^\d+$/)) { // ID değilse
        breadcrumbs.push({
          path: currentPath,
          text: menuItem.text,
          isLast: index === pathnames.length - 1
        });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Mobile Header */}
      <div className="md:hidden bg-white shadow-sm p-4 flex items-center justify-between">
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h2 className="text-xl font-bold text-indigo-600">Admin Panel</h2>
        <div className="flex items-center gap-2">
          <Link to="/" className="p-2 text-gray-600 hover:text-gray-800">
            <FaHome className="w-6 h-6" />
          </Link>
        </div>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-50
        transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 transition-transform duration-300 ease-in-out
        bg-white shadow-lg md:w-64 w-64 min-h-screen
      `}>
        <div className="flex flex-col h-full">
          <div className="p-4 flex items-center justify-between md:justify-start">
            <h2 className="text-xl font-bold text-indigo-600">Admin Panel</h2>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="flex-1 px-2 py-4 overflow-y-auto">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`
                  flex items-center px-4 py-3 mb-2 rounded-lg
                  hover:bg-indigo-50 text-gray-700
                  ${location.pathname === item.path ? 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600' : ''}
                `}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="ml-3 text-gray-700">{item.text}</span>
              </Link>
            ))}
          </nav>

          {/* Bottom Buttons */}
          <div className="p-4 border-t border-gray-200">
            <Link
              to="/"
              onClick={() => setIsSidebarOpen(false)}
              className="flex items-center gap-2 px-4 py-3 mb-2 rounded-lg hover:bg-indigo-50 text-gray-700"
            >
              <FaHome className="text-xl" />
              <span>Ana Sayfa</span>
            </Link>
            <button
              onClick={() => {
                setIsSidebarOpen(false);
                handleLogout();
              }}
              className="flex items-center gap-2 w-full px-4 py-3 rounded-lg hover:bg-red-50 text-red-600"
            >
              <FaSignOutAlt className="text-xl" />
              <span>Çıkış Yap</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white shadow-sm">
          <div className="px-4 py-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2 text-sm text-gray-500 overflow-x-auto whitespace-nowrap pb-2 md:pb-0">
                  {breadcrumbs.map((item, index) => (
                    <React.Fragment key={item.path}>
                      {index > 0 && <FaChevronRight className="text-gray-400 flex-shrink-0" />}
                      {item.isLast ? (
                        <span className="font-medium text-gray-800">{item.text}</span>
                      ) : (
                        <Link to={item.path} className="hover:text-indigo-600">
                          {item.text}
                        </Link>
                      )}
                    </React.Fragment>
                  ))}
                </div>
                <h1 className="text-lg md:text-2xl font-semibold text-gray-900 mt-1">
                  {breadcrumbs[breadcrumbs.length - 1]?.text || 'Admin Panel'}
                </h1>
              </div>
              <button 
                onClick={handleLogout}
                className="hidden md:flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200"
              >
                <FaSignOutAlt className="mr-2" />
                Çıkış Yap
              </button>
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-x-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 
import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { FaHome, FaBlog, FaEnvelope, FaSignOutAlt } from 'react-icons/fa';

const AdminLayout: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const menuItems = [
    { path: '/admin', icon: FaHome, text: 'Ana Sayfa' },
    { path: '/admin/blog', icon: FaBlog, text: 'Blog Yönetimi' },
    { path: '/admin/messages', icon: FaEnvelope, text: 'Mesajlar' }
  ];

  const handleLogout = () => {
    // Çıkış işlemleri burada yapılacak
    window.location.href = '/admin/login';
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-full w-64 bg-black border-r border-gray-800">
        <div className="flex flex-col h-full">
          <div className="p-6">
            <h1 className="text-xl font-bold text-white">Admin Panel</h1>
          </div>

          <nav className="flex-1">
            <ul className="space-y-2 px-4">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                      ${isActive(item.path)
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                      }
                    `}
                  >
                    <item.icon className="text-lg" />
                    <span>{item.text}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t border-gray-800">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <FaSignOutAlt className="text-lg" />
              <span>Çıkış Yap</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 min-h-screen bg-gray-900 text-white">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout; 
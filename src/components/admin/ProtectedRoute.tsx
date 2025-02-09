import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '../../services/authService';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (user) {
          const adminCheck = await authService.isAdmin();
          setIsAdmin(adminCheck);
          setIsAuthenticated(!!user && adminCheck);
        } else {
          setIsAuthenticated(false);
          setIsAdmin(false);
        }
      } catch (error) {
        //console.error('Yetkilendirme kontrolü hatası:', error);
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null || isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 
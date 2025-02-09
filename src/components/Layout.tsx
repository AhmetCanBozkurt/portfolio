import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useApp } from '../contexts/AppContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { theme } = useApp();
  
  return (
    <div className={`relative w-full min-h-screen transition-colors duration-300
      ${theme === 'dark' 
        ? 'bg-dark-background text-dark-text' 
        : 'bg-light-background text-light-text'}`}
    >
      <Navbar />
      <main className="relative w-full min-h-screen">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout; 
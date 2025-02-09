import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { FaSun, FaMoon, FaGlobe } from 'react-icons/fa'
import { useApp } from '../contexts/AppContext'

const navigation = [
 
  { name: 'Hakkımda', href: '/about' },
  { name: 'Blog', href: '/blog' },
  { name: 'Projeler', href: '/projects' },
  { name: 'İletişim', href: '/#contact' }
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const { theme, language, toggleTheme, toggleLanguage, t } = useApp();

  const handleNavigation = (href: string) => {
    if (href.startsWith('/#') && isHomePage) {
      const sectionId = href.replace('/#', '');
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b transition-colors duration-300
      ${theme === 'dark'
        ? 'bg-dark-surface/80 border-dark-border'
        : 'bg-light-surface/80 border-light-border'}`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className={`text-xl font-bold transition-colors hover:text-primary
              ${theme === 'dark' ? 'text-dark-text' : 'text-light-text'}`}
          >
            Ahmet Can Bozkurt
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => handleNavigation(item.href)}
                className={`transition-colors hover:text-primary
                  ${theme === 'dark' ? 'text-dark-secondary' : 'text-light-secondary'}`}
              >
                {t(`${item.name.toUpperCase()}`)}
              </Link>
            ))}
          </div>

          {/* Theme and Language Toggles */}
          <div className="flex items-center space-x-4">
            {/* Language Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleLanguage}
              className={`p-2 rounded-lg transition-colors
                ${theme === 'dark'
                  ? 'bg-dark-surface hover:bg-dark-border text-dark-secondary hover:text-dark-text'
                  : 'bg-light-surface hover:bg-light-border text-light-secondary hover:text-light-text'}`}
              title={language === 'tr' ? 'Switch to English' : 'Türkçe\'ye Geç'}
            >
              <div className="flex items-center space-x-1">
                <FaGlobe className="text-lg" />
                <span className="text-sm font-medium">{language.toUpperCase()}</span>
              </div>
            </motion.button>

            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors
                ${theme === 'dark'
                  ? 'bg-dark-surface hover:bg-dark-border text-dark-secondary hover:text-dark-text'
                  : 'bg-light-surface hover:bg-light-border text-light-secondary hover:text-light-text'}`}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <FaSun className="text-lg" />
              ) : (
                <FaMoon className="text-lg" />
              )}
            </motion.button>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2 transition-colors ${theme === 'dark' ? 'text-dark-text' : 'text-light-text'}`}
              >
                <div className="w-6 flex flex-col gap-1.5">
                  <span className={`block h-px w-full transition-transform ${isMenuOpen ? 'rotate-45 translate-y-2.5' : ''} ${theme === 'dark' ? 'bg-dark-text' : 'bg-light-text'}`} />
                  <span className={`block h-px w-full transition-opacity ${isMenuOpen ? 'opacity-0' : ''} ${theme === 'dark' ? 'bg-dark-text' : 'bg-light-text'}`} />
                  <span className={`block h-px w-full transition-transform ${isMenuOpen ? '-rotate-45 -translate-y-2.5' : ''} ${theme === 'dark' ? 'bg-dark-text' : 'bg-light-text'}`} />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`md:hidden border-t transition-colors duration-300
            ${theme === 'dark'
              ? 'border-dark-border bg-dark-surface/90'
              : 'border-light-border bg-light-surface/90'}`}
        >
          <div className="px-4 py-8 space-y-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => handleNavigation(item.href)}
                className={`block text-sm tracking-wider transition-opacity hover:opacity-70
                  ${theme === 'dark' ? 'text-dark-text' : 'text-light-text'}`}
              >
                {t(`${item.name.toUpperCase()}`)}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar; 
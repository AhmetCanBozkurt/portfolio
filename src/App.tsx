import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import FeaturedProjects from './components/FeaturedProjects'
import Projects from './pages/Projects'
import Contact from './components/Contact'
import Footer from './components/Footer'
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './components/admin/Dashboard';
import ProjectForm from './components/admin/ProjectForm';
import ProjectList from './components/admin/ProjectList';
import TechnologyForm from './components/admin/TechnologyForm';
import TechnologyList from './components/admin/TechnologyList';
import EducationForm from './components/admin/EducationForm';
import EducationList from './components/admin/EducationList';
import CertificateForm from './components/admin/CertificateForm';
import CertificateList from './components/admin/CertificateList';
import BlogPostForm from './components/admin/BlogPostForm';
import BlogPostList from './components/admin/BlogPostList';
import AboutForm from './components/admin/AboutForm';
import AboutList from './components/admin/AboutList';
import Messages from './pages/admin/Messages';
import { migrateDataToFirebase, createAdminUser } from './utils/migrateToFirebase';
import { migrateAboutDataToFirebase } from './utils/migrateToFirebase';
import { FirebaseService } from './services/firebaseService';
import Login from './components/admin/Login';
import ProtectedRoute from './components/admin/ProtectedRoute';
import BlogPreview from './components/BlogPreview'
import BlogList from './components/BlogList'
import { AppProvider, useApp } from './contexts/AppContext';
import AboutPage from './pages/AboutPage';
import BlogDetail from './pages/BlogDetail';
import ProjectDetail from './pages/ProjectDetail';
import ScrollToTop from './components/ScrollToTop';

const MainLayout = () => {
  const { theme } = useApp();
  
  return (
    <div className={`relative w-full min-h-screen transition-colors duration-300
      ${theme === 'dark' 
        ? 'bg-dark-background text-dark-text' 
        : 'bg-light-background text-light-text'}`}
    >
      <Navbar />
      <main className="relative w-full">
        <Hero />
        <About />
        <FeaturedProjects />
        <BlogPreview />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

function App() {
  
  return (
    <AppProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Ana Sayfa Route */}
          <Route path="/" element={<MainLayout />} />
          
          {/* About Page Route */}
          <Route path="/about" element={<AboutPage />} />
          
          {/* Blog Routes */}
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          
          {/* Projects Route */}
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          
          {/* Admin Login */}
          <Route path="/admin/login" element={<Login />} />
          
          {/* Protected Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            
            {/* About Routes */}
            <Route path="about" element={<AboutList />} />
            <Route path="about/new" element={<AboutForm />} />
            <Route path="about/edit/:id" element={<AboutForm />} />
            
            {/* Proje Routes */}
            <Route path="projects" element={<ProjectList />} />
            <Route path="projects/new" element={<ProjectForm />} />
            <Route path="projects/edit/:id" element={<ProjectForm />} />
            
            {/* Teknoloji Routes */}
            <Route path="technologies" element={<TechnologyList />} />
            <Route path="technologies/new" element={<TechnologyForm />} />
            <Route path="technologies/edit/:id" element={<TechnologyForm />} />
            
            {/* Eğitim Routes */}
            <Route path="education" element={<EducationList />} />
            <Route path="education/new" element={<EducationForm />} />
            <Route path="education/edit/:id" element={<EducationForm />} />
            
            {/* Sertifika Routes */}
            <Route path="certificates" element={<CertificateList />} />
            <Route path="certificates/new" element={<CertificateForm />} />
            <Route path="certificates/edit/:id" element={<CertificateForm />} />
            
            {/* Blog Routes */}
            <Route path="blog" element={<BlogPostList />} />
            <Route path="blog/new" element={<BlogPostForm />} />
            <Route path="blog/edit/:id" element={<BlogPostForm />} />

            {/* Messages Route */}
            <Route path="messages" element={<Messages />} />
          </Route>

          {/* 404 Sayfası */}
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-800">404</h1>
                <p className="mt-4 text-xl text-gray-600">Sayfa bulunamadı</p>
                <a href="/" className="mt-6 inline-block px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                  Ana Sayfaya Dön
                </a>
              </div>
            </div>
          } />
        </Routes>
      </Router>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </AppProvider>
  );
}

export default App;

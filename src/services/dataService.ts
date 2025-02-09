import { deleteImage } from './imageService';

// Tip tanımlamaları
export interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  githubUrl: string;
  liveUrl: string;
  technologies: string[];
  createdAt: string;
}

export interface Technology {
  id: number;
  name: string;
  category: string;
  proficiencyLevel: number;
  icon: string;
  description: string;
}

export interface Education {
  id: number;
  schoolName: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  description: string;
  location: string;
  gpa: string;
}

export interface Certificate {
  id: number;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate: string;
  credentialId: string;
  credentialUrl: string;
  description: string;
  category: string;
  imageUrl: string;
}

export interface BlogPost {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  coverImage: string;
  tags: string[];
  status: 'draft' | 'published';
  publishDate: string;
  author: string;
  readTime: string;
}

// Form veri tipleri
export type ProjectFormData = Omit<Project, 'id' | 'createdAt'>;

const API_URL = 'http://localhost:5000/api';

// API çağrı fonksiyonu
async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Bir hata oluştu' }));
    throw new Error(error.message || 'Bir hata oluştu');
  }

  // 204 No Content yanıtı için boş obje dön
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

// Veri okuma fonksiyonları
export const getProjects = (): Promise<Project[]> => fetchApi('/projects');
export const getTechnologies = (): Promise<Technology[]> => fetchApi('/technologies');
export const getEducation = (): Promise<Education[]> => fetchApi('/education');
export const getCertificates = (): Promise<Certificate[]> => fetchApi('/certificates');
export const getBlogPosts = (): Promise<BlogPost[]> => fetchApi('/blog-posts');

// Veri kaydetme fonksiyonları
export const saveProject = async (project: ProjectFormData & { createdAt: string }): Promise<void> => {
  await fetchApi('/projects', {
    method: 'POST',
    body: JSON.stringify(project),
  });
};

export const saveTechnology = async (technology: Omit<Technology, 'id'>): Promise<void> => {
  await fetchApi('/technologies', {
    method: 'POST',
    body: JSON.stringify(technology),
  });
};

export const saveEducation = async (education: Omit<Education, 'id'>): Promise<void> => {
  await fetchApi('/education', {
    method: 'POST',
    body: JSON.stringify(education),
  });
};

export const saveCertificate = async (certificate: Omit<Certificate, 'id'>): Promise<void> => {
  await fetchApi('/certificates', {
    method: 'POST',
    body: JSON.stringify(certificate),
  });
};

export const saveBlogPost = async (blogPost: Omit<BlogPost, 'id'>): Promise<void> => {
  await fetchApi('/blog-posts', {
    method: 'POST',
    body: JSON.stringify(blogPost),
  });
};

// Güncelleme fonksiyonları
export const updateProject = async (id: number, project: ProjectFormData & { createdAt: string }): Promise<void> => {
  const oldProject = (await getProjects()).find(p => p.id === id);
  if (oldProject?.imageUrl && oldProject.imageUrl !== project.imageUrl) {
    await deleteImage(oldProject.imageUrl);
  }
  await fetchApi(`/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(project),
  });
};

export const updateTechnology = async (id: number, technology: Omit<Technology, 'id'>): Promise<void> => {
  await fetchApi(`/technologies/${id}`, {
    method: 'PUT',
    body: JSON.stringify(technology),
  });
};

export const updateEducation = async (id: number, education: Omit<Education, 'id'>): Promise<void> => {
  await fetchApi(`/education/${id}`, {
    method: 'PUT',
    body: JSON.stringify(education),
  });
};

export const updateCertificate = async (id: number, certificate: Omit<Certificate, 'id'>): Promise<void> => {
  await fetchApi(`/certificates/${id}`, {
    method: 'PUT',
    body: JSON.stringify(certificate),
  });
};

export const updateBlogPost = async (id: number, blogPost: Omit<BlogPost, 'id'>): Promise<void> => {
  await fetchApi(`/blog-posts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(blogPost),
  });
};

// Silme fonksiyonları
export const deleteProject = async (id: number): Promise<void> => {
  const project = (await getProjects()).find(p => p.id === id);
  if (project?.imageUrl) {
    await deleteImage(project.imageUrl);
  }
  await fetchApi(`/projects/${id}`, { method: 'DELETE' });
};

export const deleteTechnology = async (id: number): Promise<void> => {
  await fetchApi(`/technologies/${id}`, { method: 'DELETE' });
};

export const deleteEducation = async (id: number): Promise<void> => {
  await fetchApi(`/education/${id}`, { method: 'DELETE' });
};

export const deleteCertificate = async (id: number): Promise<void> => {
  await fetchApi(`/certificates/${id}`, { method: 'DELETE' });
};

export const deleteBlogPost = async (id: number): Promise<void> => {
  await fetchApi(`/blog-posts/${id}`, { method: 'DELETE' });
}; 
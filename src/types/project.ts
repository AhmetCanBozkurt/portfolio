export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  imageUrl: string;
  liveUrl?: string;
  githubUrl?: string;
  createdAt: Date;
  updatedAt?: Date;
  featured?: boolean;
}

export interface ProjectCardProps {
  project: Project;
} 
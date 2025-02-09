export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt?: Date;
  status: 'draft' | 'published';
} 
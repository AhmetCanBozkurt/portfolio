import { FirebaseService } from './firebaseService';

const COLLECTION_NAME = 'about';

export interface About {
  id?: string;
  title: string;
  content: string;
  skills: string[];
  interests: string[];
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  };
  email: string;
  phone?: string;
  location?: string;
  profileImage?: string;
  cvFile?: string;
  createdAt?: any;
  updatedAt?: any;
}

class AboutService {
  async getAllAbout(): Promise<About[]> {
    return await FirebaseService.getAll(COLLECTION_NAME) as About[];
  }

  async getAboutById(id: string): Promise<About | null> {
    try {
      const aboutList = await this.getAllAbout();
      return aboutList.find(about => about.id === id) || null;
    } catch (error) {
      //console.error('Hakkımda bilgisi getirme hatası:', error);
      return null;
    }
  }

  async addAbout(about: Omit<About, 'id' | 'createdAt' | 'updatedAt'>): Promise<About> {
    const newAbout = {
      ...about,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return await FirebaseService.add(COLLECTION_NAME, newAbout) as About;
  }

  async updateAbout(id: string, updates: Partial<About>): Promise<About | null> {
    try {
      const updatedAbout = {
        ...updates,
        updatedAt: new Date().toISOString()
      };

      return await FirebaseService.update(COLLECTION_NAME, id, updatedAbout) as About;
    } catch (error) {
      //console.error('Hakkımda bilgisi güncelleme hatası:', error);
      return null;
    }
  }

  async deleteAbout(id: string): Promise<boolean> {
    try {
      await FirebaseService.delete(COLLECTION_NAME, id);
      return true;
    } catch (error) {
      //console.error('Hakkımda bilgisi silme hatası:', error);
      return false;
    }
  }
}

export const aboutService = new AboutService(); 
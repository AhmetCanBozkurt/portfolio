import { FirebaseService } from './firebaseService';

const COLLECTION_NAME = 'education';

export interface Education {
  id: string;
  school: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  grade: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

class EducationService {
  async getAllEducation(): Promise<Education[]> {
    return await FirebaseService.getAll(COLLECTION_NAME) as Education[];
  }

  async getEducationById(id: string): Promise<Education | null> {
    try {
      const educationList = await this.getAllEducation();
      return educationList.find(edu => edu.id === id) || null;
    } catch (error) {
      //console.error('Eğitim bilgisi getirme hatası:', error);
      return null;
    }
  }

  async addEducation(education: Omit<Education, 'id' | 'createdAt' | 'updatedAt'>): Promise<Education> {
    const newEducation = {
      ...education,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return await FirebaseService.add(COLLECTION_NAME, newEducation) as Education;
  }

  async updateEducation(id: string, updates: Partial<Education>): Promise<Education | null> {
    try {
      const updatedEducation = {
        ...updates,
        updatedAt: new Date().toISOString()
      };

      return await FirebaseService.update(COLLECTION_NAME, id, updatedEducation) as Education;
    } catch (error) {
      //console.error('Eğitim bilgisi güncelleme hatası:', error);
      return null;
    }
  }

  async deleteEducation(id: string): Promise<boolean> {
    try {
      await FirebaseService.delete(COLLECTION_NAME, id);
      return true;
    } catch (error) {
      //console.error('Eğitim bilgisi silme hatası:', error);
      return false;
    }
  }
}

export const educationService = new EducationService(); 
import { FirebaseService } from './firebaseService';

const COLLECTION_NAME = 'certificates';

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId: string;
  credentialUrl?: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

class CertificateService {
  async getAllCertificates(): Promise<Certificate[]> {
    return await FirebaseService.getAll(COLLECTION_NAME) as Certificate[];
  }

  async getCertificateById(id: string): Promise<Certificate | null> {
    try {
      const certificates = await this.getAllCertificates();
      return certificates.find(cert => cert.id === id) || null;
    } catch (error) {
      //console.error('Sertifika getirme hatası:', error);
      return null;
    }
  }

  async addCertificate(certificate: Omit<Certificate, 'id' | 'createdAt' | 'updatedAt'>): Promise<Certificate> {
    const newCertificate = {
      ...certificate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return await FirebaseService.add(COLLECTION_NAME, newCertificate) as Certificate;
  }

  async updateCertificate(id: string, updates: Partial<Certificate>): Promise<Certificate | null> {
    try {
      const updatedCertificate = {
        ...updates,
        updatedAt: new Date().toISOString()
      };

      return await FirebaseService.update(COLLECTION_NAME, id, updatedCertificate) as Certificate;
    } catch (error) {
      //console.error('Sertifika güncelleme hatası:', error);
      return null;
    }
  }

  async deleteCertificate(id: string): Promise<boolean> {
    try {
      await FirebaseService.delete(COLLECTION_NAME, id);
      return true;
    } catch (error) {
      //console.error('Sertifika silme hatası:', error);
      return false;
    }
  }
}

export const certificateService = new CertificateService(); 
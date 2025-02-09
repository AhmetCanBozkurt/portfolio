import path from 'path';
import fs from 'fs/promises';

export type ImageCategory = 'projects' | 'blogs' | 'certificates' | 'technologies';

export const saveImage = async (file: File, folder: string = 'projects'): Promise<string> => {
  try {
    // Dosya adını benzersiz yap
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    
    // Base64'e çevir
    const base64 = await fileToBase64(file);
    
    // LocalStorage'a kaydet
    const key = `image_${folder}_${fileName}`;
    localStorage.setItem(key, base64);
    
    return key;
  } catch (error) {
    //console.error('Görsel kaydetme hatası:', error);
    throw new Error('Görsel kaydedilemedi');
  }
};

export const deleteImage = async (imageKey: string): Promise<boolean> => {
  try {
    localStorage.removeItem(imageKey);
    return true;
  } catch (error) {
    //console.error('Görsel silme hatası:', error);
    return false;
  }
};

export const getImage = (imageKey: string): string | null => {
  return localStorage.getItem(imageKey);
};

// Dosyayı base64'e çevirir
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
} 
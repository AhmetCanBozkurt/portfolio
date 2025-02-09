import { collection, addDoc, getDocs, updateDoc, doc, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { EmailService } from './emailService';
import { v4 as uuidv4 } from 'uuid';

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt: Date;
  updatedAt: Date;
  messageId: string;
  reply?: string;
  replyDate?: Date;
}

export const contactService = {
  // Yeni mesaj gönder
  sendMessage: async (name: string, email: string, message: string): Promise<boolean> => {
    try {
      const messageId = uuidv4();
      const now = new Date();

      // Firebase'e kaydet
      const messageData: Omit<ContactMessage, 'id'> = {
        name,
        email,
        message,
        status: 'new',
        createdAt: now,
        updatedAt: now,
        messageId
      };

      const docRef = await addDoc(collection(db, 'contacts'), messageData);

      // EmailJS ile e-posta gönder
      await EmailService.sendContactForm({
        from_name: name,
        from_email: email,
        message: message,
        message_id: messageId,
        send_date: now.toLocaleString('tr-TR')
      });

      return true;
    } catch (error) {
      //console.error('Mesaj gönderme hatası:', error);
      return false;
    }
  },

  // Tüm mesajları getir
  getAllMessages: async (): Promise<ContactMessage[]> => {
    try {
      const q = query(collection(db, 'contacts'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate(),
        replyDate: doc.data().replyDate?.toDate()
      } as ContactMessage));
    } catch (error) {
      //console.error('Mesajları getirme hatası:', error);
      return [];
    }
  },

  // Mesaj durumunu güncelle
  updateMessageStatus: async (messageId: string, status: 'new' | 'read' | 'replied'): Promise<boolean> => {
    try {
      const messageRef = doc(db, 'contacts', messageId);
      await updateDoc(messageRef, { 
        status,
        updatedAt: Timestamp.fromDate(new Date())
      });
      return true;
    } catch (error) {
      //console.error('Mesaj durumu güncelleme hatası:', error);
      return false;
    }
  },

  // Mesaja cevap ver
  replyToMessage: async (messageId: string, reply: string): Promise<boolean> => {
    try {
      const messageRef = doc(db, 'contacts', messageId);
      const now = new Date();
      await updateDoc(messageRef, {
        reply,
        replyDate: Timestamp.fromDate(now),
        status: 'replied',
        updatedAt: Timestamp.fromDate(now)
      });
      return true;
    } catch (error) {
      //console.error('Mesaj yanıtlama hatası:', error);
      return false;
    }
  }
}; 
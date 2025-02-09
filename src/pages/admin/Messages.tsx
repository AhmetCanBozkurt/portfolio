import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaCheck, FaReply, FaTimes, FaClock } from 'react-icons/fa';
import { contactService, ContactMessage } from '../../services/contactService';
import { emailService } from '../../services/emailService';
import { toast } from 'react-toastify';

const Messages: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const data = await contactService.getAllMessages();
      setMessages(data);
    } catch (error) {
      toast.error('Mesajlar yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: ContactMessage['status']) => {
    try {
      await contactService.updateMessageStatus(id, status);
      toast.success('Mesaj durumu güncellendi.');
      loadMessages();
    } catch (error) {
      toast.error('Durum güncellenirken bir hata oluştu.');
    }
  };

  const handleReply = async () => {
    if (!selectedMessage || !replyText.trim()) return;

    try {
      // Mesajı veritabanında güncelle
      await contactService.replyToMessage(selectedMessage.id!, replyText);

      // E-posta bildirimi gönder
      await emailService.sendReplyNotification({
        to_email: selectedMessage.email,
        to_name: selectedMessage.name,
        reply_message: replyText,
        original_message: selectedMessage.message
      });

      toast.success('Yanıt başarıyla gönderildi');
      setSelectedMessage(null);
      setReplyText('');
      loadMessages();
    } catch (error) {
      //console.error('Yanıt gönderme hatası:', error);
      toast.error('Yanıt gönderilirken bir hata oluştu');
    }
  };

  const getStatusColor = (status: ContactMessage['status']) => {
    switch (status) {
      case 'new':
        return 'bg-yellow-500';
      case 'read':
        return 'bg-blue-500';
      case 'replied':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: ContactMessage['status']) => {
    switch (status) {
      case 'new':
        return 'Yeni';
      case 'read':
        return 'Okundu';
      case 'replied':
        return 'Yanıtlandı';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8"></h1>

      <div className="grid gap-6">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 rounded-lg p-6 shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <span className={`w-3 h-3 rounded-full ${getStatusColor(message.status)}`}></span>
                  <span className="text-gray-400 text-sm">{getStatusText(message.status)}</span>
                  <span className="text-gray-400 text-sm">
                    {new Date(message.createdAt).toLocaleString('tr-TR')}
                  </span>
                </div>

                <h3 className="text-xl font-semibold mb-2 text-white">{message.name}</h3>
                <p className="text-gray-400 mb-2">{message.email}</p>
                <p className="text-gray-300 mb-4">{message.message}</p>

                {message.reply && (
                  <div className="mt-4 pl-4 border-l-2 border-blue-500">
                    <p className="text-gray-400 text-sm mb-1">Yanıtınız:</p>
                    <p className="text-gray-300">{message.reply}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                {message.status === 'new' && (
                  <button
                    onClick={() => handleStatusChange(message.id!, 'read')}
                    className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                    title="Okundu olarak işaretle"
                  >
                    <FaCheck />
                  </button>
                )}
                {!message.reply && (
                  <button
                    onClick={() => setSelectedMessage(message)}
                    className="p-2 text-green-400 hover:text-green-300 transition-colors"
                    title="Yanıtla"
                  >
                    <FaReply />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Mesajı Yanıtla</h3>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="mb-4">
                <p className="text-gray-400 mb-2">Gönderen: {selectedMessage.name}</p>
                <p className="text-gray-400 mb-4">E-posta: {selectedMessage.email}</p>
                <p className="text-gray-300 mb-4">Mesaj: {selectedMessage.message}</p>
              </div>

              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Yanıtınızı yazın..."
                className="w-full p-4 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-300 resize-none mb-4"
                rows={5}
              />

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={handleReply}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Yanıtı Gönder
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Messages; 
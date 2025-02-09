import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../contexts/AppContext';
import { emailService } from '../services/emailService';
import { toast } from 'react-toastify';

const Contact = () => {
  const { theme } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      await emailService.sendEmail(formData);
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      toast.success('Mesajınız başarıyla gönderildi! Size en kısa sürede dönüş yapacağız.');
    } catch (error) {
      setStatus('error');
      const message = error instanceof Error ? error.message : 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.';
      setErrorMessage(message);
      toast.error(message);
    }
  };

  return (
    <section id="contact" className={`py-20 transition-colors duration-300
      ${theme === 'dark' ? 'bg-dark-background' : 'bg-light-background'}`}
    >
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 transition-colors
            ${theme === 'dark' ? 'text-dark-text' : 'text-light-text'}`}>
            İletişime Geç
          </h2>
          <p className={`max-w-2xl mx-auto transition-colors
            ${theme === 'dark' ? 'text-dark-secondary' : 'text-light-secondary'}`}>
            Projeleriniz için benimle iletişime geçebilirsiniz. En kısa sürede dönüş yapacağım.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div>
            <label
              htmlFor="name"
              className={`block text-sm font-medium mb-2 transition-colors
                ${theme === 'dark' ? 'text-dark-text' : 'text-light-text'}`}
            >
              İsim
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className={`w-full px-4 py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary
                ${theme === 'dark'
                  ? 'bg-dark-surface border border-dark-border text-dark-text placeholder-dark-secondary'
                  : 'bg-light-surface border border-light-border text-light-text placeholder-light-secondary'}`}
              placeholder="Adınız Soyadınız"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className={`block text-sm font-medium mb-2 transition-colors
                ${theme === 'dark' ? 'text-dark-text' : 'text-light-text'}`}
            >
              E-posta
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className={`w-full px-4 py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary
                ${theme === 'dark'
                  ? 'bg-dark-surface border border-dark-border text-dark-text placeholder-dark-secondary'
                  : 'bg-light-surface border border-light-border text-light-text placeholder-light-secondary'}`}
              placeholder="ornek@email.com"
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className={`block text-sm font-medium mb-2 transition-colors
                ${theme === 'dark' ? 'text-dark-text' : 'text-light-text'}`}
            >
              Mesaj
            </label>
            <textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
              rows={5}
              className={`w-full px-4 py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary
                ${theme === 'dark'
                  ? 'bg-dark-surface border border-dark-border text-dark-text placeholder-dark-secondary'
                  : 'bg-light-surface border border-light-border text-light-text placeholder-light-secondary'}`}
              placeholder="Mesajınız..."
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              disabled={status === 'loading'}
              className={`px-8 py-3 rounded-lg font-medium transition-all duration-300
                ${status === 'loading'
                  ? 'bg-gray-500 cursor-not-allowed opacity-70'
                  : 'bg-primary text-white hover:bg-accent hover:shadow-lg hover:shadow-primary/20'}`}
            >
              {status === 'loading' ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Gönderiliyor...
                </div>
              ) : 'Gönder'}
            </button>
          </div>

          {status === 'success' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-green-500 bg-green-50 dark:bg-green-900/20 p-4 rounded-lg"
            >
              Mesajınız başarıyla gönderildi! Size en kısa sürede dönüş yapacağız.
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-red-500 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg"
            >
              {errorMessage}
            </motion.div>
          )}
        </motion.form>
      </div>
    </section>
  );
};

export default Contact; 
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { toast } from 'react-toastify';
import { FaLock, FaEnvelope } from 'react-icons/fa';
import { emailService } from '../../services/emailService';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await authService.login(email, password);
      setUserId(user.uid);
      setShowVerification(true);
      
      // Doğrulama kodunu e-posta ile gönder
      const verificationCode = await authService.getVerificationCode(user.uid);
      if (verificationCode) {
        await emailService.sendVerificationCode(email, verificationCode);
        toast.success('Doğrulama kodu e-posta adresinize gönderildi');
      } else {
        toast.error('Doğrulama kodu oluşturulamadı');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Giriş başarısız');
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authService.verifyCode(userId, verificationCode);
      toast.success('Giriş başarılı');
      navigate('/admin');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Doğrulama başarısız');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Paneli
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {showVerification ? 'E-posta adresinize gönderilen kodu girin' : 'Giriş yapmak için bilgilerinizi girin'}
          </p>
        </div>

        {!showVerification ? (
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email" className="sr-only">E-posta</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="E-posta adresi"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Şifre</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Şifre"
                  />
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
              </button>
            </div>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleVerification}>
            <div>
              <label htmlFor="code" className="sr-only">Doğrulama Kodu</label>
              <input
                id="code"
                name="code"
                type="text"
                required
                maxLength={6}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="6 haneli doğrulama kodu"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || verificationCode.length !== 6}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? 'Doğrulanıyor...' : 'Doğrula'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login; 
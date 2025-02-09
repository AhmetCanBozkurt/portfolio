import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Certificate, certificateService } from '../../services/certificateService';
import { toast } from 'react-toastify';

interface CertificateFormData {
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId: string;
  credentialUrl?: string;
  description: string;
}

const initialFormData: CertificateFormData = {
  title: '',
  issuer: '',
  issueDate: '',
  expiryDate: '',
  credentialId: '',
  credentialUrl: '',
  description: ''
};

const CertificateForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CertificateFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadCertificate(id);
    }
  }, [id]);

  const loadCertificate = async (certId: string) => {
    try {
      setLoading(true);
      const certificate = await certificateService.getCertificateById(certId);
      if (certificate) {
        setFormData({
          title: certificate.title,
          issuer: certificate.issuer,
          issueDate: certificate.issueDate.split('T')[0],
          expiryDate: certificate.expiryDate ? certificate.expiryDate.split('T')[0] : '',
          credentialId: certificate.credentialId,
          credentialUrl: certificate.credentialUrl || '',
          description: certificate.description
        });
      } else {
        setError('Sertifika bulunamadı');
        toast.error('Sertifika bulunamadı');
      }
    } catch (err) {
      setError('Sertifika yüklenirken bir hata oluştu');
      //console.error('Sertifika yükleme hatası:', err);
      toast.error('Sertifika yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (id) {
        await certificateService.updateCertificate(id, formData);
        toast.success('Sertifika başarıyla güncellendi');
      } else {
        await certificateService.addCertificate(formData);
        toast.success('Sertifika başarıyla eklendi');
      }
      navigate('/admin/certificates');
    } catch (err) {
      setError('Sertifika kaydedilirken bir hata oluştu');
      //console.error('Sertifika kaydetme hatası:', err);
      toast.error('Sertifika kaydedilirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading && id) {
    return <div className="p-4">Yükleniyor...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {id ? 'Sertifikayı Düzenle' : 'Yeni Sertifika Ekle'}
      </h2>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-500 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sertifika Adı
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Veren Kurum
          </label>
          <input
            type="text"
            name="issuer"
            value={formData.issuer}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Veriliş Tarihi
            </label>
            <input
              type="date"
              name="issueDate"
              value={formData.issueDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Geçerlilik Tarihi (Opsiyonel)
            </label>
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sertifika Kimlik No
          </label>
          <input
            type="text"
            name="credentialId"
            value={formData.credentialId}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Doğrulama URL (Opsiyonel)
          </label>
          <input
            type="url"
            name="credentialUrl"
            value={formData.credentialUrl}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
            placeholder="https://"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Açıklama
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
            required
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/admin/certificates')}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            İptal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Kaydediliyor...' : id ? 'Güncelle' : 'Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CertificateForm; 
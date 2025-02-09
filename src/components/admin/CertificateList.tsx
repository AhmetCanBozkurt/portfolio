import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Certificate, certificateService } from '../../services/certificateService';
import { FaEdit, FaTrash, FaPlus, FaExternalLinkAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

interface CertificateListProps {}

const CertificateList: React.FC<CertificateListProps> = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = async () => {
    try {
      const data = await certificateService.getAllCertificates();
      setCertificates(data);
      setError(null);
    } catch (err) {
      setError('Sertifikalar yüklenirken bir hata oluştu.');
      //console.error('Sertifika yükleme hatası:', err);
      toast.error('Sertifikalar yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Emin misiniz?',
      text: "Bu sertifika kalıcı olarak silinecektir!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Evet, sil!',
      cancelButtonText: 'İptal'
    });

    if (result.isConfirmed) {
      try {
        const success = await certificateService.deleteCertificate(id);
        if (success) {
          setCertificates(certificates.filter(cert => cert.id !== id));
          toast.success('Sertifika başarıyla silindi.');
          Swal.fire(
            'Silindi!',
            'Sertifika başarıyla silindi.',
            'success'
          );
        } else {
          setError('Sertifika silinirken bir hata oluştu.');
          toast.error('Sertifika silinirken bir hata oluştu.');
        }
      } catch (err) {
        setError('Sertifika silinirken bir hata oluştu.');
        //console.error('Sertifika silme hatası:', err);
        toast.error('Sertifika silinirken bir hata oluştu.');
      }
    }
  };

  if (loading) {
    return <div className="p-4">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Sertifikalar</h1>
        <Link
          to="/admin/certificates/new"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
        >
          <FaPlus className="mr-2" /> Yeni Sertifika
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[768px]">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sertifika
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Veren Kurum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tarih
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kimlik No
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {certificates.map((certificate) => (
                  <tr key={certificate.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{certificate.title}</div>
                      <div className="text-sm text-gray-500">{certificate.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {certificate.issuer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(certificate.issueDate).toLocaleDateString('tr-TR')}
                      {certificate.expiryDate && (
                        <span> - {new Date(certificate.expiryDate).toLocaleDateString('tr-TR')}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{certificate.credentialId}</div>
                      {certificate.credentialUrl && (
                        <a
                          href={certificate.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-700 text-sm flex items-center mt-1"
                        >
                          Doğrula <FaExternalLinkAlt className="ml-1" />
                        </a>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/admin/certificates/edit/${certificate.id}`}
                        className="text-blue-500 hover:text-blue-700 mr-4"
                      >
                        <FaEdit className="inline-block" />
                      </Link>
                      <button
                        onClick={() => handleDelete(certificate.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash className="inline-block" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateList; 
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { About, aboutService } from '../../services/aboutService';
import Swal from 'sweetalert2';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../services/firebaseConfig';

interface AboutFormData {
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
}

const initialFormData: AboutFormData = {
  title: '',
  content: '',
  skills: [],
  interests: [],
  socialLinks: {
    github: '',
    linkedin: '',
    twitter: '',
    instagram: ''
  },
  email: '',
  phone: '',
  location: '',
  profileImage: '',
  cvFile: ''
};

const AboutForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<AboutFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [skillInput, setSkillInput] = useState('');
  const [interestInput, setInterestInput] = useState('');
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [cvFileUpload, setCvFileUpload] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string>('');

  useEffect(() => {
    if (id) {
      loadAbout(id);
    }
  }, [id]);

  const loadAbout = async (aboutId: string) => {
    try {
      setLoading(true);
      const about = await aboutService.getAboutById(aboutId);
      if (about) {
        setFormData({
          title: about.title,
          content: about.content,
          skills: about.skills,
          interests: about.interests,
          socialLinks: about.socialLinks,
          email: about.email,
          phone: about.phone || '',
          location: about.location || '',
          profileImage: about.profileImage || '',
          cvFile: about.cvFile || ''
        });
      } else {
        setError('Hakkımda bilgisi bulunamadı');
        await Swal.fire({
          title: 'Hata!',
          text: 'Hakkımda bilgisi bulunamadı.',
          icon: 'error'
        });
      }
    } catch (err) {
      setError('Hakkımda bilgisi yüklenirken bir hata oluştu');
      ////console.error('Hakkımda bilgisi yükleme hatası:', err);
      await Swal.fire({
        title: 'Hata!',
        text: 'Hakkımda bilgisi yüklenirken bir hata oluştu.',
        icon: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File, path: string): Promise<string> => {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImageFile(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCVFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCvFileUpload(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let updatedFormData = { ...formData };

      // Profil resmi yükleme
      if (profileImageFile) {
        const imagePath = `profile-images/${Date.now()}-${profileImageFile.name}`;
        const imageUrl = await handleFileUpload(profileImageFile, imagePath);
        updatedFormData.profileImage = imageUrl;
      }

      // CV dosyası yükleme
      if (cvFileUpload) {
        const cvPath = `cv-files/${Date.now()}-${cvFileUpload.name}`;
        const cvUrl = await handleFileUpload(cvFileUpload, cvPath);
        updatedFormData.cvFile = cvUrl;
      }

      if (id) {
        await aboutService.updateAbout(id, updatedFormData);
        await Swal.fire({
          title: 'Başarılı!',
          text: 'Hakkımda bilgisi başarıyla güncellendi.',
          icon: 'success'
        });
      } else {
        await aboutService.addAbout(updatedFormData);
        await Swal.fire({
          title: 'Başarılı!',
          text: 'Hakkımda bilgisi başarıyla eklendi.',
          icon: 'success'
        });
      }
      navigate('/admin/about');
    } catch (err) {
      setError('Hakkımda bilgisi kaydedilirken bir hata oluştu');
      ////console.error('Hakkımda bilgisi kaydetme hatası:', err);
      await Swal.fire({
        title: 'Hata!',
        text: 'Hakkımda bilgisi kaydedilirken bir hata oluştu.',
        icon: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name.startsWith('socialLinks.')) {
      const socialNetwork = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialNetwork]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const handleRemoveSkill = async (skillToRemove: string) => {
    const result = await Swal.fire({
      title: 'Emin misiniz?',
      text: "Bu yetenek kaldırılacaktır!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Evet, kaldır!',
      cancelButtonText: 'İptal'
    });

    if (result.isConfirmed) {
      setFormData(prev => ({
        ...prev,
        skills: prev.skills.filter(skill => skill !== skillToRemove)
      }));
      await Swal.fire(
        'Kaldırıldı!',
        'Yetenek başarıyla kaldırıldı.',
        'success'
      );
    }
  };

  const handleAddInterest = () => {
    if (interestInput.trim() && !formData.interests.includes(interestInput.trim())) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, interestInput.trim()]
      }));
      setInterestInput('');
    }
  };

  const handleRemoveInterest = async (interestToRemove: string) => {
    const result = await Swal.fire({
      title: 'Emin misiniz?',
      text: "Bu ilgi alanı kaldırılacaktır!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Evet, kaldır!',
      cancelButtonText: 'İptal'
    });

    if (result.isConfirmed) {
      setFormData(prev => ({
        ...prev,
        interests: prev.interests.filter(interest => interest !== interestToRemove)
      }));
      await Swal.fire(
        'Kaldırıldı!',
        'İlgi alanı başarıyla kaldırıldı.',
        'success'
      );
    }
  };

  if (loading && id) {
    return <div className="p-4">Yükleniyor...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {id ? 'Hakkımda Bilgisini Düzenle' : 'Yeni Hakkımda Bilgisi'}
      </h2>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-500 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Başlık
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
            İçerik
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Yetenekler
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
              placeholder="Yetenek ekle"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Ekle
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.skills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-blue-100 text-blue-800"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            İlgi Alanları
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={interestInput}
              onChange={(e) => setInterestInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddInterest();
                }
              }}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
              placeholder="İlgi alanı ekle"
            />
            <button
              type="button"
              onClick={handleAddInterest}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Ekle
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.interests.map((interest, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-green-100 text-green-800"
              >
                {interest}
                <button
                  type="button"
                  onClick={() => handleRemoveInterest(interest)}
                  className="ml-2 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              GitHub
            </label>
            <input
              type="url"
              name="socialLinks.github"
              value={formData.socialLinks.github}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
              placeholder="https://github.com/username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              LinkedIn
            </label>
            <input
              type="url"
              name="socialLinks.linkedin"
              value={formData.socialLinks.linkedin}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
              placeholder="https://linkedin.com/in/username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Twitter
            </label>
            <input
              type="url"
              name="socialLinks.twitter"
              value={formData.socialLinks.twitter}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
              placeholder="https://twitter.com/username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instagram
            </label>
            <input
              type="url"
              name="socialLinks.instagram"
              value={formData.socialLinks.instagram}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
              placeholder="https://instagram.com/username"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            E-posta
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Telefon (Opsiyonel)
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Konum (Opsiyonel)
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profil Resmi
          </label>
          <div className="flex items-center space-x-4">
            {(profileImagePreview || formData.profileImage) && (
              <div className="w-24 h-24 rounded-full overflow-hidden">
                <img
                  src={profileImagePreview || formData.profileImage}
                  alt="Profil Önizleme"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleProfileImageChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-50 file:text-indigo-700
                hover:file:bg-indigo-100"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CV Dosyası
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleCVFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-50 file:text-indigo-700
                hover:file:bg-indigo-100"
            />
            {formData.cvFile && (
              <a
                href={formData.cvFile}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-800"
              >
                Mevcut CV'yi Görüntüle
              </a>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/admin/about')}
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

export default AboutForm; 
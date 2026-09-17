'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Business } from '@/types/business';
import { 
  Building2, 
  Star, 
  MapPin, 
  Instagram, 
  Globe, 
  Upload, 
  Palette, 
  Check, 
  ArrowLeft,
  Share2,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

interface BusinessFormProps {
  initialData?: Business;
  isEditing?: boolean;
}

// TikTok SVG icon
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.56a8.32 8.32 0 0 0 4.76 1.5v-3.4a4.83 4.83 0 0 1-1-.03z" />
    </svg>
  );
}

const slugify = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[əƏ]/g, 'e')
    .replace(/[öÖ]/g, 'o')
    .replace(/[üÜ]/g, 'u')
    .replace(/[çÇ]/g, 'c')
    .replace(/[şŞ]/g, 's')
    .replace(/[ğĞ]/g, 'g')
    .replace(/[ıİ]/g, 'i')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
};

const normalizeUrl = (url: string) => {
  if (!url || !url.trim()) return '';
  const trimmed = url.trim();
  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
};

export default function BusinessForm({ initialData, isEditing = false }: BusinessFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [error, setError] = useState('');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    logo: initialData?.logo || '',
    coverImage: initialData?.coverImage || '',
    description: initialData?.description || '',
    googleRating: initialData?.googleRating || 4.5,
    googleReviewUrl: initialData?.googleReviewUrl || '',
    googleMapsUrl: initialData?.googleMapsUrl || '',
    phone: initialData?.phone || '',
    whatsapp: initialData?.whatsapp || '',
    instagram: initialData?.instagram || '',
    tiktok: initialData?.tiktok || '',
    facebook: initialData?.facebook || '',
    website: initialData?.website || '',
    address: initialData?.address || '',
    brandColor: initialData?.brandColor || '#8B6F47',
    openingHours: initialData?.openingHours || {
      monday: '09:00 - 22:00',
      tuesday: '09:00 - 22:00',
      wednesday: '09:00 - 22:00',
      thursday: '09:00 - 22:00',
      friday: '09:00 - 23:00',
      saturday: '10:00 - 23:00',
      sunday: '10:00 - 21:00',
    },
  });

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: (!isEditing && !slugManuallyEdited) ? slugify(name) : prev.slug,
    }));
  };

  const handleFileUpload = (file: File, type: 'logo' | 'cover') => {
    if (type === 'logo') setUploadingLogo(true);
    else setUploadingCover(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = (e.target?.result as string) || '';
      if (type === 'logo') {
        setFormData((prev) => ({ ...prev, logo: dataUrl }));
        setUploadingLogo(false);
      } else {
        setFormData((prev) => ({ ...prev, coverImage: dataUrl }));
        setUploadingCover(false);
      }
    };
    reader.onerror = () => {
      alert('Şəkil oxunarkən xəta baş verdi.');
      if (type === 'logo') setUploadingLogo(false);
      else setUploadingCover(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const preparedData = {
        ...formData,
        name: formData.name.trim(),
        slug: (formData.slug || slugify(formData.name)).trim(),
        googleReviewUrl: normalizeUrl(formData.googleReviewUrl),
        googleMapsUrl: normalizeUrl(formData.googleMapsUrl),
      };

      const endpoint = isEditing && initialData
        ? `/api/businesses/${initialData.id}`
        : '/api/businesses';

      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preparedData),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Əməliyyat uğursuz oldu.');
      }

      router.push('/admin/businesses');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Xəta baş verdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl pb-16">
      {/* Top action bar */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/admin/businesses"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Bizneslərə qayıt
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          <Check className="h-4 w-4" />
          {loading ? 'Yadda saxlanılır...' : isEditing ? 'Dəyişiklikləri Saxla' : 'Biznesi Yarat'}
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 text-red-700 text-sm border border-red-200">
          {error}
        </div>
      )}

      {/* Section 1: Əsas Məlumatlar */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200/70 card-shadow space-y-6">
        <div className="border-b border-gray-100 pb-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-gray-500" />
            Əsas Məlumatlar
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Biznesin adı, təsviri, brend rəngi və logo/cover şəkilləri
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Biznesin Adı *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="məs. Coffee Rivermania"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Slug (URL ünvanı)
            </label>
            <div className="flex items-center rounded-xl border border-gray-200 px-3 py-2.5 bg-gray-50 text-sm focus-within:border-gray-900 focus-within:bg-white">
              <span className="text-gray-400 text-xs font-mono">/b/</span>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => {
                  setSlugManuallyEdited(true);
                  setFormData({ ...formData, slug: e.target.value });
                }}
                placeholder="coffee-rivermania (avtomatik)"
                className="w-full bg-transparent outline-none pl-1 text-sm text-gray-800"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
            Qısa Təsvir (Sloqan)
          </label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="məs. Qəhvə, desert və rahat atmosfer"
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Palette className="h-4 w-4 text-gray-400" />
              Brend Rəngi (Hex)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={formData.brandColor}
                onChange={(e) => setFormData({ ...formData, brandColor: e.target.value })}
                className="h-10 w-12 rounded-lg cursor-pointer border border-gray-200 p-1"
              />
              <input
                type="text"
                value={formData.brandColor}
                onChange={(e) => setFormData({ ...formData, brandColor: e.target.value })}
                className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm font-mono outline-none focus:border-gray-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
              Google Reytinqi
            </label>
            <input
              type="number"
              step="0.1"
              min="1"
              max="5"
              value={formData.googleRating}
              onChange={(e) => setFormData({ ...formData, googleRating: parseFloat(e.target.value) || 0 })}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            />
          </div>
        </div>

        {/* Media Uploads */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          {/* Logo Upload */}
          <div className="p-4 rounded-xl border border-dashed border-gray-300 bg-gray-50/50 space-y-3">
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Loqo (Logo)
            </label>
            <div className="flex items-center gap-4">
              {formData.logo ? (
                <img src={formData.logo} alt="Logo" className="h-12 w-12 rounded-xl object-cover border border-gray-200" />
              ) : (
                <div className="h-12 w-12 rounded-xl bg-gray-200 flex items-center justify-center text-gray-400">
                  <Upload className="h-5 w-5" />
                </div>
              )}
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'logo')}
                  className="text-xs text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-gray-900 file:text-white hover:file:bg-gray-800 cursor-pointer"
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  {uploadingLogo ? 'Yüklənir...' : 'PNG, SVG, JPG'}
                </p>
              </div>
            </div>
          </div>

          {/* Cover Upload */}
          <div className="p-4 rounded-xl border border-dashed border-gray-300 bg-gray-50/50 space-y-3">
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Üz Qabığı Şəkli (Cover)
            </label>
            <div className="flex items-center gap-4">
              {formData.coverImage ? (
                <img src={formData.coverImage} alt="Cover" className="h-12 w-16 rounded-xl object-cover border border-gray-200" />
              ) : (
                <div className="h-12 w-16 rounded-xl bg-gray-200 flex items-center justify-center text-gray-400">
                  <Upload className="h-5 w-5" />
                </div>
              )}
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'cover')}
                  className="text-xs text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-gray-900 file:text-white hover:file:bg-gray-800 cursor-pointer"
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  {uploadingCover ? 'Yüklənir...' : 'Banner şəkli'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Əsas CTA - Google Rəy & Ünvan */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200/70 card-shadow space-y-6">
        <div className="border-b border-gray-100 pb-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-500" />
            Əsas CTA (Google Rəy) və Ünvan
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Müştərinin &quot;5 Ulduzlu Rəy Yaz&quot; düyməsinə toxunduqda açılacaq birbaşa Google rəy linki
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
            Google Rəy URL-i (googleReviewUrl) *
          </label>
          <input
            type="text"
            value={formData.googleReviewUrl}
            onChange={(e) => setFormData({ ...formData, googleReviewUrl: e.target.value })}
            placeholder="https://search.google.com/local/writereview?placeid=..."
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
          />
          <p className="text-[11px] text-gray-400 mt-1.5">
            Biznesin Google Biznes profilindən &quot;Rəy istəyin&quot; linkini bura daxil edin.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-blue-500" />
              Ünvan
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="məs. Heydər Əliyev prospekti, Mingəçevir"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Globe className="h-4 w-4 text-indigo-500" />
              Google Maps İstiqamət Linki
            </label>
            <input
              type="text"
              value={formData.googleMapsUrl}
              onChange={(e) => setFormData({ ...formData, googleMapsUrl: e.target.value })}
              placeholder="https://maps.google.com/?q=..."
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            />
          </div>
        </div>
      </div>

      {/* Section 3: Sosial Şəbəkələr (Instagram & TikTok) */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200/70 card-shadow space-y-6">
        <div className="border-b border-gray-100 pb-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Share2 className="h-5 w-5 text-indigo-500" />
            Sosial Şəbəkələr (Instagram & TikTok)
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Müştəri profilində göstəriləcək sosial media hesabları
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Instagram className="h-4 w-4 text-pink-600" />
              Instagram İstifadəçi Adı
            </label>
            <div className="flex items-center rounded-xl border border-gray-200 px-3 py-2.5 bg-gray-50 text-sm focus-within:border-gray-900 focus-within:bg-white">
              <span className="text-gray-400 text-xs font-mono">@</span>
              <input
                type="text"
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value.replace(/^@/, '') })}
                placeholder="coffeerivermania"
                className="w-full bg-transparent outline-none pl-1 text-sm text-gray-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <TikTokIcon className="h-4 w-4 text-gray-900" />
              TikTok İstifadəçi Adı
            </label>
            <div className="flex items-center rounded-xl border border-gray-200 px-3 py-2.5 bg-gray-50 text-sm focus-within:border-gray-900 focus-within:bg-white">
              <span className="text-gray-400 text-xs font-mono">@</span>
              <input
                type="text"
                value={formData.tiktok}
                onChange={(e) => setFormData({ ...formData, tiktok: e.target.value.replace(/^@/, '') })}
                placeholder="coffeerivermania"
                className="w-full bg-transparent outline-none pl-1 text-sm text-gray-800"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom submit button */}
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-8 py-3 rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          <Check className="h-4 w-4" />
          {loading ? 'Yadda saxlanılır...' : isEditing ? 'Dəyişiklikləri Saxla' : 'Biznesi Yarat'}
        </button>
      </div>
    </form>
  );
}

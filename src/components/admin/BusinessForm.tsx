'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Business } from '@/types/business';
import { 
  Building2, 
  Star, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Instagram, 
  Globe, 
  Clock, 
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

export default function BusinessForm({ initialData, isEditing = false }: BusinessFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [error, setError] = useState('');

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

  const handleFileUpload = async (file: File, type: 'logo' | 'cover') => {
    try {
      if (type === 'logo') setUploadingLogo(true);
      else setUploadingCover(true);

      const data = new FormData();
      data.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });

      if (!res.ok) {
        throw new Error('Şəkil yüklənərkən xəta baş verdi.');
      }

      const result = await res.json();
      if (type === 'logo') {
        setFormData((prev) => ({ ...prev, logo: result.url }));
      } else {
        setFormData((prev) => ({ ...prev, coverImage: result.url }));
      }
    } catch (err: any) {
      alert(err.message || 'Xəta baş verdi');
    } finally {
      if (type === 'logo') setUploadingLogo(false);
      else setUploadingCover(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isEditing && initialData
        ? `/api/businesses/${initialData.id}`
        : '/api/businesses';

      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
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
          className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-50"
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
            Biznesin adı, təsviri, brend rəngi və link formatı
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
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
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
                  {uploadingLogo ? 'Yüklənir...' : 'PNG, SVG, JPG (maks. 5MB)'}
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
                  {uploadingCover ? 'Yüklənir...' : 'Banner şəkli (1200x630 tövsiyə edilir)'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Əsas CTA - Google Rəy & Xəritə */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200/70 card-shadow space-y-6">
        <div className="border-b border-gray-100 pb-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-500" />
            Əsas CTA (Google Rəy) və Xəritə
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Müştərinin &quot;Rəy Yaz&quot; düyməsinə toxunduqda açılacaq birbaşa Google rəy linki
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
            Google Rəy URL-i (googleReviewUrl) *
          </label>
          <input
            type="url"
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
              type="url"
              value={formData.googleMapsUrl}
              onChange={(e) => setFormData({ ...formData, googleMapsUrl: e.target.value })}
              placeholder="https://maps.google.com/?q=..."
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            />
          </div>
        </div>
      </div>

      {/* Section 3: Əlaqə və Sosial Şəbəkələr */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200/70 card-shadow space-y-6">
        <div className="border-b border-gray-100 pb-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Share2 className="h-5 w-5 text-indigo-500" />
            Əlaqə və Sosial Şəbəkələr
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Yalnız doldurulan sahələr müştəri profilində göstəriləcək.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Phone className="h-4 w-4 text-green-600" />
              Telefon Nömrəsi
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+994555555555"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <MessageCircle className="h-4 w-4 text-emerald-600" />
              WhatsApp Nömrəsi
            </label>
            <input
              type="text"
              value={formData.whatsapp}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
              placeholder="+994555555555"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            />
          </div>

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
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
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

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Facebook Səhifəsi / ID
            </label>
            <input
              type="text"
              value={formData.facebook}
              onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
              placeholder="coffeerivermania"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Globe className="h-4 w-4 text-blue-600" />
              Vebsayt
            </label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              placeholder="https://coffeerivermania.az"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            />
          </div>
        </div>
      </div>

      {/* Section 4: İş Saatları */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200/70 card-shadow space-y-6">
        <div className="border-b border-gray-100 pb-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-500" />
            İş Saatları
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Hər gün üçün açılış və bağlanış saatları (Boş buraxılan günlər göstərilməyəcək)
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { key: 'monday', label: 'Bazar ertəsi' },
            { key: 'tuesday', label: 'Çərşənbə axşamı' },
            { key: 'wednesday', label: 'Çərşənbə' },
            { key: 'thursday', label: 'Cümə axşamı' },
            { key: 'friday', label: 'Cümə' },
            { key: 'saturday', label: 'Şənbə' },
            { key: 'sunday', label: 'Bazar' },
          ].map((day) => (
            <div key={day.key} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
              <span className="text-xs font-semibold text-gray-700 w-32">{day.label}</span>
              <input
                type="text"
                value={(formData.openingHours as any)[day.key] || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    openingHours: {
                      ...formData.openingHours,
                      [day.key]: e.target.value,
                    },
                  })
                }
                placeholder="09:00 - 22:00"
                className="w-full bg-white rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-right outline-none focus:border-gray-900"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom submit button */}
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-8 py-3 rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50"
        >
          <Check className="h-4 w-4" />
          {loading ? 'Yadda saxlanılır...' : isEditing ? 'Dəyişiklikləri Saxla' : 'Biznesi Yarat'}
        </button>
      </div>
    </form>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Business, BusinessStats } from '@/types/business';
import { 
  Store, 
  Plus, 
  Search, 
  ExternalLink, 
  Edit3, 
  Trash2, 
  QrCode, 
  Copy, 
  Check, 
  BarChart2,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export default function BusinessesPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [statsMap, setStatsMap] = useState<Record<string, BusinessStats>>({});
  const [search, setSearch] = useState('');
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/businesses');
      if (res.ok) {
        const data: Business[] = await res.json();
        setBusinesses(data);

        // Fetch stats for each
        const statsObj: Record<string, BusinessStats> = {};
        for (const b of data) {
          const sRes = await fetch(`/api/analytics?businessId=${b.id}`);
          if (sRes.ok) {
            const sData = await sRes.json();
            statsObj[b.id] = sData;
          }
        }
        setStatsMap(statsObj);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const handleCopyLink = (slug: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const fullUrl = `${origin}/b/${slug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2500);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/businesses/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setBusinesses((prev) => prev.filter((b) => b.id !== id));
        setDeleteConfirmId(null);
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const filteredBusinesses = businesses.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.slug.toLowerCase().includes(search.toLowerCase()) ||
    b.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pt-12 lg:pt-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Bizneslərin İdarə Edilməsi
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Qeydiyyatdan keçmiş bütün biznes profillərinin siyahısı və tənzimləmələri.
          </p>
        </div>
        <Link
          href="/admin/businesses/new"
          className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm active:scale-95 shrink-0"
        >
          <Plus className="h-4 w-4" />
          Yeni Biznes Əlavə Et
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/70 card-shadow flex items-center gap-3">
        <Search className="h-5 w-5 text-gray-400 shrink-0 ml-1" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Biznes adı, şəhər və ya slug ilə axtarış..."
          className="w-full text-sm outline-none bg-transparent placeholder:text-gray-400"
        />
      </div>

      {/* Businesses Table */}
      <div className="bg-white rounded-2xl border border-gray-200/70 overflow-hidden card-shadow">
        {loading ? (
          <div className="p-12 text-center text-sm text-gray-400 font-medium">
            Bizneslər yüklənir...
          </div>
        ) : filteredBusinesses.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Store className="h-10 w-10 text-gray-300 mx-auto" />
            <p className="text-gray-500 text-sm font-medium">Heç bir biznes tapılmadı.</p>
            <Link
              href="/admin/businesses/new"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              <Plus className="h-3.5 w-3.5" />
              İlk biznesinizi yaradın
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50/80 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                <tr>
                  <th className="py-3.5 px-5">Biznes</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-center">Baxış</th>
                  <th className="py-3.5 px-4 text-center">Google Rəy</th>
                  <th className="py-3.5 px-4 text-center">Sosial Keçid</th>
                  <th className="py-3.5 px-4">Tarix</th>
                  <th className="py-3.5 px-5 text-right">Əməliyyatlar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {filteredBusinesses.map((b) => {
                  const s = statsMap[b.id];
                  const socialClicks = (s?.instagramClicks || 0) + (s?.tiktokClicks || 0) + (s?.whatsappClicks || 0) + (s?.phoneClicks || 0);

                  return (
                    <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div 
                            className="h-10 w-10 rounded-xl flex items-center justify-center font-bold text-white text-sm shrink-0 shadow-xs"
                            style={{ backgroundColor: b.brandColor || '#111827' }}
                          >
                            {b.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{b.name}</div>
                            <div className="text-xs text-gray-400">/b/{b.slug}</div>
                            {b.address && (
                              <div className="text-[11px] text-gray-400 mt-0.5">{b.address}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                          Aktiv
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="font-bold text-gray-900">{s?.totalViews || 0}</span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="font-bold text-amber-600">{s?.reviewClicks || 0}</span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="font-bold text-blue-600">{socialClicks}</span>
                      </td>
                      <td className="py-4 px-4 text-xs text-gray-400">
                        {new Date(b.createdAt).toLocaleDateString('az-AZ')}
                      </td>
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Copy NFC Link */}
                          <button
                            onClick={() => handleCopyLink(b.slug)}
                            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                            title="NFC Linkini Kopyala"
                          >
                            {copiedSlug === b.slug ? (
                              <Check className="h-4 w-4 text-emerald-600" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </button>

                          {/* QR Code Page */}
                          <Link
                            href={`/admin/qr-codes?slug=${b.slug}`}
                            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                            title="QR Kodu Gör və Yüklə"
                          >
                            <QrCode className="h-4 w-4" />
                          </Link>

                          {/* View Live */}
                          <Link
                            href={`/b/${b.slug}`}
                            target="_blank"
                            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Canlı Profili Aç"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Link>

                          {/* Edit */}
                          <Link
                            href={`/admin/businesses/${b.id}/edit`}
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Düzəliş et"
                          >
                            <Edit3 className="h-4 w-4" />
                          </Link>

                          {/* Delete */}
                          <button
                            onClick={() => setDeleteConfirmId(b.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Sil"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full card-shadow-xl space-y-4">
            <div className="h-12 w-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-gray-900 text-lg">Biznesi silmək istəyirsiniz?</h3>
              <p className="text-xs text-gray-500 mt-1">
                Bu əməliyyat geri qaytarıla bilməz. Bütün profil məlumatları və NFC yönləndirməsi silinəcək.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                İmtina
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
              >
                Bəli, Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

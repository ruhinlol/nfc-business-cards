import { getAllBusinesses, getOverallStats, getAllAnalytics } from '@/lib/data';
import Link from 'next/link';
import { 
  Store, 
  Eye, 
  Star, 
  TrendingUp, 
  Plus, 
  ArrowUpRight,
  Sparkles,
  Smartphone,
  QrCode,
  Share2
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const businesses = await getAllBusinesses();
  const stats = await getOverallStats();
  const allEvents = await getAllAnalytics();

  const recentEvents = [...allEvents].reverse().slice(0, 6);

  const eventTypeLabels: Record<string, { label: string; color: string }> = {
    page_view: { label: 'Səhifə baxışı (NFC / QR)', color: 'bg-blue-100 text-blue-800' },
    review_click: { label: 'Google Rəy klikləndi', color: 'bg-amber-100 text-amber-800' },
    instagram_click: { label: 'Instagram keçidi', color: 'bg-pink-100 text-pink-800' },
    tiktok_click: { label: 'TikTok keçidi', color: 'bg-gray-100 text-gray-800' },
    whatsapp_click: { label: 'WhatsApp mesajı', color: 'bg-emerald-100 text-emerald-800' },
    phone_click: { label: 'Zəng edildi', color: 'bg-green-100 text-green-800' },
    directions_click: { label: 'Yol xəritəsi açıldı', color: 'bg-indigo-100 text-indigo-800' },
    facebook_click: { label: 'Facebook keçidi', color: 'bg-blue-100 text-blue-800' },
    website_click: { label: 'Vebsayt keçidi', color: 'bg-purple-100 text-purple-800' },
  };

  return (
    <div className="space-y-8 pt-12 lg:pt-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Xoş gəlmisiniz 👋
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            NFC və QR kartlarınızın canlı baxış statistikaları və biznes idarəetməsi.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/businesses/new"
            className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm active:scale-95"
          >
            <Plus className="h-4 w-4" />
            Yeni Biznes Əlavə Et
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Businesses */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200/70 card-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Aktiv Bizneslər</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Store className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-gray-900">{stats.totalBusinesses}</div>
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1 font-medium">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              Sistemdə qeydiyyatda
            </p>
          </div>
        </div>

        {/* Total Views */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200/70 card-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Ümumi Baxışlar</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Eye className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-gray-900">{stats.totalViews}</div>
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <Smartphone className="h-3.5 w-3.5 text-indigo-500" />
              NFC toxunuşu və QR skan
            </p>
          </div>
        </div>

        {/* Review Clicks */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200/70 card-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Google Rəy Klikləri</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Star className="h-5 w-5 fill-amber-400" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-gray-900">{stats.reviewClicks}</div>
            <p className="text-xs text-amber-600 mt-1 font-semibold">
              Rəy səhifəsinə yönləndirmə
            </p>
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200/70 card-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Rəy Konversiyası</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-emerald-600">
              %{stats.conversionRate.toFixed(1)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Baxışdan Google rəyinə keçid faizi
            </p>
          </div>
        </div>
      </div>

      {/* Quick Action Banner */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white rounded-2xl p-6 sm:p-8 card-shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            Satış və Təqdimat Üçün Hazır
          </span>
          <h2 className="text-xl sm:text-2xl font-bold">NFC və QR ilə Google Rəylərini Artırın</h2>
          <p className="text-gray-300 text-sm mt-2 leading-relaxed">
            Müştərilər NFC kartına toxunaraq birbaşa zərif biznes profilinə daxil olur və 5 ulduzlu Google rəyi yazmağa həvəslənir.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              href="/b/coffee-rivermania"
              target="_blank"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-gray-900 font-semibold px-4 py-2 rounded-xl text-sm transition-all"
            >
              Demo Profili Sınaqdan Keçir
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              href="/admin/qr-codes"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium px-4 py-2 rounded-xl text-sm transition-all"
            >
              <QrCode className="h-4 w-4" />
              QR Kodları Yüklə
            </Link>
          </div>
        </div>
      </div>

      {/* Grid: Businesses Table & Recent Live Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Businesses List (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200/70 p-6 card-shadow">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Bizneslər</h3>
              <p className="text-xs text-gray-500">Mövcud profillər və qısa statistika</p>
            </div>
            <Link 
              href="/admin/businesses"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Hamısına bax
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-gray-100">
            {businesses.map((b) => (
              <div key={b.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div 
                    className="h-10 w-10 rounded-xl flex items-center justify-center font-bold text-white text-sm shrink-0"
                    style={{ backgroundColor: b.brandColor || '#111827' }}
                  >
                    {b.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{b.name}</p>
                    <p className="text-xs text-gray-400 truncate">/b/{b.slug}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/b/${b.slug}`}
                    target="_blank"
                    className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Profili Gör"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href={`/admin/businesses/${b.id}/edit`}
                    className="text-xs font-semibold px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors"
                  >
                    Düzəliş et
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Activity (1 Col) */}
        <div className="bg-white rounded-2xl border border-gray-200/70 p-6 card-shadow">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Son Hərəkətlər</h3>
              <p className="text-xs text-gray-500">Canlı ziyarətçi reaksiyaları</p>
            </div>
            <Share2 className="h-4 w-4 text-gray-400" />
          </div>

          {recentEvents.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-xs">
              Hələlik ziyarətçi qeydə alınmayıb.
            </div>
          ) : (
            <div className="space-y-3">
              {recentEvents.map((evt) => {
                const b = businesses.find((item) => item.id === evt.businessId);
                const info = eventTypeLabels[evt.eventType] || { label: evt.eventType, color: 'bg-gray-100 text-gray-800' };
                const timeFormatted = new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                return (
                  <div key={evt.id} className="p-2.5 rounded-xl bg-gray-50/70 border border-gray-100 flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${info.color}`}>
                          {info.label}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-gray-700 mt-1 truncate">
                        {b ? b.name : 'Naməlum biznes'}
                      </p>
                    </div>
                    <span className="text-[10px] text-gray-400 font-medium shrink-0">
                      {timeFormatted}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

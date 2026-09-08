'use client';

import { useState, useEffect } from 'react';
import { Business, BusinessStats } from '@/types/business';
import { 
  BarChart3, 
  Eye, 
  Star, 
  TrendingUp, 
  Instagram, 
  MessageCircle, 
  Phone, 
  MapPin, 
  Globe,
  Sparkles,
  Smartphone
} from 'lucide-react';

export default function AnalyticsPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>('all');
  const [stats, setStats] = useState<BusinessStats>({
    totalViews: 0,
    reviewClicks: 0,
    instagramClicks: 0,
    tiktokClicks: 0,
    whatsappClicks: 0,
    phoneClicks: 0,
    directionsClicks: 0,
    facebookClicks: 0,
    websiteClicks: 0,
    conversionRate: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInit = async () => {
      try {
        const bRes = await fetch('/api/businesses');
        if (bRes.ok) {
          const bData = await bRes.json();
          setBusinesses(bData);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchInit();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const url = selectedBusinessId === 'all'
          ? '/api/analytics/stats'
          : `/api/analytics/stats?businessId=${selectedBusinessId}`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [selectedBusinessId]);

  const totalInteractions = 
    stats.reviewClicks +
    stats.instagramClicks +
    stats.tiktokClicks +
    stats.whatsappClicks +
    stats.phoneClicks +
    stats.directionsClicks +
    stats.facebookClicks +
    stats.websiteClicks;

  const interactionRate = stats.totalViews > 0 
    ? (totalInteractions / stats.totalViews) * 100 
    : 0;

  const clickBreakdown = [
    { label: 'Google Rəy', count: stats.reviewClicks, icon: Star, color: 'text-amber-500 bg-amber-50', barColor: 'bg-amber-500' },
    { label: 'Instagram', count: stats.instagramClicks, icon: Instagram, color: 'text-pink-600 bg-pink-50', barColor: 'bg-pink-500' },
    { label: 'WhatsApp', count: stats.whatsappClicks, icon: MessageCircle, color: 'text-emerald-600 bg-emerald-50', barColor: 'bg-emerald-500' },
    { label: 'Telefon Zəngi', count: stats.phoneClicks, icon: Phone, color: 'text-green-600 bg-green-50', barColor: 'bg-green-500' },
    { label: 'Google Maps (Yol tarifi)', count: stats.directionsClicks, icon: MapPin, color: 'text-blue-600 bg-blue-50', barColor: 'bg-blue-500' },
    { label: 'Vebsayt', count: stats.websiteClicks, icon: Globe, color: 'text-purple-600 bg-purple-50', barColor: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-8 pt-12 lg:pt-0">
      {/* Header with Business Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Analitika və Konversiya
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            NFC kart toxunuşları, Google rəyləri və sosial media kliklərinin ətraflı statistikası.
          </p>
        </div>

        {/* Filter dropdown */}
        <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-gray-200/80 card-shadow">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider pl-2">Biznes:</label>
          <select
            value={selectedBusinessId}
            onChange={(e) => setSelectedBusinessId(e.target.value)}
            className="text-sm font-semibold text-gray-800 bg-transparent outline-none cursor-pointer pr-2"
          >
            <option value="all">Bütün Bizneslər (Cəmi)</option>
            {businesses.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Views */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200/70 card-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Səhifə Baxışları</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Eye className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-gray-900">{stats.totalViews}</div>
            <p className="text-xs text-gray-500 mt-1">
              NFC kart toxunuşu və QR skan
            </p>
          </div>
        </div>

        {/* Google Review Clicks */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200/70 card-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Google Rəy Klikləri</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Star className="h-5 w-5 fill-amber-400" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-gray-900">{stats.reviewClicks}</div>
            <p className="text-xs text-amber-600 font-semibold mt-1">
              Əsas Hədəf (Google Reviews)
            </p>
          </div>
        </div>

        {/* Review Conversion Rate */}
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
              (Rəy Klikləri / Baxışlar) × 100
            </p>
          </div>
        </div>

        {/* Total Interactions */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200/70 card-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Ümumi Hərəkət</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <Sparkles className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-gray-900">{totalInteractions}</div>
            <p className="text-xs text-gray-500 mt-1">
              Cəmi qarşılıqlı əlaqə sayı
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Click Breakdown Card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200/70 card-shadow space-y-6">
        <div className="border-b border-gray-100 pb-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-gray-700" />
            Keçidlərin və Düymələrin Bölgüsü
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Ziyarətçilərin ən çox hansı xidmətlərə və sosial şəbəkələrə kliklədiyini izləyin
          </p>
        </div>

        <div className="space-y-4">
          {clickBreakdown.map((item) => {
            const percentage = totalInteractions > 0 
              ? ((item.count / totalInteractions) * 100).toFixed(1) 
              : '0';

            return (
              <div key={item.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-1.5 rounded-lg ${item.color}`}>
                      <item.icon className="h-4 w-4" />
                    </div>
                    <span className="font-semibold text-gray-800">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-gray-900">{item.count} klik</span>
                    <span className="text-xs text-gray-400 font-mono w-12 text-right">%{percentage}</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${item.barColor}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

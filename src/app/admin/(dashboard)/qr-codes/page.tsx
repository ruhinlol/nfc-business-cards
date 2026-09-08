'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Business } from '@/types/business';
import { QRCodeSVG } from 'qrcode.react';
import { 
  QrCode, 
  Download, 
  Copy, 
  Check, 
  ExternalLink, 
  Smartphone, 
  Sparkles,
  Info,
  CheckCircle2
} from 'lucide-react';

function QRCodesContent() {
  const searchParams = useSearchParams();
  const initialSlug = searchParams.get('slug');

  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchBiz = async () => {
      try {
        const res = await fetch('/api/businesses');
        if (res.ok) {
          const data: Business[] = await res.json();
          setBusinesses(data);
          if (initialSlug && data.some((b) => b.slug === initialSlug)) {
            setSelectedSlug(initialSlug);
          } else if (data.length > 0) {
            setSelectedSlug(data[0].slug);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchBiz();
  }, [initialSlug]);

  const selectedBusiness = businesses.find((b) => b.slug === selectedSlug);
  const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
  const targetUrl = selectedSlug ? `${origin}/b/${selectedSlug}` : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(targetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    if (!qrRef.current) return;
    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    canvas.width = 1000;
    canvas.height = 1000;

    img.onload = () => {
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 100, 100, 800, 800);
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `qr-${selectedSlug || 'nfc-business'}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      }
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="space-y-8 pt-12 lg:pt-0">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          QR Kod və NFC Kart Linkləri
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          NFC kart çipinə yazılacaq URL və çap üçün yüksək keyfiyyətli QR kod generatoru.
        </p>
      </div>

      {/* Info notice about NFC Core Concept */}
      <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/70 text-amber-900 flex items-start gap-3.5">
        <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm leading-relaxed">
          <span className="font-bold">Önəmli Qayda:</span> NFC kart birbaşa Google rəy linkini açmamalıdır. 
          NFC toxunuşu və QR skan ilk olaraq zərif <strong>Biznes Profilini</strong> açır. 
          Müştəri oradan həm Google rəyinə, həm də Instagram, TikTok, WhatsApp və digər xidmətlərə keçid edir.
        </div>
      </div>

      {/* Business Selector & Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: QR Preview & Download */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200/70 p-6 sm:p-8 card-shadow space-y-6">
          {/* Select dropdown */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Biznes Seçin
            </label>
            <select
              value={selectedSlug}
              onChange={(e) => setSelectedSlug(e.target.value)}
              className="w-full rounded-xl border border-gray-200 p-3 text-sm font-semibold text-gray-800 bg-gray-50/50 outline-none focus:border-gray-900 focus:bg-white transition-all cursor-pointer"
            >
              {businesses.map((b) => (
                <option key={b.id} value={b.slug}>
                  {b.name} ({b.address || 'Ünvansız'})
                </option>
              ))}
            </select>
          </div>

          {/* URL Box */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              NFC Kart və QR Üçün Link
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono text-gray-700 truncate">
                {targetUrl}
              </div>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold px-4 py-3 rounded-xl transition-all shadow-sm active:scale-95 shrink-0"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Kopyalandı!' : 'Kopyala'}
              </button>
            </div>
          </div>

          {/* QR Code Canvas Display */}
          <div className="pt-4 flex flex-col sm:flex-row items-center gap-8 justify-center sm:justify-start">
            <div 
              ref={qrRef}
              className="p-6 bg-white rounded-3xl border-2 border-gray-100 card-shadow-lg flex items-center justify-center"
            >
              {targetUrl && (
                <QRCodeSVG
                  value={targetUrl}
                  size={220}
                  level="H"
                  marginSize={2}
                  fgColor={selectedBusiness?.brandColor || '#111827'}
                />
              )}
            </div>

            <div className="space-y-3 text-center sm:text-left">
              <h3 className="font-bold text-gray-900 text-base">Yüksək Keyfiyyətli Çap Üçün</h3>
              <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
                Bu QR kod masaüstü stendlər, vizit kartları, stikerlər və menyular üçün 1000x1000 px formatında yüklənir.
              </p>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={handleDownloadQR}
                  className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold text-sm px-5 py-3 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
                >
                  <Download className="h-4 w-4" />
                  QR Kodu Yüklə (PNG)
                </button>

                <a
                  href={targetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 text-xs font-semibold text-gray-600 hover:text-gray-900 py-2"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Brauzerdə səhifəni yoxla
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: NFC Card Explanation */}
        <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white rounded-2xl p-6 sm:p-8 card-shadow-xl flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase tracking-wider">
              <Smartphone className="h-4 w-4" />
              NFC Kart Proqramlaşdırma
            </div>
            <h3 className="text-xl font-bold">NFC Çipinə Yazılma Qaydası</h3>
            <p className="text-gray-300 text-xs leading-relaxed">
              NFC kartlarınızı proqramlaşdırarkən (məsələn, <strong>NFC Tools</strong> mobil tətbiqi ilə) 
              sadəcə <strong>Custom URL</strong> seçib aşağıdakı linki daxil edin:
            </p>

            <div className="bg-white/10 rounded-xl p-3 text-xs font-mono text-amber-300 break-all border border-white/10">
              {targetUrl}
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex items-start gap-2 text-xs text-gray-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Bütün iPhone və Android telefonları ilə uyğundur.</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-gray-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Heç bir əlavə mobil tətbiq quraşdırmağa ehtiyac yoxdur.</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-gray-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Google rəy linki dəyişsə belə NFC kartı yenidən dəyişməyə ehtiyac qalmır.</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
            <span className="text-[11px] text-gray-400 block font-medium">NFC Çip Tipi</span>
            <span className="text-sm font-bold text-amber-300">NTAG213 / NTAG215 / NTAG216</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function QRCodesPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-gray-400">Yüklənir...</div>}>
      <QRCodesContent />
    </Suspense>
  );
}

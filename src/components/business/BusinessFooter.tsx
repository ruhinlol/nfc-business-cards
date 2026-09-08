'use client';

import { Business } from '@/types/business';
import { MapPin } from 'lucide-react';

interface BusinessFooterProps {
  business: Business;
}

export default function BusinessFooter({ business }: BusinessFooterProps) {
  return (
    <footer className="px-5 pb-8 animate-fade-in-up delay-600" style={{ opacity: 0 }}>
      {/* Address */}
      {business.address && (
        <div className="flex items-start gap-2 text-center justify-center mb-6">
          <MapPin className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
          <p className="text-sm text-gray-500">{business.address}</p>
        </div>
      )}

      {/* Powered by */}
      <div className="text-center border-t border-gray-100 pt-6">
        <p className="text-xs text-gray-400">
          Powered by{' '}
          <span className="font-semibold text-gray-500">NFC Profil</span>
        </p>
        <p className="text-xs text-gray-300 mt-1">
          Rəqəmsal biznes kartı
        </p>
      </div>
    </footer>
  );
}

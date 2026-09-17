'use client';

import { Business } from '@/types/business';

interface BusinessFooterProps {
  business: Business;
}

export default function BusinessFooter({ business }: BusinessFooterProps) {
  return (
    <footer className="px-5 pt-3 pb-5 text-center">
      <p className="text-[11px] text-gray-400 font-medium">
        Powered by{' '}
        <span className="font-bold text-gray-600">NFC Profil</span>
      </p>
    </footer>
  );
}

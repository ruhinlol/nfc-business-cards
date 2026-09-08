'use client';

import { Business } from '@/types/business';
import { Phone, MessageCircle, MapPin, Globe } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';
import { AnalyticsEvent } from '@/types/business';

interface ContactActionsProps {
  business: Business;
}

interface ContactAction {
  type: string;
  icon: React.ReactNode;
  label: string;
  subtitle: string;
  url: string;
  eventType: AnalyticsEvent['eventType'];
  color: string;
}

export default function ContactActions({ business }: ContactActionsProps) {
  const actions: ContactAction[] = [];

  if (business.phone) {
    actions.push({
      type: 'phone',
      icon: <Phone className="h-5 w-5" />,
      label: 'Zəng et',
      subtitle: business.phone.replace(/(\+994)(\d{2})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5'),
      url: `tel:${business.phone}`,
      eventType: 'phone_click',
      color: 'text-green-600 bg-green-50',
    });
  }

  if (business.whatsapp) {
    actions.push({
      type: 'whatsapp',
      icon: <MessageCircle className="h-5 w-5" />,
      label: 'WhatsApp',
      subtitle: 'Bizimlə əlaqə saxlayın',
      url: `https://wa.me/${business.whatsapp.replace(/\+/g, '')}`,
      eventType: 'whatsapp_click',
      color: 'text-emerald-600 bg-emerald-50',
    });
  }

  if (business.googleMapsUrl) {
    actions.push({
      type: 'directions',
      icon: <MapPin className="h-5 w-5" />,
      label: 'Yol tarifi',
      subtitle: 'Google Maps-də aç',
      url: business.googleMapsUrl,
      eventType: 'directions_click',
      color: 'text-blue-600 bg-blue-50',
    });
  }

  if (business.website) {
    actions.push({
      type: 'website',
      icon: <Globe className="h-5 w-5" />,
      label: 'Vebsayt',
      subtitle: business.website.replace(/^https?:\/\//, ''),
      url: business.website,
      eventType: 'website_click',
      color: 'text-violet-600 bg-violet-50',
    });
  }

  if (actions.length === 0) return null;

  return (
    <section className="px-5 animate-fade-in-up delay-400" style={{ opacity: 0 }}>
      <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
        Əlaqə
      </h2>
      <div className="space-y-2.5">
        {actions.map((action) => (
          <a
            key={action.type}
            href={action.url}
            target={action.type === 'phone' ? '_self' : '_blank'}
            rel="noopener noreferrer"
            onClick={() => trackEvent(business.id, action.eventType)}
            className="flex items-center gap-4 rounded-xl bg-white p-4 card-shadow
                       border border-gray-100/80 transition-all duration-200
                       active:scale-[0.98] hover:shadow-md"
            id={`contact-${action.type}`}
          >
            <div className={`rounded-xl p-2.5 ${action.color}`}>
              {action.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800">{action.label}</p>
              <p className="text-xs text-gray-500 truncate">{action.subtitle}</p>
            </div>
            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        ))}
      </div>
    </section>
  );
}

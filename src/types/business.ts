export interface OpeningHours {
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
  sunday?: string;
}

export interface Business {
  id: string;
  name: string;
  slug: string;
  logo: string;
  coverImage: string;
  description: string;
  googleRating: number;
  googleReviewUrl: string;
  googleMapsUrl: string;
  phone: string;
  whatsapp: string;
  instagram: string;
  tiktok: string;
  facebook: string;
  website: string;
  address: string;
  openingHours: OpeningHours;
  brandColor: string;
  createdAt: string;
  updatedAt: string;
}

export interface AnalyticsEvent {
  id: string;
  businessId: string;
  eventType:
    | 'page_view'
    | 'review_click'
    | 'instagram_click'
    | 'tiktok_click'
    | 'whatsapp_click'
    | 'phone_click'
    | 'directions_click'
    | 'facebook_click'
    | 'website_click';
  timestamp: string;
  userAgent?: string;
  referrer?: string;
}

export interface BusinessStats {
  totalViews: number;
  reviewClicks: number;
  instagramClicks: number;
  tiktokClicks: number;
  whatsappClicks: number;
  phoneClicks: number;
  directionsClicks: number;
  facebookClicks: number;
  websiteClicks: number;
  conversionRate: number;
}

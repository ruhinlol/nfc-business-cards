import { Business, AnalyticsEvent, BusinessStats } from '@/types/business';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

const BUSINESSES_FILE = path.join(process.cwd(), 'src', 'data', 'businesses.json');
const ANALYTICS_FILE = path.join(process.cwd(), 'src', 'data', 'analytics.json');

function readJsonFile<T>(filePath: string): T {
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data) as T;
  } catch {
    return [] as unknown as T;
  }
}

function writeJsonFile<T>(filePath: string, data: T): void {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// ── Business CRUD ──────────────────────────────────────────

export function getAllBusinesses(): Business[] {
  return readJsonFile<Business[]>(BUSINESSES_FILE);
}

export function getBusinessBySlug(slug: string): Business | undefined {
  const businesses = getAllBusinesses();
  return businesses.find((b) => b.slug === slug);
}

export function getBusinessById(id: string): Business | undefined {
  const businesses = getAllBusinesses();
  return businesses.find((b) => b.id === id);
}

export function createBusiness(data: Omit<Business, 'id' | 'createdAt' | 'updatedAt'>): Business {
  const businesses = getAllBusinesses();
  const newBusiness: Business = {
    ...data,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  businesses.push(newBusiness);
  writeJsonFile(BUSINESSES_FILE, businesses);
  return newBusiness;
}

export function updateBusiness(id: string, data: Partial<Business>): Business | null {
  const businesses = getAllBusinesses();
  const index = businesses.findIndex((b) => b.id === id);
  if (index === -1) return null;

  businesses[index] = {
    ...businesses[index],
    ...data,
    id: businesses[index].id,
    updatedAt: new Date().toISOString(),
  };
  writeJsonFile(BUSINESSES_FILE, businesses);
  return businesses[index];
}

export function deleteBusiness(id: string): boolean {
  const businesses = getAllBusinesses();
  const filtered = businesses.filter((b) => b.id !== id);
  if (filtered.length === businesses.length) return false;
  writeJsonFile(BUSINESSES_FILE, filtered);
  return true;
}

// ── Analytics ──────────────────────────────────────────────

export function trackEvent(event: Omit<AnalyticsEvent, 'id' | 'timestamp'>): AnalyticsEvent {
  const events = readJsonFile<AnalyticsEvent[]>(ANALYTICS_FILE);
  const newEvent: AnalyticsEvent = {
    ...event,
    id: uuidv4(),
    timestamp: new Date().toISOString(),
  };
  events.push(newEvent);
  writeJsonFile(ANALYTICS_FILE, events);
  return newEvent;
}

export function getAnalyticsForBusiness(businessId: string): AnalyticsEvent[] {
  const events = readJsonFile<AnalyticsEvent[]>(ANALYTICS_FILE);
  return events.filter((e) => e.businessId === businessId);
}

export function getAllAnalytics(): AnalyticsEvent[] {
  return readJsonFile<AnalyticsEvent[]>(ANALYTICS_FILE);
}

export function getBusinessStats(businessId: string): BusinessStats {
  const events = getAnalyticsForBusiness(businessId);

  const totalViews = events.filter((e) => e.eventType === 'page_view').length;
  const reviewClicks = events.filter((e) => e.eventType === 'review_click').length;
  const instagramClicks = events.filter((e) => e.eventType === 'instagram_click').length;
  const tiktokClicks = events.filter((e) => e.eventType === 'tiktok_click').length;
  const whatsappClicks = events.filter((e) => e.eventType === 'whatsapp_click').length;
  const phoneClicks = events.filter((e) => e.eventType === 'phone_click').length;
  const directionsClicks = events.filter((e) => e.eventType === 'directions_click').length;
  const facebookClicks = events.filter((e) => e.eventType === 'facebook_click').length;
  const websiteClicks = events.filter((e) => e.eventType === 'website_click').length;

  const conversionRate = totalViews > 0 ? (reviewClicks / totalViews) * 100 : 0;

  return {
    totalViews,
    reviewClicks,
    instagramClicks,
    tiktokClicks,
    whatsappClicks,
    phoneClicks,
    directionsClicks,
    facebookClicks,
    websiteClicks,
    conversionRate,
  };
}

export function getOverallStats(): BusinessStats & { totalBusinesses: number } {
  const events = readJsonFile<AnalyticsEvent[]>(ANALYTICS_FILE);
  const businesses = getAllBusinesses();

  const totalViews = events.filter((e) => e.eventType === 'page_view').length;
  const reviewClicks = events.filter((e) => e.eventType === 'review_click').length;
  const instagramClicks = events.filter((e) => e.eventType === 'instagram_click').length;
  const tiktokClicks = events.filter((e) => e.eventType === 'tiktok_click').length;
  const whatsappClicks = events.filter((e) => e.eventType === 'whatsapp_click').length;
  const phoneClicks = events.filter((e) => e.eventType === 'phone_click').length;
  const directionsClicks = events.filter((e) => e.eventType === 'directions_click').length;
  const facebookClicks = events.filter((e) => e.eventType === 'facebook_click').length;
  const websiteClicks = events.filter((e) => e.eventType === 'website_click').length;

  const conversionRate = totalViews > 0 ? (reviewClicks / totalViews) * 100 : 0;

  return {
    totalBusinesses: businesses.length,
    totalViews,
    reviewClicks,
    instagramClicks,
    tiktokClicks,
    whatsappClicks,
    phoneClicks,
    directionsClicks,
    facebookClicks,
    websiteClicks,
    conversionRate,
  };
}

// ── Slug generation ────────────────────────────────────────

export function generateSlug(name: string): string {
  return name
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
}

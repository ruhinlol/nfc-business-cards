import { Business, AnalyticsEvent, BusinessStats } from '@/types/business';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

// In-memory cache across serverless warm invocations
declare global {
  // eslint-disable-next-line no-var
  var _businessesStore: Business[] | undefined;
  // eslint-disable-next-line no-var
  var _analyticsStore: AnalyticsEvent[] | undefined;
}

const PRIMARY_BUSINESSES_FILE = path.join(process.cwd(), 'src', 'data', 'businesses.json');
const PRIMARY_ANALYTICS_FILE = path.join(process.cwd(), 'src', 'data', 'analytics.json');

// Vercel serverless has writable /tmp directory
const TMP_BUSINESSES_FILE = path.join('/tmp', 'businesses.json');
const TMP_ANALYTICS_FILE = path.join('/tmp', 'analytics.json');

function readJsonFile<T>(primaryPath: string, tmpPath: string, memoryFallback?: T): T {
  if (memoryFallback && Array.isArray(memoryFallback) && memoryFallback.length > 0) {
    return memoryFallback;
  }

  // Try tmp first (latest updates in serverless)
  try {
    if (fs.existsSync(tmpPath)) {
      const data = fs.readFileSync(tmpPath, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed as T;
      }
    }
  } catch {
    // Ignore tmp read errors
  }

  // Fallback to bundled file
  try {
    if (fs.existsSync(primaryPath)) {
      const data = fs.readFileSync(primaryPath, 'utf-8');
      return JSON.parse(data) as T;
    }
  } catch {
    // Ignore primary read errors
  }

  return (memoryFallback || []) as unknown as T;
}

function writeJsonFile<T>(primaryPath: string, tmpPath: string, data: T): void {
  // Try writing to primary path (works in local dev)
  let primarySuccess = false;
  try {
    fs.writeFileSync(primaryPath, JSON.stringify(data, null, 2), 'utf-8');
    primarySuccess = true;
  } catch {
    // Will fail on Vercel (read-only filesystem)
  }

  // If primary failed or in production, write to /tmp
  if (!primarySuccess) {
    try {
      fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.warn('Warning: Could not write to /tmp:', e);
    }
  }
}

// ── Business CRUD ──────────────────────────────────────────

export function getAllBusinesses(): Business[] {
  const list = readJsonFile<Business[]>(
    PRIMARY_BUSINESSES_FILE, 
    TMP_BUSINESSES_FILE, 
    globalThis._businessesStore
  );
  globalThis._businessesStore = list;
  return list;
}

export function getBusinessBySlug(slug: string): Business | undefined {
  const businesses = getAllBusinesses();
  return businesses.find((b) => b.slug.toLowerCase() === slug.toLowerCase());
}

export function getBusinessById(id: string): Business | undefined {
  const businesses = getAllBusinesses();
  return businesses.find((b) => b.id === id);
}

export function createBusiness(data: Omit<Business, 'id' | 'createdAt' | 'updatedAt'>): Business {
  const businesses = getAllBusinesses();
  
  // Ensure slug is unique
  let finalSlug = data.slug || generateSlug(data.name);
  let counter = 1;
  while (businesses.some((b) => b.slug.toLowerCase() === finalSlug.toLowerCase())) {
    counter++;
    finalSlug = `${data.slug || generateSlug(data.name)}-${counter}`;
  }

  const newBusiness: Business = {
    ...data,
    slug: finalSlug,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  businesses.push(newBusiness);
  globalThis._businessesStore = businesses;

  writeJsonFile(PRIMARY_BUSINESSES_FILE, TMP_BUSINESSES_FILE, businesses);
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

  globalThis._businessesStore = businesses;
  writeJsonFile(PRIMARY_BUSINESSES_FILE, TMP_BUSINESSES_FILE, businesses);
  return businesses[index];
}

export function deleteBusiness(id: string): boolean {
  const businesses = getAllBusinesses();
  const filtered = businesses.filter((b) => b.id !== id);
  if (filtered.length === businesses.length) return false;

  globalThis._businessesStore = filtered;
  writeJsonFile(PRIMARY_BUSINESSES_FILE, TMP_BUSINESSES_FILE, filtered);
  return true;
}

// ── Analytics ──────────────────────────────────────────────

export function trackEvent(event: Omit<AnalyticsEvent, 'id' | 'timestamp'>): AnalyticsEvent {
  const events = getAllAnalytics();
  const newEvent: AnalyticsEvent = {
    ...event,
    id: uuidv4(),
    timestamp: new Date().toISOString(),
  };
  events.push(newEvent);
  globalThis._analyticsStore = events;
  writeJsonFile(PRIMARY_ANALYTICS_FILE, TMP_ANALYTICS_FILE, events);
  return newEvent;
}

export function getAnalyticsForBusiness(businessId: string): AnalyticsEvent[] {
  const events = getAllAnalytics();
  return events.filter((e) => e.businessId === businessId);
}

export function getAllAnalytics(): AnalyticsEvent[] {
  const list = readJsonFile<AnalyticsEvent[]>(
    PRIMARY_ANALYTICS_FILE,
    TMP_ANALYTICS_FILE,
    globalThis._analyticsStore
  );
  globalThis._analyticsStore = list;
  return list;
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
  const events = getAllAnalytics();
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

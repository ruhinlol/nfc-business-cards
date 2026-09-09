import { Business, AnalyticsEvent, BusinessStats } from '@/types/business';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { Redis } from '@upstash/redis';

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

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

  if (url && token) {
    try {
      return new Redis({ url, token });
    } catch (e) {
      console.error('Failed to init Redis:', e);
    }
  }
  return null;
}

function getBundledBusinesses(): Business[] {
  try {
    if (fs.existsSync(PRIMARY_BUSINESSES_FILE)) {
      const data = fs.readFileSync(PRIMARY_BUSINESSES_FILE, 'utf-8');
      return JSON.parse(data) as Business[];
    }
  } catch {}
  return [];
}

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
  } catch {}

  // Fallback to bundled file
  try {
    if (fs.existsSync(primaryPath)) {
      const data = fs.readFileSync(primaryPath, 'utf-8');
      return JSON.parse(data) as T;
    }
  } catch {}

  return (memoryFallback || []) as unknown as T;
}

function writeJsonFile<T>(primaryPath: string, tmpPath: string, data: T): void {
  let primarySuccess = false;
  try {
    fs.writeFileSync(primaryPath, JSON.stringify(data, null, 2), 'utf-8');
    primarySuccess = true;
  } catch {}

  if (!primarySuccess) {
    try {
      fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.warn('Warning: Could not write to /tmp:', e);
    }
  }
}

// ── Business CRUD ──────────────────────────────────────────

export async function getAllBusinesses(): Promise<Business[]> {
  const redis = getRedis();
  if (redis) {
    try {
      const cached = await redis.get<Business[]>('nfc_businesses');
      if (cached && Array.isArray(cached) && cached.length > 0) {
        globalThis._businessesStore = cached;
        return cached;
      }
      const initial = getBundledBusinesses();
      if (initial.length > 0) {
        await redis.set('nfc_businesses', initial);
      }
      globalThis._businessesStore = initial;
      return initial;
    } catch (e) {
      console.warn('Redis read failed, falling back to local:', e);
    }
  }

  const list = readJsonFile<Business[]>(
    PRIMARY_BUSINESSES_FILE, 
    TMP_BUSINESSES_FILE, 
    globalThis._businessesStore
  );
  globalThis._businessesStore = list;
  return list;
}

export async function getBusinessBySlug(slug: string): Promise<Business | undefined> {
  const businesses = await getAllBusinesses();
  return businesses.find((b) => b.slug.toLowerCase() === slug.toLowerCase());
}

export async function getBusinessById(id: string): Promise<Business | undefined> {
  const businesses = await getAllBusinesses();
  return businesses.find((b) => b.id === id);
}

export async function createBusiness(data: Omit<Business, 'id' | 'createdAt' | 'updatedAt'>): Promise<Business> {
  const businesses = await getAllBusinesses();
  
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

  const redis = getRedis();
  if (redis) {
    try {
      await redis.set('nfc_businesses', businesses);
    } catch (e) {
      console.error('Failed to save business to Redis:', e);
    }
  }

  writeJsonFile(PRIMARY_BUSINESSES_FILE, TMP_BUSINESSES_FILE, businesses);
  return newBusiness;
}

export async function updateBusiness(id: string, data: Partial<Business>): Promise<Business | null> {
  const businesses = await getAllBusinesses();
  const index = businesses.findIndex((b) => b.id === id);
  if (index === -1) return null;

  businesses[index] = {
    ...businesses[index],
    ...data,
    id: businesses[index].id,
    updatedAt: new Date().toISOString(),
  };

  globalThis._businessesStore = businesses;

  const redis = getRedis();
  if (redis) {
    try {
      await redis.set('nfc_businesses', businesses);
    } catch (e) {
      console.error('Failed to update business in Redis:', e);
    }
  }

  writeJsonFile(PRIMARY_BUSINESSES_FILE, TMP_BUSINESSES_FILE, businesses);
  return businesses[index];
}

export async function deleteBusiness(id: string): Promise<boolean> {
  const businesses = await getAllBusinesses();
  const filtered = businesses.filter((b) => b.id !== id);
  if (filtered.length === businesses.length) return false;

  globalThis._businessesStore = filtered;

  const redis = getRedis();
  if (redis) {
    try {
      await redis.set('nfc_businesses', filtered);
    } catch (e) {
      console.error('Failed to delete business from Redis:', e);
    }
  }

  writeJsonFile(PRIMARY_BUSINESSES_FILE, TMP_BUSINESSES_FILE, filtered);
  return true;
}

// ── Analytics ──────────────────────────────────────────────

export async function trackEvent(event: Omit<AnalyticsEvent, 'id' | 'timestamp'>): Promise<AnalyticsEvent> {
  const events = await getAllAnalytics();
  const newEvent: AnalyticsEvent = {
    ...event,
    id: uuidv4(),
    timestamp: new Date().toISOString(),
  };
  events.push(newEvent);
  globalThis._analyticsStore = events;

  const redis = getRedis();
  if (redis) {
    try {
      await redis.set('nfc_analytics', events);
    } catch (e) {
      console.error('Failed to save analytics to Redis:', e);
    }
  }

  writeJsonFile(PRIMARY_ANALYTICS_FILE, TMP_ANALYTICS_FILE, events);
  return newEvent;
}

export async function getAnalyticsForBusiness(businessId: string): Promise<AnalyticsEvent[]> {
  const events = await getAllAnalytics();
  return events.filter((e) => e.businessId === businessId);
}

export async function getAllAnalytics(): Promise<AnalyticsEvent[]> {
  const redis = getRedis();
  if (redis) {
    try {
      const events = await redis.get<AnalyticsEvent[]>('nfc_analytics');
      if (events && Array.isArray(events)) {
        globalThis._analyticsStore = events;
        return events;
      }
    } catch (e) {
      console.warn('Redis analytics read failed:', e);
    }
  }

  const list = readJsonFile<AnalyticsEvent[]>(
    PRIMARY_ANALYTICS_FILE,
    TMP_ANALYTICS_FILE,
    globalThis._analyticsStore
  );
  globalThis._analyticsStore = list;
  return list;
}

export async function getBusinessStats(businessId: string): Promise<BusinessStats> {
  const events = await getAnalyticsForBusiness(businessId);

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

export async function getOverallStats(): Promise<BusinessStats & { totalBusinesses: number }> {
  const events = await getAllAnalytics();
  const businesses = await getAllBusinesses();

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

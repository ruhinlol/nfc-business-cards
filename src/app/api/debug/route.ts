import { NextResponse } from 'next/server';
import { getAllBusinesses, getBusinessBySlug } from '@/lib/data';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug') || 'rux';

  const hasKvUrl = !!process.env.KV_REST_API_URL;
  const hasStorageUrl = !!process.env.STORAGE_REST_API_URL;
  const hasStorageSimpleUrl = !!process.env.STORAGE_URL;
  const hasUpstashUrl = !!process.env.UPSTASH_REDIS_REST_URL;

  const envKeys = Object.keys(process.env).filter((k) => 
    k.includes('KV') || k.includes('STORAGE') || k.includes('UPSTASH') || k.includes('REDIS')
  );

  const businesses = await getAllBusinesses();
  const foundBusiness = await getBusinessBySlug(slug);

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    envKeys,
    hasRedisConfig: hasKvUrl || hasStorageUrl || hasStorageSimpleUrl || hasUpstashUrl,
    totalBusinesses: businesses.length,
    businessSlugs: businesses.map((b) => b.slug),
    querySlug: slug,
    found: !!foundBusiness,
    foundBusiness: foundBusiness || null,
  });
}

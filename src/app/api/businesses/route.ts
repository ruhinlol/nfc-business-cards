import { NextRequest, NextResponse } from 'next/server';
import { getAllBusinesses, createBusiness, generateSlug } from '@/lib/data';

export async function GET() {
  try {
    const businesses = getAllBusinesses();
    return NextResponse.json(businesses);
  } catch (error) {
    console.error('Error fetching businesses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch businesses' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name) {
      return NextResponse.json(
        { error: 'Business name is required' },
        { status: 400 }
      );
    }

    const slug = body.slug || generateSlug(body.name);

    const business = createBusiness({
      name: body.name,
      slug,
      logo: body.logo || '',
      coverImage: body.coverImage || '',
      description: body.description || '',
      googleRating: body.googleRating || 0,
      googleReviewUrl: body.googleReviewUrl || '',
      googleMapsUrl: body.googleMapsUrl || '',
      phone: body.phone || '',
      whatsapp: body.whatsapp || '',
      instagram: body.instagram || '',
      tiktok: body.tiktok || '',
      facebook: body.facebook || '',
      website: body.website || '',
      address: body.address || '',
      openingHours: body.openingHours || {},
      brandColor: body.brandColor || '#3b82f6',
    });

    return NextResponse.json(business, { status: 201 });
  } catch (error) {
    console.error('Error creating business:', error);
    return NextResponse.json(
      { error: 'Failed to create business' },
      { status: 500 }
    );
  }
}

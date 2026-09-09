import { Metadata } from 'next';
import { getBusinessBySlug } from '@/lib/data';
import BusinessProfileView from '@/components/business/BusinessProfileView';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  let business = null;
  try {
    business = await getBusinessBySlug(slug);
  } catch {}

  const locationPart = business?.address?.split(',').pop()?.trim();
  const title = business
    ? (locationPart ? `${business.name} | ${locationPart}` : business.name)
    : `${slug} | NFC Profil`;

  const description = business?.description
    ? `${business.name} – ${business.description}${locationPart ? `. ${locationPart}.` : '.'}`
    : 'Rəqəmsal NFC biznes profili.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/b/${slug}`,
      siteName: 'NFC Profil',
      images: business?.coverImage
        ? [{ url: business.coverImage, width: 1200, height: 630 }]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function BusinessPage({ params }: PageProps) {
  const { slug } = await params;
  let business = null;
  try {
    business = (await getBusinessBySlug(slug)) || null;
  } catch {}

  return <BusinessProfileView initialBusiness={business} slug={slug} />;
}

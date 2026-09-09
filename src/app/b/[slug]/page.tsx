import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBusinessBySlug } from '@/lib/data';
import BusinessHero from '@/components/business/BusinessHero';
import ReviewCTA from '@/components/business/ReviewCTA';
import SocialLinks from '@/components/business/SocialLinks';
import ContactActions from '@/components/business/ContactActions';
import OpeningHours from '@/components/business/OpeningHours';
import BusinessFooter from '@/components/business/BusinessFooter';
import PageViewTracker from '@/components/business/PageViewTracker';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);

  if (!business) {
    return { title: 'Biznes tapılmadı' };
  }

  const locationPart = business.address?.split(',').pop()?.trim();
  const title = locationPart
    ? `${business.name} | ${locationPart}`
    : business.name;

  const description = business.description
    ? `${business.name} – ${business.description}${locationPart ? `. ${locationPart}.` : '.'}`
    : `${business.name} – rəqəmsal biznes profili.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/b/${slug}`,
      siteName: 'NFC Profil',
      images: business.coverImage
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
  const business = await getBusinessBySlug(slug);

  if (!business) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Constrain to mobile-friendly max width */}
      <div className="mx-auto max-w-md">
        <PageViewTracker businessId={business.id} />

        {/* Hero: Cover + Logo + Name + Rating */}
        <BusinessHero business={business} />

        {/* Main content with spacing */}
        <div className="mt-6 space-y-6">
          {/* Primary CTA: Google Review */}
          <ReviewCTA business={business} />

          {/* Social Media Links */}
          <SocialLinks business={business} />

          {/* Contact Actions */}
          <ContactActions business={business} />

          {/* Opening Hours */}
          <OpeningHours hours={business.openingHours} />

          {/* Footer */}
          <BusinessFooter business={business} />
        </div>
      </div>
    </div>
  );
}

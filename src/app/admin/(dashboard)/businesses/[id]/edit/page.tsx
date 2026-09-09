import { getBusinessById } from '@/lib/data';
import { notFound } from 'next/navigation';
import BusinessForm from '@/components/admin/BusinessForm';

interface EditBusinessProps {
  params: Promise<{ id: string }>;
}

export default async function EditBusinessPage({ params }: EditBusinessProps) {
  const { id } = await params;
  const business = await getBusinessById(id);

  if (!business) {
    notFound();
  }

  return (
    <div className="space-y-6 pt-12 lg:pt-0">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          Biznes Profilini Redaktə Et
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {business.name} üçün məlumatları və keçid linklərini yeniləyin.
        </p>
      </div>

      <BusinessForm initialData={business} isEditing />
    </div>
  );
}

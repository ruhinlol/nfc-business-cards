import BusinessForm from '@/components/admin/BusinessForm';

export const metadata = {
  title: 'Yeni Biznes Əlavə Et | NFC Profil',
};

export default function NewBusinessPage() {
  return (
    <div className="space-y-6 pt-12 lg:pt-0">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          Yeni Biznes Profili Yarat
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          NFC kart və QR kod üçün yeni biznes səhifəsi təyin edin.
        </p>
      </div>

      <BusinessForm />
    </div>
  );
}

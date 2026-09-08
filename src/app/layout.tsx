import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NFC Biznes Profil | Rəqəmsal vizit kartı",
  description:
    "NFC kartlar vasitəsilə biznesinizi rəqəmsal şəkildə tanıdın. Google rəyləri, sosial şəbəkələr və əlaqə məlumatları bir yerdə.",
  keywords: ["NFC", "biznes profil", "Google rəy", "QR kod", "Azərbaycan"],
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="az">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#ffffff" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="default"
        />
      </head>
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}

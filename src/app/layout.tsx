import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: '%s | DAN SERVICES',
    default: 'DAN SERVICES | Engineering Viral Cultural Moments & High-ROI Creator Campaigns',
  },
  description: 'DAN SERVICES is an elite, full-service Influencer Marketing Agency specializing in high-converting campaigns across YouTube, Instagram, X (Twitter), LinkedIn, and TikTok.',
  openGraph: {
    title: 'DAN SERVICES | Engineering Viral Cultural Moments & High-ROI Creator Campaigns',
    description: 'DAN SERVICES is an elite, full-service Influencer Marketing Agency specializing in high-converting campaigns across YouTube, Instagram, X (Twitter), LinkedIn, and TikTok.',
    url: 'https://danservices.com',
    siteName: 'DAN SERVICES',
    images: [
      {
        url: 'https://danservices.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'DAN SERVICES Logo',
      },
    ],
  },
  icons: {
    icon: '/favicon.ico',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "DAN SERVICES",
  url: "https://danservices.com",
  logo: "https://danservices.com/logo.png",
  description: "DAN SERVICES is an elite, full-service Influencer Marketing Agency specializing in high-converting campaigns across YouTube, Instagram, X (Twitter), LinkedIn, and TikTok.",
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+1-555-555-5555",
    contactType: "Customer Service",
    email: "info@danservices.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
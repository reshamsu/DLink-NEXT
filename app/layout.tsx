import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import HideNavbar from "@/components/HideNavbar";
import HideFooter from "@/components/HideFooter";
import GoogleProvider from "./GoogleProvider";

const siteUrl = "https://dlink-colombo.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "D-Link Real Estate | Colombo's Premium Property Platform",
    template: "%s | D-Link Real Estate",
  },
  description:
    "Discover your dream home with D-Link Real Estate — Colombo's premier platform for buying, selling, and renting properties. Explore homes, apartments, villas, commercial spaces, and land across Sri Lanka.",
  keywords: [
    "real estate Colombo",
    "property Sri Lanka",
    "buy house Colombo",
    "rent apartment Colombo",
    "villas Sri Lanka",
    "land for sale Colombo",
    "D-Link Real Estate",
    "Roy.Su Realtors",
    "property for sale Sri Lanka",
    "commercial property Colombo",
  ],
  authors: [{ name: "D-Link Real Estate" }],
  creator: "D-Link Real Estate",
  publisher: "D-Link Real Estate",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_LK",
    url: siteUrl,
    siteName: "D-Link Real Estate",
    title: "D-Link Real Estate | Colombo's Premium Property Platform",
    description:
      "Discover your dream home with D-Link Real Estate — Colombo's premier platform for buying, selling, and renting properties across Sri Lanka.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "D-Link Real Estate — Colombo's Premier Property Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "D-Link Real Estate | Colombo's Premium Property Platform",
    description:
      "Discover your dream home with D-Link Real Estate — Colombo's premier platform for buying, selling, and renting properties across Sri Lanka.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: siteUrl,
  },
};

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: "D-Link Real Estate",
  alternateName: "Roy.Su Realtors",
  url: siteUrl,
  logo: `${siteUrl}/favicon.ico`,
  description:
    "Colombo's premier platform for buying, selling, and renting properties across Sri Lanka.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Colombo",
    addressCountry: "LK",
  },
  telephone: "+94761676603",
  email: "info@dlink-colombo.com",
  areaServed: { "@type": "Country", name: "Sri Lanka" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Script
          id="org-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <HideNavbar />
        <GoogleProvider>
          <main className="relative overflow-hidden">{children}</main>
        </GoogleProvider>
        <HideFooter />
      </body>
    </html>
  );
}

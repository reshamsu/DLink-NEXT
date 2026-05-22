import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Houses & Homes for Sale in Colombo",
  description:
    "Browse houses and homes for sale or rent across Colombo and Sri Lanka on D-Link Real Estate. Find your perfect family home with detailed listings, photos, and direct agent contact.",
  keywords: [
    "houses for sale Colombo",
    "homes for sale Sri Lanka",
    "buy house Colombo",
    "family homes Sri Lanka",
    "residential property Colombo",
  ],
  openGraph: {
    title: "Houses & Homes for Sale in Colombo | D-Link Real Estate",
    description:
      "Browse houses and homes for sale or rent across Colombo and Sri Lanka. Detailed listings with photos and direct agent contact.",
    url: "https://dlink-colombo.com/property/homes",
  },
  alternates: {
    canonical: "https://dlink-colombo.com/property/homes",
  },
};

export default function HomesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

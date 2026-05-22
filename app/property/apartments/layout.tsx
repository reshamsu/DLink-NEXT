import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apartments for Sale & Rent in Colombo",
  description:
    "Explore apartments for sale and rent in Colombo and across Sri Lanka on D-Link Real Estate. From modern studios to luxury condos — find the apartment that fits your lifestyle.",
  keywords: [
    "apartments for sale Colombo",
    "apartments for rent Colombo",
    "condos Sri Lanka",
    "flat for sale Colombo",
    "luxury apartments Sri Lanka",
  ],
  openGraph: {
    title: "Apartments for Sale & Rent in Colombo | D-Link Real Estate",
    description:
      "Modern studios to luxury condos — browse apartments for sale and rent across Colombo and Sri Lanka.",
    url: "https://dlink-colombo.com/property/apartments",
  },
  alternates: {
    canonical: "https://dlink-colombo.com/property/apartments",
  },
};

export default function ApartmentsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

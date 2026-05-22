import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Commercial Properties for Sale & Rent in Colombo",
  description:
    "Find commercial properties for sale and rent in Colombo and Sri Lanka on D-Link Real Estate. Office spaces, retail units, warehouses, and more — ideal for businesses and investors.",
  keywords: [
    "commercial property Colombo",
    "office space for rent Colombo",
    "retail property Sri Lanka",
    "commercial real estate Sri Lanka",
    "warehouse for rent Colombo",
  ],
  openGraph: {
    title: "Commercial Properties in Colombo | D-Link Real Estate",
    description:
      "Office spaces, retail units, warehouses, and more — browse commercial property listings across Colombo and Sri Lanka.",
    url: "https://dlink-colombo.com/property/commercial",
  },
  alternates: {
    canonical: "https://dlink-colombo.com/property/commercial",
  },
};

export default function CommercialLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Luxury Villas for Sale in Sri Lanka",
  description:
    "Discover exclusive luxury villas for sale across Colombo and Sri Lanka on D-Link Real Estate. Browse spacious villas with premium amenities, stunning views, and prime locations.",
  keywords: [
    "villas for sale Sri Lanka",
    "luxury villas Colombo",
    "villa property Sri Lanka",
    "buy villa Colombo",
    "premium villas Sri Lanka",
  ],
  openGraph: {
    title: "Luxury Villas for Sale in Sri Lanka | D-Link Real Estate",
    description:
      "Exclusive luxury villas with premium amenities across Colombo and Sri Lanka. Browse and connect with agents directly.",
    url: "https://dlink-colombo.com/property/villas",
  },
  alternates: {
    canonical: "https://dlink-colombo.com/property/villas",
  },
};

export default function VillasLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Services",
  description:
    "Explore the full range of real estate services offered by D-Link Real Estate — property buying, selling, renting, investment consultancy, and valuation in Colombo and beyond.",
  openGraph: {
    title: "Real Estate Services | D-Link Real Estate Colombo",
    description:
      "Buying, selling, renting, and investment advisory — explore all services from Colombo's premier property platform.",
    url: "https://dlink-colombo.com/service",
  },
  alternates: {
    canonical: "https://dlink-colombo.com/service",
  },
};

export default function ServiceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

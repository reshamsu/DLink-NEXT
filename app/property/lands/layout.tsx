import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Land for Sale in Colombo & Sri Lanka",
  description:
    "Browse land plots for sale across Colombo and Sri Lanka on D-Link Real Estate. Residential, commercial, and investment land available in prime locations. Connect directly with owners and agents.",
  keywords: [
    "land for sale Colombo",
    "land for sale Sri Lanka",
    "plot for sale Colombo",
    "buy land Sri Lanka",
    "residential land Colombo",
    "investment land Sri Lanka",
  ],
  openGraph: {
    title: "Land for Sale in Colombo & Sri Lanka | D-Link Real Estate",
    description:
      "Residential, commercial, and investment land plots in prime locations across Colombo and Sri Lanka.",
    url: "https://dlink-colombo.com/property/lands",
  },
  alternates: {
    canonical: "https://dlink-colombo.com/property/lands",
  },
};

export default function LandsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

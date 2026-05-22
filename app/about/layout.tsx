import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about D-Link Real Estate — the team behind Colombo's most trusted property platform. We connect buyers, sellers, and renters with handpicked listings across Sri Lanka.",
  openGraph: {
    title: "About D-Link Real Estate | Colombo's Trusted Property Experts",
    description:
      "Meet the team behind D-Link Real Estate. Handpicked listings, expert guidance, and seamless property transactions across Sri Lanka.",
    url: "https://dlink-colombo.com/about",
  },
  alternates: {
    canonical: "https://dlink-colombo.com/about",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

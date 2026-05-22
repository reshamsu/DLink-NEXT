import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with D-Link Real Estate. Call, WhatsApp, or email our team for buying, selling, rental, and investment inquiries. We're here to help you find your perfect property in Colombo.",
  openGraph: {
    title: "Contact D-Link Real Estate | Colombo Property Experts",
    description:
      "Reach D-Link Real Estate by phone, WhatsApp, or email. Expert real estate support for buyers, sellers, and investors across Sri Lanka.",
    url: "https://dlink-colombo.com/contact",
  },
  alternates: {
    canonical: "https://dlink-colombo.com/contact",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

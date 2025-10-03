import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
// import { Analytics } from "@vercel/analytics/react";
// import Theme from "./theme";

export const metadata: Metadata = {
  title: "D-Link Colombo | The Listing Platform",
  description: "Real Estate Listing Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {/* <Theme /> */}
        <main className="relative overflow-hidden">{children}</main>
        <Footer />
        {/* <Analytics /> */}
      </body>
    </html>
  );
}

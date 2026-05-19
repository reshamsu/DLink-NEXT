import type { Metadata } from "next";
import "./globals.css";
import HideNavbar from "@/components/HideNavbar";
import HideFooter from "@/components/HideFooter";
import GoogleProvider from "./GoogleProvider";

export const metadata: Metadata = {
  title: "D-Link Real Estate | Colombo's Premium Platform",
  description: "Discover your dream home with D-Link Real Estate, Colombo's premier platform for buying, selling, and renting properties. Explore a wide range of listings, from luxurious apartments to charming houses, all in one place. Experience seamless property transactions with our user-friendly interface and expert support. Your perfect home awaits at D-Link Real Estate.",
};
  
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <HideNavbar />
        <GoogleProvider>
          <main className="relative overflow-hidden">{children}</main>
        </GoogleProvider>
        <HideFooter />
      </body>
    </html>
  );
}

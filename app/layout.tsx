import type { Metadata } from "next";
import "./globals.css";
import HideNavbar from "@/components/HideNavbar";
import HideFooter from "@/components/HideFooter";
import GoogleProvider from "./GoogleProvider";

export const metadata: Metadata = {
  title: "D-Link Colombo | The Listing Platform",
  description: "Real Estate Listing Platform",
};

const CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  "454373247918-uk8j5em60iu73367qho1vdfpaddma36c.apps.googleusercontent.com";

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

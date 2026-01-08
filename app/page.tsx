"use client";

import dynamic from "next/dynamic";
import Hero from "@/components/home/Hero";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Analytics from "@/components/home/Analytics";
import CTA from "@/components/home/CTA";

export default function Home() {
  const Listings = dynamic(() => import("@/components/home/Listings"), {
    ssr: false,
  });

  return (
    <div className="relative pt-20 lg:pt-0 z-30">
      <Hero />
      <Listings />
      <WhyChooseUs />
      <Analytics />
      <CTA />
    </div>
  );
}

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
    <div className="relative z-30 pt-10 lg:pt-14">
      <Hero />
      <Listings />
      <WhyChooseUs />
      <Analytics />
      <CTA />
    </div>
  );
}

"use client";

import Analytics from "@/components/home/Analytics";
import CTA from "@/components/home/CTA";
import Form from "@/components/home/Form";
import Hero from "@/components/home/Hero";
import dynamic from "next/dynamic";
import WhyChooseUs from "@/components/home/WhyChooseUs";

export default function Home() {
  const Listings = dynamic(() => import("@/components/home/Listings"), {
    ssr: false, 
  });

  return (
     <div className="relative z-30 pt-10">
      <Hero />
      <Form />
      <Listings />
      <WhyChooseUs />
      <Analytics />
      <CTA />
    </div>
  );
}

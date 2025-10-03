"use client";

import Analytics from "@/components/home/Analytics";
import CTA from "@/components/home/CTA";
import Form from "@/components/home/Form";
import Hero from "@/components/home/Hero";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import dynamic from "next/dynamic";

// Dynamic import of Listings to disable SSR
const Listings = dynamic(() => import("@/components/home/Listings"), { ssr: false });

export default function Home() {
  return (
    <>
      <Hero />
      <Form />
      <Listings />
      <WhyChooseUs />
      <Analytics />
      <CTA />
    </>
  );
}

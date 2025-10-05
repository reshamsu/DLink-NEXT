"use client";

import Analytics from "@/components/home/Analytics";
import CTA from "@/components/home/CTA";
import Form from "@/components/home/Form";
import Hero from "@/components/home/Hero";
import Listings from "@/components/home/Listings";
import WhyChooseUs from "@/components/home/WhyChooseUs";

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

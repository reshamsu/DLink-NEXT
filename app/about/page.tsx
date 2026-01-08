"use client";

import Hero from "@/components/about/Hero";
import Values from "@/components/about/Values";
import Welcome from "@/components/about/Welcome";

export default function About() {
  return (
     <div className="relative z-30 pt-18">
      <Hero />
      <Welcome />
      <Values />
    </div>
  );
}

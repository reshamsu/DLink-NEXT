"use client";

import { TbArrowRight, TbPhone, TbMail, TbBrandWhatsapp } from "react-icons/tb";
import Link from "next/link";

const stats = [
  { value: "500+", label: "Properties Listed" },
  { value: "200+", label: "Happy Clients" },
  { value: "10+", label: "Years Experience" },
  { value: "50+", label: "Locations Covered" },
];

const CTA = () => {
  return (
    <section className="bg-gray-100 text-gray-800">
      <div className="max-w-6xl mx-auto py-16 px-8 2xl:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 rounded-3xl overflow-hidden shadow-xl">

          {/* Left — dark content panel */}
          <div className="bg-gray-900 text-white flex flex-col justify-between gap-8 p-10 md:p-12">
            <div className="flex flex-col gap-4">
              <p className="text-xs font-extrabold bg-orange-500/15 text-orange-400 w-fit px-4 py-2 rounded-full tracking-widest uppercase">
                Get In Touch
              </p>
              <h2 className="text-2xl md:text-3xl font-extrabold leading-tight">
                Ready to Invest?{" "}
                <span className="text-orange-400">Speak With an Expert.</span>
              </h2>
              <p className="text-sm text-gray-400 leading-relaxed">
                Get personalized guidance on buying, selling, or investing in
                property. We help you evaluate opportunities, avoid costly
                mistakes, and make decisions backed by real market insight.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Link
                href="https://wa.me/94761676603"
                className="inline-flex items-center gap-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm px-6 py-3 rounded-2xl transition-colors duration-200 w-fit"
              >
                <TbBrandWhatsapp size={18} />
                Book a Consultation
                <TbArrowRight size={16} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors duration-200 font-semibold w-fit"
              >
                <TbMail size={15} />
                Contact Us
              </Link>
            </div>
          </div>

          {/* Right — stats panel */}
          <div className="bg-orange-500 flex flex-col justify-between p-10 md:p-12">
            <p className="text-xs font-extrabold text-white/70 uppercase tracking-widest mb-8">
              Why Trust Us
            </p>

            <div className="grid grid-cols-2 gap-6 flex-1">
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col gap-1">
                  <p className="text-4xl font-extrabold text-white leading-none">{stat.value}</p>
                  <p className="text-xs font-bold text-white/70">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-white/20 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
                <TbPhone size={16} className="text-white" />
              </div>
              <div>
                <p className="text-[11px] text-white/60 font-semibold">Call us directly</p>
                <p className="text-sm font-extrabold text-white">+94 76 167 6603</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default CTA;

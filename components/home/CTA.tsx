"use client";

import { FaArrowRight } from "react-icons/fa6";
import Link from "next/link";

const CTA = () => {
  return (
    <div className="bg-orange-500/10 text-gray-800 relative">
      <div className="max-w-6xl mx-auto py-20 px-6 2xl:px-0">
        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-10 text-center lg:text-start h-full
          bg-white
          p-10 md:p-16 shadow-xl rounded-3xl relative overflow-hidden"
        >
          {/* Left Section */}
          <div className="flex flex-col justify-center gap-6 h-fit z-10">
            <h1 className="text-2xl md:text-3xl 2xl:text-4xl font-extrabold leading-tight">
              Ready to Invest?{" "}
              <i className="text-orange-500">Speak With an Expert.</i>
            </h1>
            <p className="text-sm 2xl:text-base font-medium text-gray-600">
              Get personalized guidance on buying, selling, or investing in
              property. We help you evaluate opportunities, avoid costly
              mistakes, and make decisions backed by real market insight.
            </p>

            {/* Buttons */}
            <div className="flex items-center text-sm 2xl:text-base gap-4 flex-wrap justify-center lg:justify-start">
              <Link
                href="https://wa.me/94761676603"
                className="select-none btn-dark-base"
              >
                Book Now <FaArrowRight size={18} />
              </Link>
              <Link href="/contact" className="select-none btn-orange-outline">
                Contact Us
              </Link>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex justify-center items-center absolute inset-0 lg:relative w-full h-full">
            {/* <Image
              src="/assets/banner/property.jpg"
              alt="pattern"
              fill
              className="absolute top-0 object-cover opacity-20 lg:opacity-80 rounded-3xl"
              priority
            /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTA;

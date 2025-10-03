"use client";

import { FaArrowRight } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import Image from "next/image";
import Link from "next/link";

const CTA = () => {
  const router = useRouter();

  return (
    <div className="bg-gray-100 text-gray-800 relative">
      <div className="max-w-7xl mx-auto py-12 px-6 2xl:px-0 flex flex-col gap-6">
        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-10 text-center lg:text-start h-full
          bg-white
          p-10 md:p-16 shadow-xl rounded-3xl relative overflow-hidden"
        >
          {/* Left Section */}
          <div className="flex flex-col justify-center gap-6 h-fit z-10">
            <h1 className="text-2xl md:text-3xl 2xl:text-4xl font-extrabold leading-tight">
              Ready to Invest? {" "}
              <i className="text-orange-400">Call Us..</i>
            </h1>
            <p className="text-sm 2xl:text-base font-medium text-gray-800">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Error,
              eveniet placeat! Delectus blanditiis tempora reiciendis eum
              aliquid nihil illo, quo voluptates itaque, voluptatibus quis nobis
              libero, accusamus corrupti aut veniam.
            </p>

            {/* Buttons */}
            <div className="flex items-center text-sm 2xl:text-base gap-4 flex-wrap justify-center lg:justify-start">
              <Link
                href="/book"
                className="select-none btn-dark-base"
              >
                Book Now <FaArrowRight size={18} />
              </Link>
               <Link
                href="/contact"
                className="select-none btn-orange-outline"
              >
                Contact Us
              </Link>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex justify-center items-center absolute inset-0 lg:relative w-full h-full">
            <Image
              src="/assets/utils/pattern.png"
              alt="pattern"
              fill
              className="absolute inset-0 object-contain opacity-20 lg:opacity-60"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTA;
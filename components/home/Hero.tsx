"use client";

import { ReactTyped } from "react-typed";
import { TbArrowRight } from "react-icons/tb";
import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  return (
    <>
      <div className="bg-white/90 text-gray-900 relative pt-10">
        <div className="absolute inset-0 w-full transition-opacity duration-1000 bg-gray-100">
          <Image
            src="/assets/banner/hero_image.jpg"
            alt="banner"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-orange-900/30" />
        </div>
        <div className="max-w-7xl mx-auto 2xl:rounded-4xl">
          <div className=" relative h-screen 2xl:rounded-4xl w-full overflow-hidden flex items-center justify-center text-center">
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white z-10 gap-8 px-10 md:px-20 lg:px-40">
              <h1 className="text-4xl 2xl:text-5xl font-extrabold flex flex-col gap-2 md:flex-row">
                Find your Next{" "}
                <ReactTyped
                  className="text-4xl 2xl:text-5xl font-extrabold text-orange-400"
                  strings={["Property", "Home", "Apartment", "Villa", "Land"]}
                  typeSpeed={120}
                  backSpeed={80}
                  loop
                />
              </h1>
              <p className="text-sm 2xl:text-base font-medium max-w-3xl">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi
                odit eos, voluptas suscipit recusandae illum in, laborum itaque
                cumque.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full md:w-fit">
                <Link
                  href="/add-listing"
                  className="flex items-center gap-3 hover:gap-4 duration-500 transition-transform select-none btn-orange-base"
                >
                  Find Listing <TbArrowRight size={24} />
                </Link>
                <Link
                  href="/add-listing"
                  className="select-none btn-light-outline"
                >
                  Book Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;

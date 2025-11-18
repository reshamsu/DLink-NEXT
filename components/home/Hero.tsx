"use client";

import { ReactTyped } from "react-typed";
import { TbSearch } from "react-icons/tb";
import Image from "next/image";

const Hero = () => {
  return (
    <>
      <div className="bg-white/90 text-gray-900 relative">
        <div className="absolute inset-0 h-full w-full transition-opacity duration-1000 bg-gray-100">
          <Image
            src="/assets/banner/hero_image.jpg"
            alt="banner"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-orange-950/30" />
        </div>
        <div className="max-w-7xl mx-auto">
          {/* <div className="relative h-90 w-full overflow-hidden flex items-center justify-center text-center"> */}
          <div className="relative h-screen lg:h-[60vh] inset-0 flex flex-col justify-center items-center text-center text-white z-10 gap-14 px-6 md:px-20 lg:px-40">
            <div className="flex flex-col gap-4">
              <h1 className="text-3xl md:text-4xl 2xl:text-5xl font-extrabold flex flex-col md:flex-row gap-2 md:gap-2.5">
                Find your Next{" "}
                <ReactTyped
                  className="text-3xl md:text-4xl 2xl:text-5xl font-extrabold text-orange-400"
                  strings={["Property", "Home", "Apartment", "Villa", "Land"]}
                  typeSpeed={120}
                  backSpeed={80}
                  loop
                />
              </h1>
              <p className="text-sm 2xl:text-lg font-medium max-w-3xl">
                Find Properties for Sale, Rent or Invest
              </p>
            </div>
            <form
              method="post"
              className=" bg-white text-gray-900 text-[15px] rounded-3xl md:rounded-full shadow-xl hover:scale-105 duration-1000 w-full flex flex-col justify-between lg:flex-row"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full">
                {/* Search Property */}
                <div className="flex flex-col justify-center gap-2">
                  <input
                    id="property"
                    type="text"
                    placeholder="City. Building or Name"
                    className="bg-white/40 hover:bg-white duration-500 transition-all border border-black/10 px-8 py-4 rounded-t-3xl lg:rounded-l-full"
                    required
                  />
                </div>

                {/* Property Type */}
                <div className="flex flex-col justify-center gap-2">
                  <select
                    id="type"
                    name="type"
                    defaultValue=""
                    className="bg-white/40 hover:bg-white duration-500 transition-all border border-black/10 px-6 py-4"
                    required
                  >
                    <option value="" disabled>
                      Property Type
                    </option>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="land">Lands</option>
                    <option value="commercial">Commercial Property</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Search City */}
                <div className="flex flex-col justify-center gap-2">
                  <select
                    id="bed-bath"
                    name="bed-bath"
                    defaultValue=""
                    className="bg-white/40 hover:bg-white duration-500 transition-all border border-black/10 px-6 py-4"
                    required
                  >
                    <option value="" disabled>
                      Beds & Bath
                    </option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="flex items-end gap-3 hover:gap-4 duration-500 rounded-b-3xl lg:rounded-r-full transition-transform select-none btn-orange-base cursor-pointer"
              >
                <TbSearch size="22" /> Search
              </button>
            </form>
          </div>
        </div>
        {/* </div> */}
      </div>
    </>
  );
};

export default Hero;

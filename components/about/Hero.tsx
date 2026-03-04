"use client";
import React from "react";

const Hero = () => {
  return (
    <div className="bg-gradient-to-b from-[#fdb089]/70 via-[#ffffff] to-[#ffffff] text-gray-800 relative">
      <div className="max-w-6xl mx-auto py-16 px-6 2xl:px-0 flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-4">
          <p className="text-xs font-extrabold bg-orange-500/10 text-orange-500 w-fit px-4 py-2 rounded-full">
            ABOUT
          </p>
          <h1 className="text-3xl 2xl:text-4xl font-extrabold">
            About <span className="text-orange-500">Us</span>
          </h1>
        </div>

        {/* Content */}
        <div className="flex flex-col items-center text-center gap-8">
          <h6 className="text-sm md:text-base 2xl:text-lg max-w-2xl lg:max-w-3xl 2xl:max-w-4xl text-gray-800 leading-relaxed">
            <i className="text-orange-500 font-extrabold">D-Link Colombo</i> is
            committed to redefining modern digital solutions with reliability,
            performance, and innovation at the core. From consumer networking to
            enterprise-grade systems, we deliver technology built to empower
            homes, businesses, and organizations across Sri Lanka.
            <br />
            <br />
            Our focus is simple — provide cutting-edge connectivity, seamless
            integration, and trusted support for every customer. Whether you are
            upgrading your home network or optimizing your business
            infrastructure,{" "}
            <i className="text-orange-500 font-extrabold">
              D-Link Colombo
            </i>{" "}
            ensures a smoother, smarter, and more secure digital experience.
          </h6>

          <p className="italic text-base 2xl:text-lg font-extrabold text-black">
            Join us and step into the future of connectivity.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;

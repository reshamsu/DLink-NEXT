"use client";
import React from "react";

const Hero = () => {
  return (
    <div className="bg-gradient-to-b from-[#fdb089] via-[#ffffff] to-[#ffffff] text-gray-800 relative">
      <div className="max-w-7xl mx-auto py-16 px-6 2xl:px-0 flex flex-col gap-10">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-4">
          <span className="text-sm 2xl:text-base px-3 pb-1.5 rounded-sm font-extrabold text-orange-400 border-b-4 border-orange-400 tracking-wide">
            ABOUT
          </span>

          <h1 className="text-3xl 2xl:text-4xl font-extrabold">
            About <span className="text-orange-400">Us</span>
          </h1>

          <p className="text-xs md:text-sm 2xl:text-base font-medium max-w-3xl">
            Learn what powers our mission and the vision behind our brand.
          </p>
        </div>

        {/* Content */}
        <div className="flex flex-col items-center text-center gap-8">
          <h6 className="text-sm md:text-base 2xl:text-lg max-w-2xl lg:max-w-3xl 2xl:max-w-4xl text-gray-700 leading-relaxed">
            <i className="text-orange-400 font-extrabold">D-Link Colombo</i> 
            {" "}is committed to redefining modern digital solutions with reliability, performance, 
            and innovation at the core. From consumer networking to enterprise-grade systems, 
            we deliver technology built to empower homes, businesses, and organizations across Sri Lanka.
            <br /><br />
            Our focus is simple — provide cutting-edge connectivity, seamless integration, 
            and trusted support for every customer. Whether you are upgrading your home network 
            or optimizing your business infrastructure,{" "}
            <i className="text-orange-400 font-extrabold">D-Link Colombo</i> ensures 
            a smoother, smarter, and more secure digital experience.
          </h6>

          <p className="text-sm 2xl:text-base font-bold text-black">
            Join us and step into the future of connectivity.
          </p>
        </div>

      </div>
    </div>
  );
};

export default Hero;

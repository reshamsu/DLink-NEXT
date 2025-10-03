import React from "react";

const NewsLetter = () => {
  return (
    <div className="text-black">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-4 py-10 px-6 2xl:px-0">
        <div className="lg:col-span-2 my-4">
          <h1 className="md:text-2xl lg:text-3xl text-lg font-bold py-2 md:py-6">
            Want tips on how to optimize your property searchings
          </h1>
          <p>Sign up to our newsletter and stay up to date.</p>
        </div>
        <div className="my-4">
          <div className="flex flex-col sm:flex-row items-center justify-between w-ful">
            <input
              className="py-4 px-5 flex w-full rounded-xl bg-white text-black border border-gray-200 focus:border-[#f09712]"
              type="email"
              placeholder="Enter Email"
            />
            <button className="bg-[#f09712] hover:bg-[#ec6d06e8] text-base transition-all duration-300 hover:scale-105 w-[200px] rounded-full font-medium ml-4 my-6 py-3 text-white cursor-pointer">
              Subscribe
            </button>
          </div>
          <p className="text-sm lg:text-base">
            We care about the protection of your data. Read our{" "}
            <span className="text-[#f09712]">Privacy Policy.</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewsLetter;

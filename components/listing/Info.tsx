"use client";

import {
  TbBuildingSkyscraper,
  TbPlane,
  TbCar,
  TbBurger,
  TbMapPin,
} from "react-icons/tb";
import Link from "next/link";

const Info = () => {
  return (
    <div className="bg-white text-gray-800 -mt-14 2xl:-mt-0 z-20 relative rounded-t-3xl 2xl:rounded-t-none">
      <div className="max-w-7xl mx-auto p-8 2xl:p-10 2xl:px-0 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 lg:gap-14">
        {/* LEFT SECTION */}
        <div className="flex flex-col gap-6">
          {/* Title */}
          <div className="flex flex-col items-start text-start gap-4 2xl:gap-2">
            <h2 className="text-xl font-extrabold">Dubai Luxury Getaway</h2>
            <p className="text-xs 2xl:text-sm text-gray-400 max-w-3xl">
              Experience the ultimate blend of elegance and adventure with our
              exclusive Dubai getaway — complete with premium stays, flights,
              curated tours, and fine dining. Every moment designed for comfort
              and class.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 text-center items-center pb-4 border-b border-gray-200">
            <div className="flex flex-col gap-1">
              <p className="text-xs 2xl:text-sm font-bold">⭐ 4.8/5</p>
              <p className="text-[10px] 2xl:text-sm text-gray-500">
                Guest Rating
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs 2xl:text-sm font-bold">Top Pick</p>
              <p className="text-[10px] 2xl:text-sm text-gray-500">
                Traveler’s Choice
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs 2xl:text-sm font-bold">320+ Reviews</p>
              <p className="text-[10px] 2xl:text-sm text-gray-500">
                Verified Guests
              </p>
            </div>
          </div>

          {/* Package Overview */}
          <div className="flex flex-col gap-1.5 pb-6 border-b border-gray-200">
            <h4 className="text-sm 2xl:text-base font-extrabold">
              Package Overview
            </h4>
            <p className="text-xs 2xl:text-sm text-gray-500 max-w-3xl">
              From breathtaking skylines to golden deserts, this all-in-one
              Dubai package handles everything — flights, hotels, meals, and
              immersive excursions — so you can explore stress-free.
            </p>
          </div>

          {/* Why Book */}
          <div className="flex flex-col gap-1.5 pb-6 border-b border-gray-200">
            <h4 className="text-sm 2xl:text-base font-extrabold">
              Why Book This Package?
            </h4>
            <p className="text-xs 2xl:text-sm text-gray-500 max-w-3xl">
              You’re not just booking a trip — you’re unlocking an experience.
              With handpicked hotels, verified partners, and zero hidden costs,
              this package guarantees both luxury and peace of mind.
            </p>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-4 pb-6 border-b border-gray-200">
            <h4 className="text-sm 2xl:text-base font-extrabold">
              Full Description
            </h4>
            <p className="text-xs 2xl:text-sm text-gray-400 max-w-3xl">
              Enjoy 5 days and 4 nights in Dubai’s most iconic locations — from
              the Burj Khalifa to the desert dunes. Stay in 4-star comfort,
              enjoy international cuisine, and embark on guided adventures
              crafted for every type of traveler.
            </p>
            <Link
              href="/listing"
              className="select-none btn-dark-outline btn-dynamic"
            >
              Show more
            </Link>
          </div>

          {/* Inclusions */}
          <div className="flex flex-col gap-4 2xl:gap-6 pb-6 border-b md:border-none border-gray-200">
            <h4 className="text-sm 2xl:text-base font-extrabold">
              What’s Included
            </h4>
            <ul className="flex flex-col gap-4 text-start items-start text-gray-600">
              <li className="flex items-center gap-2 text-xs 2xl:text-sm font-semibold">
                <TbBuildingSkyscraper size={22} className="text-orange-400" /> 4-Star Hotel Accommodation
              </li>
              <li className="flex items-center gap-2 text-xs 2xl:text-sm font-semibold">
                <TbPlane size={22} className="text-orange-400" /> Roundtrip Flights
              </li>
              <li className="flex items-center gap-2 text-xs 2xl:text-sm font-semibold">
                <TbCar size={22} className="text-orange-400" /> Private Airport Transfers & Car Rentals
              </li>
              <li className="flex items-center gap-2 text-xs 2xl:text-sm font-semibold">
                <TbBurger size={22} className="text-orange-400" /> Daily Breakfast & Select Meals
              </li>
              <li className="flex items-center gap-2 text-xs 2xl:text-sm font-semibold">
                <TbMapPin size={22} className="text-orange-400" /> Guided City Tours & Excursions
              </li>
            </ul>
            <Link
              href="/listing"
              className="select-none btn-dark-outline btn-dynamic"
            >
              View All Inclusions
            </Link>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex flex-col gap-6">
          {/* Traveler’s Choice */}
          <div className="flex flex-col items-center text-center gap-2 pb-6 border-b border-gray-200">
            <h4 className="text-base 2xl:text-lg font-extrabold">
              Traveler's Choice
            </h4>
            <p className="text-xs 2xl:text-sm text-gray-400 max-w-3xl">
              Voted as one of our most loved experiences — guests rave about the
              smooth coordination, top-tier service, and stunning experiences
              that redefine what a vacation feels like.
            </p>
          </div>

          {/* Pricing Options */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm 2xl:text-base font-extrabold">
              Pricing Options
            </h4>
            <div className="grid grid-cols-1 gap-4 pb-6 border-b border-gray-200">
              {/* Basic */}
              <div className="bg-white border-2 border-gray-50 p-6 2xl:p-8 flex items-center gap-2 md:gap-3 justify-between shadow-md hover:scale-105 hover:border-orange-400 duration-500 rounded-3xl">
                <div className="flex flex-col gap-1">
                  <h3 className="text-base font-extrabold">Basic</h3>
                  <p className="text-[10px] 2xl:text-sm text-gray-500">
                    Ideal for solo travelers — includes roundtrip flights,
                    standard stay, and half-day city tour.
                  </p>
                </div>
                <Link
                  href="/listing"
                  className="select-none btn-orange-sm btn-dynamic"
                >
                  Select
                </Link>
              </div>

              {/* Standard */}
              <div className="bg-white border-2 border-gray-50 p-6 2xl:p-8 flex items-center gap-2 md:gap-3 justify-between shadow-md hover:scale-105 hover:border-orange-400 duration-500 rounded-3xl">
                <div className="flex flex-col gap-1">
                  <h3 className="text-base font-extrabold">Standard</h3>
                  <p className="text-[10px] 2xl:text-sm text-gray-500">
                    Great for couples or families — premium hotel upgrades,
                    breakfast buffet, and guided desert safari.
                  </p>
                </div>
                <Link
                  href="/listing"
                  className="select-none btn-orange-sm btn-dynamic"
                >
                  Select
                </Link>
              </div>

              {/* Premium */}
              <div className="bg-white border-2 border-gray-50 p-6 2xl:p-8 flex items-center gap-2 md:gap-3 justify-between shadow-md hover:scale-105 hover:border-orange-400 duration-500 rounded-3xl">
                <div className="flex flex-col gap-1">
                  <h3 className="text-base font-extrabold">Premium</h3>
                  <p className="text-[10px] 2xl:text-sm text-gray-500">
                    The full luxury experience — private transfers, rooftop
                    dining, and exclusive excursions curated just for you.
                  </p>
                </div>
                <Link
                  href="/listing"
                  className="select-none btn-orange-sm btn-dynamic"
                >
                  Select
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Info;
import React from "react";
import Link from "next/link";
import { TbPhone, TbMail, TbMapPin } from "react-icons/tb";
import { FaWhatsapp } from "react-icons/fa";

const Info = () => {
  return (
    <div className="bg-linear-to-b from-[#ffffff] via-[#ffffff] to-teal-600/20 text-gray-700">
      <div className="max-w-6xl mx-auto py-14 md:py-20 px-8 md:px-10 2xl:px-0">
        <div className="flex flex-col justify-center gap-8">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl 2xl:text-3xl font-bold text-gray-600">
              Reach out to Us
            </h2>
            <p className="text-xs md:text-sm font-normal text-justify text-gray-600 max-w-3xl">
              Reach out to us for bookings, tours, flights, visa support, or
              anything else.
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-[15px]">
            {/* PHONE */}
            <div className="bg-orange-600/80 text-white border-4 border-orange-700/40 hover:bg-orange-600 hover:border-orange-600/60 p-7 flex flex-col items-start justify-center gap-4 rounded-4xl hover:scale-105 duration-1000 group shadow-xl">
              <Link
                href="tel:94761676603"
                className="p-3 bg-white duration-700 rounded-2xl shadow-sm w-fit"
              >
                <TbPhone
                  size={30}
                  className="text-3xl text-orange-600 group-hover:text-orange-700 transition-all"
                />
              </Link>
              <label
                htmlFor="
              "
                className="flex flex-col gap-0.5 text-lg font-bold"
              >
                Call Us
                <Link
                  href="https://wa.me/94761676603"
                  className="text-sm md:text-base font-semibold hover:underline"
                >
                  +94 76 167 6603
                </Link>
              </label>
            </div>

            {/* WHATSAPP */}
            <div className="bg-teal-500 text-white border-4 border-teal-700/40 hover:bg-teal-600 hover:border-teal-600/60 p-7 flex flex-col items-start justify-center gap-4 rounded-4xl hover:scale-105 duration-1000 group shadow-xl">
              <Link
                href="https://wa.me/94761676603"
                className="p-3 bg-white duration-700 rounded-2xl shadow-sm w-fit"
              >
                <FaWhatsapp
                  size={30}
                  className="text-3xl text-teal-600 group-hover:text-teal-600 transition-all"
                />
              </Link>
              <label
                htmlFor="
              "
                className="flex flex-col gap-0.5 text-lg font-bold"
              >
                Message Us
                <Link
                  href="https://wa.me/94761676603"
                  className="text-sm md:text-base font-semibold hover:underline"
                >
                  +94 76 167 6603
                </Link>
              </label>
            </div>

            {/* EMAIL */}
            <div className="bg-blue-500 text-white border-4 border-blue-700/40 hover:bg-blue-600 hover:border-blue-600/60 p-7 flex flex-col items-start justify-center gap-4 rounded-4xl hover:scale-105 duration-1000 group shadow-lg">
              <Link
                href="mailto:dlink.colombo@gmail.com"
                className="p-3 bg-white duration-700 rounded-2xl shadow-sm w-fit"
              >
                <TbMail
                  size={30}
                  className="text-3xl text-blue-500 group-hover:text-blue-600 transition-all"
                />
              </Link>
              <label
                htmlFor="
              "
                className="flex flex-col gap-0.5 text-lg font-bold"
              >
                Email Us
                <Link
                  href="mailto:shihan.suhood@thetravquest.com"
                  className="text-sm md:text-base font-medium hover:underline break-all"
                >
                  dlink.colombo@gmail.com
                </Link>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Info;

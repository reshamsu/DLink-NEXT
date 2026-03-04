"use client";

import React from "react";
import { FaSearchLocation, FaCity, FaHandshake } from "react-icons/fa";
import { motion } from "framer-motion";
import Image from "next/image";

// Animation variant
// const fadeInUp = {
//   hidden: { opacity: 0, y: 40 },
//   visible: (i = 1) => ({
//     opacity: 1,
//     y: 0,
//     transition: {
//       delay: i * 0.2,
//       duration: 0.6,
//       ease: "easeOut",
//     },
//   }),
// };

const WhyChooseUs = () => {
  return (
    <section className="bg-gray-950 text-gray-50">
      <div className="max-w-6xl md:mx-8 2xl:mx-auto py-16 px-8 md:px-4 2xl:px-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-18">
          {/* Image with dark overlay */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="absolute md:relative left-0 w-full h-[60vh] sm:h-[70vh]"
          >
            <Image
              src="/assets/banner/property5.jpg"
              alt="Why Choose Us"
              width={800}
              height={800}
              className="object-cover w-full h-[60vh] sm:h-[70vh] rounded-t-[400px] rounded-b-[20px] shadow-lg"
            />
            <div className="absolute inset-0 bg-black/70 lg:bg-black/20 rounded-t-[400px] lg:rounded-b-[40px]"></div>
          </motion.div>

          {/* Content */}
          <div className="relative flex flex-col items-start justify-center text-white font-medium">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mb-14"
            >
              <p className="text-xs font-extrabold bg-orange-500/10 text-orange-500 w-fit px-4 py-2 rounded-full">
                OUR EXPERTISE
              </p>
              <h1 className="text-3xl lg:text-4xl font-extrabold my-6">
                Why Choose Us?
              </h1>
              <p className="text-sm text-gray-400 max-w-md mx-auto">
                With a deep understanding of the local market and a passion for
                connecting people with the right properties, we provide a
                seamless, trustworthy, and high-value real estate experience.
              </p>
            </motion.div>

            {/* Highlights */}
            <div className="flex flex-col gap-8 2xl:gap-10 w-full">
              {[
                {
                  icon: (
                    <FaSearchLocation className="text-orange-400 text-6xl" />
                  ),
                  title: "Personalized Property Search",
                  text: "We tailor each property search to match your unique needs, preferences, and budget—no guesswork, just results.",
                },
                {
                  icon: <FaCity className="text-orange-400 text-6xl" />,
                  title: "Prime Listings in Colombo",
                  text: "Gain access to verified, high-value properties across the most sought-after locations in Colombo and beyond.",
                },
                {
                  icon: <FaHandshake className="text-orange-400 text-6xl" />,
                  title: "Trusted Guidance & Support",
                  text: "From first viewing to final paperwork, our expert team is by your side—transparent, responsive, and reliable.",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  custom={index + 1}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="flex items-start gap-6"
                >
                  {item.icon}
                  <div>
                    <h2 className="text-md font-semibold mb-1">{item.title}</h2>
                    <p className="text-xs text-gray-400 md:text-gray-500">
                      {item.text}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;

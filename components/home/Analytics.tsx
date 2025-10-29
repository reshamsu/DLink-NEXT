"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import Image from "next/image";

const cardData = [
  {
    icon: "/assets/banner/homes.png",
    title: "Homes",
    content:
      "Find your dream home with ease. From modern villas to cozy family houses, we connect you with properties tailored to your lifestyle and budget.",
  },
  {
    icon: "/assets/banner/apartments.png",
    title: "Apartments",
    content:
      "Explore a wide range of apartments in prime locations. Whether you want a city-view penthouse or a comfortable starter flat, we’ve got you covered.",
  },
  {
    icon: "/assets/banner/lands.png",
    title: "Lands",
    content:
      "Invest smartly with premium land options. From residential plots to commercial spaces, we help you secure land in growing and valuable locations.",
  },
];

// Type-safe Framer Motion variants
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: custom * 0.2 + 0.4, // stagger effect
      duration: 0.3,
      ease: "easeOut",
    },
  }),
};

const Analytics: React.FC = () => {
  return (
    <div className="bg-orange-600/10 text-black">
      <div className="max-w-7xl mx-auto py-14 px-6 2xl:px-0">
        <div className="mb-12 px-2 text-center">
          <p className="text-[#f09712] text-lg font-extrabold">SERVICE</p>
          <h1 className="text-3xl md:text-4xl font-extrabold my-3">
            Our Expertise
          </h1>
          <p className="text-sm 2xl:text-base font-semibold text-gray-600">
            Full-Service Agents, Modern Technology
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 lg:gap-8">
          {cardData.map((card, index) => (
            <motion.div
              key={index}
              custom={index} // pass index as custom
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={cardVariants}
              className="bg-white p-10 rounded-3xl flex flex-col items-center text-center hover:scale-105 duration-300 transition-all shadow-xl hover:shadow-2xl"
            >
              <div className="w-24 h-24 mb-4 flex items-center justify-center bg-[#f09712] rounded-full shadow-inner relative">
                <Image
                  src={card.icon}
                  alt={card.title}
                  width={80}
                  height={80}
                  className="rounded-full object-contain"
                />
              </div>

              <h2 className="text-md lg:text-xl font-semibold mb-4">
                {card.title}
              </h2>
              <p className="text-gray-500 text-xs lg:text-sm">{card.content}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;

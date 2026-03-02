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
    <section className="bg-white text-black">
      <div className="max-w-6xl mx-auto py-16 px-8 2xl:px-0">
        <div className="flex flex-col gap-3">
          <p className="text-sm font-extrabold bg-orange-500/10 text-orange-500 w-fit px-4 py-2 rounded-full">
            SERVICE
          </p>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold my-3">
              Our Expertise
            </h1>
            <p className="text-sm 2xl:text-base font-semibold text-gray-600">
              Full-Service Agents, Modern Technology
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 lg:gap-8 mt-6">
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
              <div className="w-24 h-24 mb-4 flex items-center justify-center bg-orange-500 rounded-full shadow-inner relative">
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
    </section>
  );
};

export default Analytics;

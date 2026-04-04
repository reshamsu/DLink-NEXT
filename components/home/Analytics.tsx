"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { TbHomeFilled, TbBuildingSkyscraper, TbTrees } from "react-icons/tb";

const cardData = [
  {
    Icon: TbHomeFilled,
    label: "01",
    title: "Homes",
    content:
      "Find your dream home with ease. From modern villas to cozy family houses, we connect you with properties tailored to your lifestyle and budget.",
  },
  {
    Icon: TbBuildingSkyscraper,
    label: "02",
    title: "Apartments",
    content:
      "Explore a wide range of apartments in prime locations. Whether you want a city-view penthouse or a comfortable starter flat, we've got you covered.",
  },
  {
    Icon: TbTrees,
    label: "03",
    title: "Lands",
    content:
      "Invest smartly with premium land options. From residential plots to commercial spaces, we help you secure land in growing and valuable locations.",
  },
];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

const Analytics: React.FC = () => {
  return (
    <section className="bg-gray-100 text-gray-800">
      <div className="max-w-6xl mx-auto py-16 px-8 2xl:px-0">
        <div className="flex flex-col gap-3 mb-10">
          <p className="text-xs font-extrabold bg-orange-500/10 text-orange-500 w-fit px-4 py-2 rounded-full">
            SERVICE
          </p>
          <h1 className="text-2xl 2xl:text-3xl font-extrabold">Our Expertise</h1>
          <p className="text-sm text-gray-400">
            Full-Service Agents, Modern Technology
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cardData.map((card, index) => (
            <motion.div
              key={index}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={cardVariants}
              className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col gap-5 group"
            >
              <div className="flex items-start justify-between">
                <div className="w-14 h-14 flex items-center justify-center bg-orange-500 rounded-2xl group-hover:bg-orange-600 transition-colors duration-300">
                  <card.Icon size={28} className="text-white" />
                </div>
                <span className="text-4xl font-extrabold text-gray-100 select-none leading-none">
                  {card.label}
                </span>
              </div>

              <div>
                <h2 className="text-lg font-extrabold mb-2">{card.title}</h2>
                <p className="text-xs text-gray-400 leading-relaxed">{card.content}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Analytics;

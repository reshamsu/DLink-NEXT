import React from "react";
import {
  FaHandshake,
  FaStar,
  FaFire,
  FaLightbulb,
  FaUserTie,
  FaLeaf,
  FaGlobeAsia,
  FaSuitcaseRolling,
  FaBuilding,
} from "react-icons/fa";

const Values = () => {
  const items = [
    {
      icon: <FaHandshake className="text-3xl text-orange-500" />,
      title: "Integrity",
      description: "Authenticity and transparency in every journey.",
    },
    {
      icon: <FaStar className="text-3xl text-orange-500" />,
      title: "Service Excellence",
      description: "Going beyond expectations with precision and care.",
    },
    {
      icon: <FaFire className="text-3xl text-orange-500" />,
      title: "Passion",
      description: "Driven by a genuine love for travel and expertise.",
    },
    {
      icon: <FaLightbulb className="text-3xl text-orange-500" />,
      title: "Innovation",
      description: "Tech-driven solutions keeping you ahead.",
    },
    {
      icon: <FaUserTie className="text-3xl text-orange-500" />,
      title: "Professionalism",
      description: "Guided by experts with 25+ years of industry experience.",
    },
    {
      icon: <FaLeaf className="text-3xl text-orange-500" />,
      title: "Sustainability",
      description: "Committed to responsible travel and community impact.",
    },
    {
      icon: <FaGlobeAsia className="text-3xl text-orange-500" />,
      title: "Personalized Travel",
      description: "Handpicked destinations and tailored itineraries.",
    },
    {
      icon: <FaSuitcaseRolling className="text-3xl text-orange-500" />,
      title: "Seamless Services",
      description:
        "Meet & greet, transfers, hotels, tours, attractions, visas.",
    },
    {
      icon: <FaBuilding className="text-3xl text-orange-500" />,
      title: "Corporate Events",
      description: "Professional handling of launches, events, and functions.",
    },
  ];

  return (
    <div className="bg-gray-100 text-gray-700 relative">
      <div className="max-w-6xl mx-auto py-20 px-8 2xl:px-0 flex flex-col gap-10">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-start gap-6">
          <div className="flex flex-col gap-2.5">
            <label
              htmlFor=""
              className="text-base lg:text-lg font-bold text-orange-500"
            >
              OUR VALUES
            </label>
            <h2 className="playfair text-3xl 2xl:text-4xl font-bold">
              What <span className="text-orange-500">We Do</span>
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-xs md:text-sm font-normal text-center lg:text-justify text-gray-600">
              At <strong>The TravQuest Travel & Tourism</strong>, we specialize
              in curating unforgettable journeys. Our mission is to turn your
              travel dreams into reality.
            </p>
            <p className="text-xs md:text-sm font-normal text-center lg:text-justify text-gray-600">
              Explore our handpicked destinations, expertly crafted itineraries,
              and personalized experiences. Whether you seek adventure,
              relaxation, or cultural immersion, we're here to create your
              perfect getaway.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <div
              key={index}
              className="bg-white p-8 flex flex-col items-start justify-center gap-6 rounded-3xl hover:scale-105 duration-1000 group shadow-lg"
            >
              <div className="p-3 bg-orange-500/10 rounded-2xl shadow-sm w-fit">
                {item.icon}
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-base lg:text-lg font-extrabold capitalize text-gray-600">
                  {item.title}
                </h3>
                <p className="text-xs md:text-sm font-normal text-gray-600">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Values;
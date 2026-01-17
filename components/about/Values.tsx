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
      title: "Integrity & Transparency",
      description:
        "Clear documentation, honest pricing, and zero hidden surprises.",
    },
    {
      icon: <FaStar className="text-3xl text-orange-500" />,
      title: "Service Excellence",
      description:
        "White-glove service from first viewing to final handover.",
    },
    {
      icon: <FaFire className="text-3xl text-orange-500" />,
      title: "Market Expertise",
      description:
        "Deep knowledge of Colombo’s prime residential and commercial zones.",
    },
    {
      icon: <FaLightbulb className="text-3xl text-orange-500" />,
      title: "Smart Advisory",
      description:
        "Data-driven insights to help you buy, sell, or invest confidently.",
    },
    {
      icon: <FaUserTie className="text-3xl text-orange-500" />,
      title: "Professional Representation",
      description:
        "Handled by experienced property consultants and negotiators.",
    },
    {
      icon: <FaLeaf className="text-3xl text-orange-500" />,
      title: "Sustainable Living",
      description:
        "Promoting modern developments with long-term value and efficiency.",
    },
    {
      icon: <FaGlobeAsia className="text-3xl text-orange-500" />,
      title: "Local & Overseas Clients",
      description:
        "Trusted by Sri Lankan and international buyers alike.",
    },
    {
      icon: <FaSuitcaseRolling className="text-3xl text-orange-500" />,
      title: "End-to-End Support",
      description:
        "From viewings and negotiations to legal coordination and closing.",
    },
    {
      icon: <FaBuilding className="text-3xl text-orange-500" />,
      title: "Residential & Commercial",
      description:
        "Apartments, houses, land, offices, and investment properties.",
    },
  ];

  return (
    <div className="bg-gray-100 text-gray-700 relative">
      <div className="max-w-6xl mx-auto py-20 px-8 2xl:px-0 flex flex-col gap-10">
        {/* HEADER */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-start gap-6">
          <div className="flex flex-col gap-4">
            <label className="text-base lg:text-lg font-bold text-orange-600">
              OUR CORE VALUES
            </label>
            <h2 className="playfair text-3xl 2xl:text-4xl font-bold">
              Why <span className="text-orange-500">Clients Trust Us</span>
            </h2>
          </div>

          <div className="flex flex-col gap-3 max-w-4xl">
            <p className="text-sm md:text-base font-normal text-center lg:text-justify text-gray-600">
              At <strong>D-Link Colombo</strong>, we are more than property
              brokers. We are long-term advisors committed to protecting your
              investment and maximizing value.
            </p>
            <p className="text-sm md:text-base font-normal text-center lg:text-justify text-gray-600">
              Whether you’re purchasing a home, selling a property, or investing
              in Colombo’s real estate market, our approach is built on trust,
              expertise, and results.
            </p>
          </div>
        </div>

        {/* VALUES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <div
              key={index}
              className="bg-white p-8 flex flex-col items-start gap-6 rounded-3xl hover:scale-[1.03] transition duration-700 shadow-lg"
            >
              <div className="p-3 bg-orange-500/10 rounded-2xl w-fit">
                {item.icon}
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-base lg:text-lg font-extrabold text-gray-700">
                  {item.title}
                </h3>
                <p className="text-xs md:text-sm text-gray-400">
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

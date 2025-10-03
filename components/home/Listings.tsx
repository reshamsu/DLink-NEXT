"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import supabase from "../config/supabaseClient";
import { TbBed, TbBath } from "react-icons/tb";
import Link from "next/link";

// fallback image in /public/assets
const fallbackImage = "/assets/modern.webp";

const rowVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      ease: "easeOut",
    },
  }),
};

const Listings = () => {
  const [listingsData, setListingsData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchListings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching listings:", error);
      setListingsData([]);
    } else {
      const formattedData = data.map((listing) => {
        let images = [];

        if (Array.isArray(listing.image_urls)) {
          images = listing.image_urls;
        } else if (typeof listing.image_urls === "string") {
          try {
            images = JSON.parse(listing.image_urls);
          } catch {
            images = [];
          }
        }

        return {
          id: listing.id,
          title: listing.property_title,
          location: `${listing.city} - ${listing.location}`,
          is_furnished: listing.is_furnished,
          bedrooms: listing.bedrooms,
          bathrooms: listing.bathrooms,
          type: listing.property_type,
          status: listing.status,
          image: images.length > 0 ? images[0] : fallbackImage,
        };
      });

      setListingsData(formattedData);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-6 2xl:px-0 text-gray-800">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between text-center md:text-start items-center mb-8">
        <div>
          <p className="text-[#f09712] text-base font-bold mb-1">LISTINGS</p>
          <h1 className="text-xl font-semibold mb-4 md:mb-0">
            Featured Listings
          </h1>
        </div>

        <input
          type="text"
          placeholder="Find Listing"
          className="border-2 border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#f09712] px-6 py-2.5 w-full md:w-64 rounded-full mt-4 md:mt-0"
        />
      </div>

      {/* Loader */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-8 h-8 border-4 border-[#f09712] border-t-transparent rounded-full animate-spin"></div>
          <p className="ml-3 text-gray-500">Loading listings...</p>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
          initial="hidden"
          animate="visible"
        >
          {listingsData.map((listing, index) => (
            <motion.div
              key={listing.id}
              custom={index}
              variants={rowVariants}
              className="bg-white rounded-xl overflow-hidden group duration-300 transition-transform flex flex-col h-full"
            >
              {/* Image */}
              <div className="w-full h-64 relative rounded-3xl overflow-hidden">
                <Image
                  src={listing.image}
                  alt={listing.title}
                  layout="fill"
                  objectFit="cover"
                  className="transform transition-transform duration-500 group-hover:scale-110 rounded-3xl"
                />
                <div className="absolute inset-0 bg-black opacity-20 group-hover:opacity-30 transition-opacity duration-500 rounded-3xl"></div>
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 py-4 px-2">
                <Link href={`/property/listing/${listing.id}`}>
                  <Link href=""
                    onClick={scrollToTop}
                    className="text-base lg:text-sm font-semibold hover:text-[#f09712] hover:underline line-clamp-1"
                  >
                    {listing.title}
                  </Link>
                </Link>

                <p className="text-sm lg:text-[12px] text-gray-600 my-1">
                  {listing.location}
                </p>

                <div className="my-2 flex items-center gap-2 text-xs font-semibold flex-wrap line-clamp-1">
                  <p className="flex items-center gap-1.5">
                    <TbBed size={16} className="text-orange-300" />
                    {listing.bedrooms} Bed
                  </p>
                  <span className="text-gray-300">|</span>
                  <p className="flex items-center gap-1.5">
                    <TbBath size={16} className="text-orange-300" />
                    {listing.bathrooms} Bath
                  </p>
                </div>

                <p className="text-xs text-blue-500 font-semibold">
                  {listing.is_furnished}
                </p>

                <div className="flex justify-between items-center my-3">
                  <span className="inline-block bg-green-300 text-[11px] font-semibold px-3 py-1.5 rounded-lg">
                    {listing.status}
                  </span>
                  <p className="text-sm text-[#f09712] font-semibold">
                    {listing.type}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Listings;

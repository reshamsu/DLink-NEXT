"use client";

import React, { useEffect, useState } from "react";
import { motion, Variants, Transition } from "framer-motion";
import { TbBuilding, TbSquareCheck, TbBed, TbBath, } from "react-icons/tb";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

/* ----------------------------------
   TYPES
----------------------------------- */

type FurnishingStatus = "Fully-Furnished" | "Semi-Furnished" | "UnFurnished";
interface SupabaseListing {
  id: number;
  property_title: string;
  property_subtitle: string;
  city: string;
  location: string;
  is_furnished: FurnishingStatus;
  bedrooms: number;
  bathrooms: number;
  floors: number;
  perches: number;
  price: string;
  property_type: string;
  status: string;
  image_urls: string[] | string | null;
  created_at: string;
}

interface Listing {
  id: number;
  title: string;
  subtitle: string;
  location: string;
  is_furnished: FurnishingStatus;
  bedrooms: number;
  bathrooms: number;
  floors: number;
  perches: number;
  price: string;
  type: string;
  status: string;
  image: string;
}

const easeOut: Transition["ease"] = [0.25, 0.1, 0.25, 1];

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: easeOut },
  }),
};

const getFurnishingLabel = (value: FurnishingStatus) => {
  switch (value) {
    case "Fully-Furnished":
      return "Fully-Furnished";
    case "Semi-Furnished":
      return "Semi-Furnished";
    default:
      return "Unfurnished";
  }
};

const Listings: React.FC = () => {
  const [listingsData, setListingsData] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);

      if (!supabase) {
        console.warn("Supabase client not initialized.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("listing")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching listings:", error.message);
        setListingsData([]);
        setLoading(false);
        return;
      }

      const formatted: Listing[] = (data as SupabaseListing[]).map(
        (listing) => {
          let images: string[] = [];

          if (Array.isArray(listing.image_urls)) {
            images = listing.image_urls;
          } else if (typeof listing.image_urls === "string") {
            try {
              const parsed = JSON.parse(listing.image_urls);
              if (Array.isArray(parsed)) images = parsed;
            } catch {
              images = [];
            }
          }

          return {
            id: listing.id,
            title: listing.property_title,
            subtitle: listing.property_subtitle,
            location: `${listing.city} - ${listing.location}`,
            is_furnished: listing.is_furnished,
            bedrooms: listing.bedrooms,
            bathrooms: listing.bathrooms,
            floors: listing.floors,
            perches: listing.perches,
            price: listing.price,
            type: listing.property_type,
            status: listing.status,
            image:
              images.length > 0 ? images[0] : "/assets/banner/property5.webp",
          };
        }
      );

      setListingsData(formatted);
      setLoading(false);
    };

    fetchListings();
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  /* ----------------------------------
     UI
  ----------------------------------- */

  return (
    <div className=" bg-gray-100 text-gray-800">
      <div className="max-w-6xl mx-auto py-20 px-6 2xl:px-0">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 text-center md:text-start">
          <div>
            <p className="text-[#f09712] text-base font-extrabold mb-1">
              LISTINGS
            </p>
            <h1 className="text-2xl font-bold">Featured Listings</h1>
          </div>
        </div>

        {/* STATES */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-4 border-[#f09712] border-t-transparent rounded-full animate-spin" />
            <p className="ml-3 text-gray-500">Loading listings...</p>
          </div>
        ) : listingsData.length === 0 ? (
          <p className="text-center text-gray-500 py-20">No listings found.</p>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            initial="hidden"
            animate="visible"
          >
            {listingsData.map((listing, index) => (
              <motion.div
                key={listing.id}
                custom={index}
                variants={rowVariants}
                className="bg-white p-4 rounded-3xl shadow-lg overflow-hidden group flex flex-col h-full"
              >
                {/* IMAGE */}
                <div className="relative h-64 overflow-hidden rounded-2xl">
                  <Image
                    src={listing.image}
                    alt={listing.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all duration-700 rounded-2xl" />
                </div>

                {/* CONTENT */}
                <div className="flex flex-col gap-2.5 pt-4 pb-1.5 px-2">
                  <div>
                    <Link
                      href={`/listing/${listing.id}`}
                      onClick={scrollToTop}
                      className="text-sm font-bold hover:text-[#f09712] line-clamp-1"
                    >
                      {listing.title}
                    </Link>
                    <p className="text-xs text-gray-600 my-1 line-clamp-1">
                      {listing.subtitle}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-bold py-2.5 border-t border-b border-gray-100">
                    <p className="flex items-center gap-1.5">
                      <TbBuilding size={16} className="text-orange-400" />
                      {listing.floors}
                    </p>

                    <p className="flex items-center gap-1.5">
                      <TbSquareCheck size={16} className="text-orange-400" />
                      {listing.perches} Perch
                    </p>
                    <p className="flex items-center gap-1.5">
                      <TbBed size={16} className="text-orange-400" />
                      {listing.bedrooms} Bed
                    </p>
                    <p className="flex items-center gap-1.5">
                      <TbBath size={16} className="text-orange-400" />
                      {listing.bathrooms} Bath
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-blue-500 font-bold">
                      {getFurnishingLabel(listing.is_furnished)}
                    </p>
                  </div>

                  <div className="flex justify-between items-end mt-1">
                    <span className="bg-green-300 text-[11px] font-bold px-3 py-1.5 rounded-lg">
                      {listing.status}
                    </span>
                    <p className="text-xs text-orange-500 font-bold">
                      LKR {listing.price}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Listings;

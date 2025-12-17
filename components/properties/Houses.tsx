"use client";

import React, { useEffect, useState } from "react";
import { motion, Variants, Transition } from "framer-motion";
import { TbBuilding, TbSquareCheck } from "react-icons/tb";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

interface SupabaseListing {
  id: number;
  property_title: string;
  city: string;
  location: string;
  is_furnished: boolean;
  bedrooms: number;
  bathrooms: number;
  floors: number;
  perches: number;
  property_type: string;
  status: string;
  image_urls: string[] | string | null;
  created_at: string;
}

interface Listing {
  id: number;
  title: string;
  location: string;
  is_furnished: boolean;
  bedrooms: number;
  bathrooms: number;
  floors: number;
  perches: number;
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

const Houses: React.FC = () => {
  const [listingsData, setListingsData] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("listing")
        .select("*")
        .eq("property_type", "House") 
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching listing:", error);
        setListingsData([]);
        setLoading(false);
        return;
      }

      if (data) {
        const formatted: Listing[] = (data as SupabaseListing[]).map((l) => {
          let images: string[] = [];

          if (Array.isArray(l.image_urls)) images = l.image_urls;
          else if (typeof l.image_urls === "string") {
            try {
              images = JSON.parse(l.image_urls);
            } catch {
              images = [];
            }
          }

          return {
            id: l.id,
            title: l.property_title,
            location: `${l.city} - ${l.location}`,
            is_furnished: l.is_furnished,
            bedrooms: l.bedrooms,
            bathrooms: l.bathrooms,
            floors: l.floors,
            perches: l.perches,
            type: l.property_type,
            status: l.status,
            image:
              images.length > 0 ? images[0] : "/assets/banner/property5.webp",
          };
        });

        setListingsData(formatted);
      }

      setLoading(false);
    };

    fetchListings();
  }, []);

  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="max-w-6xl mx-auto py-14 px-6 2xl:px-0 text-gray-800">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-start mb-8 gap-4">
        <div>
          <p className="text-[#f09712] text-base font-extrabold mb-1">
            HOUSES
          </p>
          <h1 className="text-2xl font-bold mb-0">Available Houses</h1>
        </div>
      </div>

      {/* Loader */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-8 h-8 border-4 border-[#f09712] border-t-transparent rounded-full animate-spin"></div>
          <p className="ml-3 text-gray-500">Loading houses...</p>
        </div>
      ) : listingsData.length === 0 ? (
        <p className="text-center text-gray-500 py-8 h-screen">No houses found.</p>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
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
              <div className="w-full h-64 md:h-50 lg:h-55 relative overflow-hidden rounded-3xl">
                <Image
                  src={listing.image}
                  alt={listing.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110 rounded-3xl"
                />
                <div className="absolute inset-0 bg-black/90 opacity-20 group-hover:opacity-0 transition-opacity duration-700 rounded-3xl"></div>
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 py-4 px-2">
                <Link
                  href={`/listing/${listing.id}`}
                  onClick={scrollToTop}
                  className="text-base lg:text-sm font-bold hover:text-[#f09712] hover:underline line-clamp-1"
                >
                  {listing.title}
                </Link>

                <p className="text-xs text-gray-600 my-1">{listing.location}</p>

                <div className="flex items-center gap-2 text-xs font-bold flex-wrap my-2">
                  <p className="flex items-center gap-1.5">
                    <TbBuilding size={18} className="text-orange-300" />
                    {listing.floors} Floors
                  </p>
                  <span className="text-gray-300">|</span>
                  <p className="flex items-center gap-1.5">
                    <TbSquareCheck size={18} className="text-orange-300" />
                    {listing.perches} Perches
                  </p>
                </div>

                <p className="text-xs text-blue-500 font-bold">
                  {listing.is_furnished ? "Furnished" : "Unfurnished"}
                </p>

                <div className="flex justify-between items-center mt-3">
                  <span className="inline-block bg-green-300 text-[11px] font-bold px-3 py-1.5 rounded-lg">
                    {listing.status}
                  </span>
                  <p className="text-sm text-[#f09712] font-bold">
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

export default Houses;

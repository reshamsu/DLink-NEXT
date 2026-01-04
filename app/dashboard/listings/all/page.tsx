"use client";

import React, { useEffect, useState } from "react";
import { motion, Variants, Transition } from "framer-motion";
import {
  TbBuilding,
  TbSquareCheck,
  TbBed,
  TbBath,
  TbShare,
  TbPencil,
} from "react-icons/tb";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

type FurnishingStatus = "Fully-Furnished" | "Semi-Furnished" | "UnFurnished";
interface Listings {
  id: number;
  property_title: string;
  property_subtitle: string;
  property_type: string;
  listing_type: string;
  city: string;
  location: string;
  description: string;

  bedrooms: string;
  bathrooms: string;
  perches: string;
  sqft: string;

  floor_reference: string;
  floors: string;
  building_age: string;

  price: string;
  full_price: string;
  price_negotiable: boolean;

  property_documents: string[];
  lift_access: string;
  vehicle_park: string;
  remarks: string;
  approx: boolean;
  amenities: string[];

  status: string;
  is_furnished: FurnishingStatus;

  image_urls: string[];
}

const easeOut: Transition["ease"] = [0.25, 0.1, 0.25, 1];

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: easeOut },
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
  const [listings, setListingsData] = useState<Listings[]>([]);
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

      const formatted: Listings[] = data.map((row: any) => ({
        ...row,
        image_urls: Array.isArray(row.image_urls) ? row.image_urls : [],
        amenities: Array.isArray(row.amenities) ? row.amenities : [],
        property_documents: Array.isArray(row.property_documents)
          ? row.property_documents
          : [],
      }));

      setListingsData(formatted);
      setLoading(false);
    };

    fetchListings();
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="bg-gray-100 text-gray-700">
      <div className="max-w-6xl mx-auto lg:ml-80 pt-24 lg:pt-16 pb-10 px-6 md:px-10 lg:px-0 flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h2 className="playfair text-3xl font-bold">
            All <span className="text-orange-500">Listings</span>
          </h2>
          <label className="text-base lg:text-lg font-bold">
            Find all your website listings here.
          </label>
        </div>

        <p className="text-xs lg:text-sm font-normal text-justify text-gray-600">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit.
        </p>

        {/* STATES */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            <p className="ml-3 text-gray-500">Loading listings...</p>
          </div>
        ) : listings.length === 0 ? (
          <p className="text-center text-gray-500 py-20">No listings found.</p>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            initial="hidden"
            animate="visible"
          >
            {listings.map((listing, index) => (
              <motion.div
                key={listing.id}
                custom={index}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                className="bg-white p-4 rounded-4xl shadow-lg overflow-hidden group flex flex-col justify-around h-full"
              >
                <div className="relative h-64 overflow-hidden rounded-3xl">
                  <Image
                    src={
                      listing.image_urls?.[0] || "/assets/banner/property1.webp"
                    }
                    alt={listing.property_title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all duration-700 rounded-2xl" />
                  <div>
                    <Link
                   href={`/listing/${listing.id}/edit`}
                      className="absolute top-3 right-3 bg-white hover:bg-gray-100 hover:text-orange-500 p-2 rounded-xl hover:scale-105 transition-all duration-500"
                    >
                      <TbPencil size={22} />
                    </Link>
                    <Link
                      href="/dashboard/listings"
                      className="absolute top-3 right-14 bg-white hover:bg-gray-100 hover:text-orange-500 p-2 rounded-xl hover:scale-105 transition-all duration-500"
                    >
                      <TbShare size={22} />
                    </Link>
                  </div>
                </div>

                {/* CONTENT */}
                <div className="flex flex-col gap-2.5 pt-4 pb-1.5 px-2">
                  <div>
                    <Link
                      href={`/listing/${listing.id}`}
                      onClick={scrollToTop}
                      className="text-sm font-bold hover:text-orange-500 line-clamp-1"
                    >
                      {listing.property_title}
                    </Link>
                    <p className="text-xs text-gray-600 my-1 line-clamp-1">
                      {listing.property_subtitle}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-bold py-2.5 border-t border-b border-gray-100">
                    <p className="flex items-center gap-1.5">
                      <TbBuilding size={16} className="text-orange-500" />
                      {listing.floors}
                    </p>

                    <p className="flex items-center gap-1.5">
                      <TbSquareCheck size={16} className="text-orange-500" />
                      {listing.perches} Perch
                    </p>
                    <p className="flex items-center gap-1.5">
                      <TbBed size={16} className="text-orange-500" />
                      {listing.bedrooms} Bed
                    </p>
                    <p className="flex items-center gap-1.5">
                      <TbBath size={16} className="text-orange-500" />
                      {listing.bathrooms} Bath
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-blue-500 font-bold">
                      {getFurnishingLabel(listing.is_furnished)}
                    </p>
                  </div>

                  <div className="flex justify-between items-end mt-1">
                    <span className="bg-green-300 text-[11px] font-bold px-3.5 py-1.5 rounded-xl">
                      {listing.status}
                    </span>
                    <p className="text-sm text-orange-500 font-bold">
                      LKR {listing.price}
                    </p>
                  </div>
                </div>

                {/* <Link
                  href={`/listing/${listing.id}`}
                  className="select-none btn-light-sm btn-dynamic"
                >
                  View Listing
                </Link> */}
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Listings;

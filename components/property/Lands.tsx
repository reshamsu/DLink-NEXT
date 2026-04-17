"use client";

import React, { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import {
  TbBuilding,
  TbSquareCheck,
  TbBed,
  TbBath,
  TbArrowRight,
  TbMapPin,
} from "react-icons/tb";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

type FurnishingStatus = "Fully-Furnished" | "Semi-Furnished" | "Unfurnished";

interface SupabaseListing {
  id: number;
  property_title: string;
  property_subtitle: string;
  property_type: string;
  listing_type: string;
  city: string;
  location: string;
  is_furnished: FurnishingStatus;
  bedrooms: number;
  bathrooms: number;
  floors: number;
  perches: number;
  price: string;
  status: string;
  image_urls: string[] | string | null;
  created_at: string;
}

interface Listing {
  id: number;
  title: string;
  subtitle: string;
  location: string;
  property_type: string;
  listing_type: string;
  is_furnished: FurnishingStatus;
  bedrooms: number;
  bathrooms: number;
  floors: number;
  perches: number;
  price: string;
  status: string;
  image: string;
}

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

const statusColor: Record<string, string> = {
  Available: "bg-emerald-500",
  Sold: "bg-red-400",
};

const INITIAL_VISIBLE = 10;
const LOAD_MORE_STEP = 5;

const parseImageUrls = (raw: string[] | string | null): string[] => {
  if (Array.isArray(raw)) return raw;
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    } catch {}
  }
  return [];
};

const Listings: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("dlink_listings")
        .select("*")
        .eq("property_type", "Land")
        .order("created_at", { ascending: false });

      if (error || !data) {
        console.error("Error fetching listings:", error?.message);
        setListings([]);
        setLoading(false);
        return;
      }

      const formatted: Listing[] = (data as SupabaseListing[]).map((item) => ({
        id: item.id,
        title: item.property_title,
        subtitle: item.property_subtitle,
        location: `${item.city} - ${item.location}`,
        property_type: item.property_type,
        listing_type: item.listing_type,
        is_furnished: item.is_furnished,
        bedrooms: item.bedrooms,
        bathrooms: item.bathrooms,
        floors: item.floors,
        perches: item.perches,
        price: item.price,
        status: item.status,
        image: parseImageUrls(item.image_urls)[0] ?? "/assets/banner/property5.webp",
      }));

      setListings(formatted);
      setLoading(false);
    };

    fetchListings();
  }, []);

  const visibleListings = listings.slice(0, visibleCount);
  const hasMore = visibleCount < listings.length;

  return (
    <section className="bg-gray-100 text-gray-800" id="listings">
      <div className="max-w-6xl mx-auto flex flex-col gap-8 py-16 px-8 2xl:px-0">
        <div className="flex flex-col gap-3">
          <p className="text-xs font-extrabold bg-orange-500/10 text-orange-500 w-fit px-4 py-2 rounded-full">
            LANDS
          </p>
          <h1 className="text-xl font-extrabold">Featured Lands</h1>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            <p className="ml-3 text-gray-500">Loading listings...</p>
          </div>
        ) : listings.length === 0 ? (
          <p className="text-center text-gray-500 h-80 py-20">No listings found.</p>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
            initial="hidden"
            animate="visible"
          >
            {visibleListings.map((listing, index) => (
              <motion.div
                key={listing.id}
                custom={index}
                variants={rowVariants}
                className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group flex flex-col"
              >
                {/* IMAGE */}
                <div className="relative h-60 overflow-hidden rounded-tl-3xl">
                  <Image
                    src={listing.image}
                    alt={listing.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                  <span className="absolute top-3 left-3 bg-white backdrop-blur-sm border border-white/25 text-[10px] text-orange-600 font-bold px-2.5 py-1 rounded-full">
                    {listing.property_type} · {listing.listing_type}
                  </span>
                  <span
                    className={`absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full text-white ${statusColor[listing.status] ?? "bg-orange-300"}`}
                  >
                    {listing.status}
                  </span>
                  <div className="absolute bottom-3 left-3">
                    <p className="text-white font-extrabold text-xs leading-none drop-shadow">
                      LKR {listing.price}
                    </p>
                  </div>
                </div>

                {/* CONTENT */}
                <div className="flex flex-col gap-3 p-4 flex-1">
                  <div>
                    <Link
                      href={`/listing/${listing.id}`}
                      className="text-[13px] font-bold hover:text-orange-600 capitalize line-clamp-1 transition-colors duration-200"
                    >
                      {listing.title}
                    </Link>
                    <p className="flex items-center gap-1 text-[11px] text-gray-400 mt-0.5">
                      <TbMapPin size={11} className="text-orange-600 shrink-0" />
                      <span className="line-clamp-1">{listing.location}</span>
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-[11px] font-bold text-gray-600 pt-3 border-t border-gray-100">
                    <span className="flex items-center gap-1">
                      <TbBed size={13} className="text-orange-600" />
                      {listing.bedrooms} Bed
                    </span>
                    <span className="flex items-center gap-1">
                      <TbBath size={13} className="text-orange-600" />
                      {listing.bathrooms} Bath
                    </span>
                    <span className="flex items-center gap-1">
                      <TbBuilding size={13} className="text-orange-600" />
                      {listing.floors} Floor
                    </span>
                    <span className="flex items-center gap-1">
                      <TbSquareCheck size={13} className="text-orange-600" />
                      {listing.perches} Perch
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-1">
                    <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-2.5 py-1 rounded-full line-clamp-1 max-w-[70%]">
                      {listing.is_furnished}
                    </span>
                    <Link href={`/listing/${listing.id}`} className="btn-orange-glass">
                      <TbArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {hasMore && (
          <button
            onClick={() => setVisibleCount((prev) => prev + LOAD_MORE_STEP)}
            className="select-none btn-orange-outline btn-dynamic"
          >
            Show more Listings
          </button>
        )}
      </div>
    </section>
  );
};

export default Listings;

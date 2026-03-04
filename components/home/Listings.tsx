"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, Variants, Transition } from "framer-motion";
import {
  TbBuilding,
  TbSquareCheck,
  TbBed,
  TbBath,
  TbArrowRight,
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

const getFurnishingLabel = (value: FurnishingStatus) => value;

const INITIAL_VISIBLE = 5;
const LOAD_MORE_STEP = 5;

// Price range → min/max in millions
const parsePriceRange = (
  range: string,
): { min: number; max: number } | null => {
  if (!range) return null;
  if (range === "30 Million-Below") return { min: 0, max: 30 };
  if (range === "31 Million-39 Million") return { min: 31, max: 39 };
  if (range === "40 Million-58 Million") return { min: 40, max: 58 };
  if (range === "59 Million-70 Million") return { min: 59, max: 70 };
  if (range === "71 Million-Above") return { min: 71, max: Infinity };
  return null;
};

const Listings: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();

  const keyword = searchParams.get("q");
  const type = searchParams.get("type");
  const beds = searchParams.get("beds");
  const price = searchParams.get("price"); // ✅ new
  const side = searchParams.get("side"); // ✅ new

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      setVisibleCount(INITIAL_VISIBLE);

      let query = supabase
        .from("listing")
        .select("*")
        .order("created_at", { ascending: false });

      // ✅ city column
      if (keyword) query = query.ilike("city", `%${keyword}%`);

      // ✅ property_type column
      if (type) query = query.eq("property_type", type);

      // ✅ bedrooms column
      if (beds) query = query.gte("bedrooms", Number(beds));

      // ✅ listing_type column (Sea Side / Land Side)
      if (side) query = query.eq("listing_type", side);

      const { data, error } = await query;

      if (error || !data) {
        console.error("Error fetching listings:", error?.message);
        setListings([]);
        setLoading(false);
        return;
      }

      // ✅ Price filtered client-side (price is a text column)
      const priceFilter = parsePriceRange(price ?? "");

      const formatted: Listing[] = (data as SupabaseListing[])
        .filter((item) => {
          if (!priceFilter) return true;
          const raw = parseFloat(item.price.replace(/[^0-9.]/g, ""));
          if (isNaN(raw)) return true;
          // Normalize: handles "45" (millions) or "45000000" (raw)
          const inMillions = raw >= 1_000_000 ? raw / 1_000_000 : raw;
          return inMillions >= priceFilter.min && inMillions <= priceFilter.max;
        })
        .map((item) => {
          let images: string[] = [];
          if (Array.isArray(item.image_urls)) {
            images = item.image_urls;
          } else if (typeof item.image_urls === "string") {
            try {
              const parsed = JSON.parse(item.image_urls);
              if (Array.isArray(parsed)) images = parsed;
            } catch {
              images = [];
            }
          }

          return {
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
            type: item.property_type,
            status: item.status,
            image: images[0] ?? "/assets/banner/property5.webp",
          };
        });

      setListings(formatted);
      setLoading(false);
    };

    fetchListings();
  }, [keyword, type, beds, price, side]); // ✅ all 5 deps

  const visibleListings = listings.slice(0, visibleCount);
  const hasMore = visibleCount < listings.length;

  return (
    <section className="bg-gray-100 text-gray-800" id="listings">
      <div className="max-w-6xl mx-auto flex flex-col gap-8 py-16 px-8 2xl:px-0">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-col gap-3">
            <p className="text-xs font-extrabold bg-orange-500/10 text-orange-500 w-fit px-4 py-2 rounded-full">
              LISTINGS
            </p>
            <h1 className="text-xl font-extrabold">Featured Listings</h1>
          </div>
        </div>

        {/* STATES */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            <p className="ml-3 text-gray-500">Loading listings...</p>
          </div>
        ) : listings.length === 0 ? (
          <p className="text-center text-gray-500 h-80 py-20">
            No listings found.
          </p>
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
                initial="hidden"
                animate="visible"
                className="bg-white rounded-tl-4xl rounded-br-4xl shadow-lg overflow-hidden group h-full"
              >
                {/* IMAGE */}
                <div className="relative h-64 overflow-hidden rounded-tl-4xl rounded-br-4xl">
                  <Image
                    src={listing.image}
                    alt={listing.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all duration-700 rounded-2xl" />
                  <span className="absolute top-4 right-4 bg-orange-500/80 text-[11px] text-white font-bold px-3.5 py-1.5 rounded-full">
                    {listing.property_type} for {listing.listing_type}
                  </span>
                  <span className="absolute bottom-3 left-3 bg-gray-100 text-xs text-orange-500 font-bold px-3.5 py-1.5 rounded-xl">
                    LKR {listing.price}
                  </span>
                </div>

                {/* CONTENT */}
                <div className="flex flex-col justify-between h-fit lg:h-60 p-5">
                  <div>
                    <Link
                      href={`/listing/${listing.id}`}
                      className="text-sm font-bold hover:text-orange-500 capitalize line-clamp-1"
                    >
                      {listing.title}
                    </Link>
                    <p className="text-xs text-gray-600 mb-3 line-clamp-1">
                      {listing.subtitle}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-bold pt-4 border-t border-gray-200">
                    <p className="flex items-center gap-1.5 line-clamp-1">
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
                    <p className="text-xs text-blue-500 font-bold">
                      {getFurnishingLabel(listing.is_furnished)}
                    </p>
                  </div>

                  <div className="flex items-end justify-between">
                    <p
                      className={`text-[11px] font-bold px-3.5 py-1.5 rounded-xl text-white
    ${
      listing.status === "Available"
        ? "bg-emerald-500"
        : listing.status === "Sold"
          ? "bg-red-400"
          : "bg-orange-300"
    }
  `}
                    >
                      {listing.status}
                    </p>
                    <Link
                      href={`/listing/${listing.id}`}
                      className="btn-orange-glass"
                    >
                      <TbArrowRight size={24} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
        {/* SHOW MORE */}
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

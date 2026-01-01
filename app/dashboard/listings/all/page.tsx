"use client";

import React, { useEffect, useState } from "react";
import { motion, Variants, Transition } from "framer-motion";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

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
  is_furnished: string;

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

const Destinations: React.FC = () => {
  if (!supabase) {
    return (
      <div className="p-10 text-center text-teal-600">
        Supabase not configured. Check environment variables.
      </div>
    );
  }

  const [listings, setDestinations] = useState<Listings[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("listing")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching destinations:", error.message);
        setDestinations([]);
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

      setDestinations(formatted);
      setLoading(false);
    };

    fetchDestinations();
  }, []);

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "");

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
          From bustling metropolises to serene landscapes, our global adventure
          awaits.
        </p>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-6 mt-4">
          {loading && (
            <p className="text-gray-500 col-span-full text-center h-screen">
              Loading listings...
            </p>
          )}

          {!loading &&
            listings.map((item, index) => (
              <motion.div
                key={item.id}
                custom={index}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                className="relative rounded-4xl overflow-hidden h-[55vh] group shadow-lg hover:scale-105 duration-700"
              >
                <Image
                  src={item.image_urls?.[0] || "/assets/banner/property1.webp"}
                  alt={item.property_title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-black/60 lg:bg-black/10 transition-all duration-700 group-hover:bg-black/70" />

                <div className="relative z-10 h-full flex flex-col justify-end gap-3.5 p-8 text-white">
                  <p className="text-xs text-[#f2836f] font-semibold">
                    {item.property_type} • {item.listing_type}
                  </p>
                  <h3 className="text-xl font-bold">{item.property_title}</h3>
                  <p className="text-xs text-gray-300">
                    {item.city} · {item.location}
                  </p>
                </div>

                <p className="text-xs text-gray-300 line-clamp-3">
                  {item.description}
                </p>

                <Link
                  href={`/listing/${item.id}`}
                  className="select-none btn-orange-base btn-dynamic flex items-center gap-2"
                >
                  View Listing →
                </Link>
              </motion.div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Destinations;

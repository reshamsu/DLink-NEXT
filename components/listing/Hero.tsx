"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import {
  TbBed,
  TbBath,
  TbRulerMeasure,
  TbMapPin,
  TbHome,
  TbCircleCheck,
} from "react-icons/tb";

interface Listing {
  id: string;
  property_title: string;
  city: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  is_furnished: boolean;
  property_type: string;
  price: number;
  area_sqft?: number;
  status: string;
  description?: string;
  created_at: string;
  image_urls?: string[] | string;
}

const Hero = () => {
  const { id } = useParams();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListing = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("id", id)
        .single();

      if (error) console.error("Error loading listing:", error);
      else setListing(data as Listing);

      setLoading(false);
    };

    if (id) fetchListing();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="w-8 h-8 border-4 border-[#f09712] border-t-transparent rounded-full animate-spin"></div>
        <p className="ml-3 text-gray-500">Loading property details...</p>
      </div>
    );

  if (!listing)
    return (
      <p className="text-center text-gray-500 py-20">Property not found.</p>
    );

  // ✅ Handle image parsing safely
  let images: string[] = [];
  if (Array.isArray(listing.image_urls)) images = listing.image_urls;
  else if (typeof listing.image_urls === "string") {
    try {
      images = JSON.parse(listing.image_urls);
    } catch {
      images = [];
    }
  }

  const mainImage = images[0] || "/assets/banner/modern.webp";

  return (
    <div className="max-w-7xl mx-auto px-0 md:px-6 2xl:p-0">
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <Image
          src={mainImage}
          alt={listing.property_title}
          fill
          className="object-cover 2xl:rounded-b-4xl"
        />
        <div className="absolute inset-0 bg-black/40 2xl:rounded-b-4xl" />

        <div className="absolute inset-0 flex flex-col justify-end gap-2 text-white z-10 p-8 md:p-12 2xl:p-10">
          <h1 className="text-xl md:text-3xl font-bold">
            {listing.property_title}
          </h1>
          <div className="flex items-center justify-between">
            <p className="text-sm opacity-90 flex items-center gap-2">
              <TbMapPin size={18} /> {listing.city} - {listing.location}
            </p>
            <p className="flex items-center gap-1 opacity-80 text-lg font-extrabold text-orange-400">
              LKR {""} {listing.price?.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Property Details */}
      <div className="max-w-7xl mx-auto p-6 md:p-10 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-20">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <p>Listed on {new Date(listing.created_at).toLocaleDateString()}</p>
            <span>|</span>
            <p>
              Status:{" "}
              <span
                className={`font-semibold ${
                  listing.status === "Available"
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {listing.status}
              </span>
            </p>
          </div>

          {/* Specs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center text-sm font-bold border-b border-gray-200 pb-6">
            <p className="flex items-center gap-2">
              <TbBed size={22} className="text-orange-400" />
              {listing.bedrooms} Beds
            </p>
            <p className="flex items-center gap-2">
              <TbBath size={22} className="text-orange-400" />
              {listing.bathrooms} Baths
            </p>
            {listing.area_sqft && (
              <p className="flex items-center gap-2">
                <TbRulerMeasure size={22} className="text-orange-400" />
                {listing.area_sqft.toLocaleString()} sqft
              </p>
            )}
            <p className="flex items-center gap-2">
              <TbHome size={22} className="text-orange-400" />
              {listing.property_type}
            </p>
            <p className="flex items-center gap-2">
              <TbCircleCheck size={22} className="text-orange-400" />
              {listing.is_furnished ? "Furnished" : "Unfurnished"}
            </p>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-3 border-b border-gray-200 pb-8">
            <h2 className="text-xl font-extrabold">Property Description</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              {listing.description ||
                `Discover your dream home in ${
                  listing.city
                }, perfectly located near ${listing.location}. 
                This ${listing.property_type.toLowerCase()} combines modern design with comfort and functionality. 
                Every detail has been thoughtfully crafted to enhance your lifestyle.`}
            </p>
          </div>

          {/* Amenities (Optional static section) */}
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-extrabold">Key Features</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <TbCircleCheck size={20} className="text-orange-400" /> Modern
                Kitchen
              </li>
              <li className="flex items-center gap-2">
                <TbCircleCheck size={20} className="text-orange-400" /> Air
                Conditioning
              </li>
              <li className="flex items-center gap-2">
                <TbCircleCheck size={20} className="text-orange-400" /> Parking
                Space
              </li>
              <li className="flex items-center gap-2">
                <TbCircleCheck size={20} className="text-orange-400" /> 24/7
                Security
              </li>
              <li className="flex items-center gap-2">
                <TbCircleCheck size={20} className="text-orange-400" /> Balcony
                with View
              </li>
              <li className="flex items-center gap-2">
                <TbCircleCheck size={20} className="text-orange-400" /> Nearby
                Schools
              </li>
            </ul>
          </div>
        </div>

        {/* Right side card */}
        <div className="bg-white shadow-lg border-2 border-orange-200 rounded-3xl p-10 flex flex-col gap-6 h-fit">
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-extrabold mb-2">Price</h3>
            <p className="text-3xl font-bold text-orange-500">
              LKR {listing.price?.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">One-time payment</p>
          </div>

          <div className="flex flex-col gap-2 text-sm text-gray-500 pt-6 border-t border-gray-200">
            <p>
              Property Type:{" "}
              <span className="font-semibold text-gray-800">
                {listing.property_type}
              </span>
            </p>
            <p>
              Location:{" "}
              <span className="font-semibold text-gray-800">
                {listing.city} - {listing.location}
              </span>
            </p>
            <p>
              Furnishing:{" "}
              <span className="font-semibold text-gray-800">
                {listing.is_furnished ? "Furnished" : "Unfurnished"}
              </span>
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 mt-4">
            <Link
              href={`/contact-agent/${listing.id}`}
              className="btn-orange-base btn-dynamic text-center select-none"
            >
              Contact Agent
            </Link>

            <Link
              href="/"
              className="btn-light-base btn-dynamic text-center select-none"
            >
              Back to Listings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

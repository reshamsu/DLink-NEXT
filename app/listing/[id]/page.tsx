"use client";

import { useEffect, useState, useRef } from "react";
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
  TbSofa,
  TbSquareCheck,
  TbBuilding,
} from "react-icons/tb";

interface Listing {
  id: string;
  property_title: string;
  property_subtitle: string;
  city: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  floors: number;
  is_furnished: boolean;
  property_type: string;
  price: number;
  amenities: string[] | string;
  sqft: number;
  perches: number;
  status: string;
  description?: string;
  created_at: string;
  image_urls?: string[] | string;
}

const Page = () => {
  const { id } = useParams();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    const fetchListing = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("listing")
        .select("*")
        .eq("id", id)
        .single();

      if (error) console.error("Error loading listing:", error);
      else setListing(data as Listing);

      setLoading(false);
    };

    if (id) fetchListing();
  }, [id]);

  // 🌀 Auto-slide every 5 minutes (300,000ms)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % 5);
    }, 300000);
    return () => clearInterval(interval);
  }, []);

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

  // ✅ Parse image array safely
  let images: string[] = [];
  if (Array.isArray(listing.image_urls)) images = listing.image_urls;
  else if (typeof listing.image_urls === "string") {
    try {
      images = JSON.parse(listing.image_urls);
    } catch {
      images = [];
    }
  }

  let amenities: string[] = [];
  if (Array.isArray(listing.amenities)) amenities = listing.amenities;
  else if (typeof listing.amenities === "string") {
    try {
      amenities = JSON.parse(listing.amenities);
    } catch {
      amenities = [];
    }
  }

  // Add fallback images if fewer than 5
  const fallbackImages = [
    "/assets/banner/property1.webp",
    "/assets/banner/property2.jpeg",
    "/assets/banner/property3.jpeg",
    "/assets/banner/property4.jpg",
    "/assets/banner/property5.jpg",
  ];
  if (images.length < 5) {
    images = [...images, ...fallbackImages.slice(0, 5 - images.length)];
  }

  // Touch gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 75) {
      // Swipe left
      setCurrentIndex((prev) => (prev + 1) % images.length);
    } else if (touchEndX.current - touchStartX.current > 75) {
      // Swipe right
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const currentImage = images[currentIndex];

  return (
    <div className="max-w-7xl mx-auto px-0 xl:px-6 2xl:px-0">
      {/* Hero Slider Section */}
      <div
        className="relative h-[60vh] w-full overflow-hidden select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          src={currentImage}
          alt={listing.property_title}
          fill
          className="object-cover transition-all duration-700 ease-in-out xl:rounded-b-4xl"
          priority
        />
        <div className="absolute inset-0 bg-black/40 xl:rounded-b-4xl" />

        <div className="absolute inset-0 flex flex-col justify-end gap-1 text-white z-10 p-6 md:p-8 2xl:p-10">
          <h1 className="text-xl md:text-2xl 2xl:text-3xl font-bold drop-shadow-md">
            {listing.property_title}
          </h1>
          <p className="text-sm"> {listing.property_subtitle}</p>
          <div className="flex items-center justify-between">
            <p className="text-sm opacity-90 flex items-center gap-2">
              <TbMapPin size={18} /> {listing.city} - {listing.location}
            </p>
            <p className="flex items-center gap-1 text-lg font-extrabold text-orange-400">
              LKR {listing.price?.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Slider Dots */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === currentIndex
                  ? "bg-white scale-110"
                  : "bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Property Details */}
      <div className="max-w-7xl mx-auto p-6 md:p-10 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-8 2xl:gap-10">
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
          <div className="grid grid-cols-3 lg:grid-cols-4 gap-3 items-center text-sm capitalize font-bold border-b border-gray-200 pb-6">
            <p className="flex items-center gap-2">
              <TbBed size={22} className="text-orange-400" />
              {listing.bedrooms} Beds
            </p>
            <p className="flex items-center gap-2">
              <TbBath size={22} className="text-orange-400" />
              {listing.bathrooms} Baths
            </p>
            <p className="flex items-center gap-2">
              <TbBuilding size={22} className="text-orange-400" />
              {listing.floors} Floors
            </p>
            <p className="flex items-center gap-2">
              <TbRulerMeasure size={22} className="text-orange-400" />
              {listing.sqft} Sqft.
            </p>
            <p className="flex items-center gap-2">
              <TbSquareCheck size={22} className="text-orange-400" />
              {listing.perches} Perch
            </p>
            <p className="flex items-center gap-2">
              <TbHome size={22} className="text-orange-400" />
              {listing.property_type}
            </p>
            <p className="flex items-center gap-2">
              <TbSofa size={22} className="text-orange-400" />
              {listing.is_furnished ? "Furnished" : "Un-furnished"}
            </p>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-3 border-b border-gray-200 pb-8">
            <h2 className="text-xl font-extrabold">Property Description</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              {listing.description ||
                `Discover your dream home in ${listing.city}, near ${
                  listing.location
                }. 
                This ${listing.property_type.toLowerCase()} blends modern design with comfort and practicality.`}
            </p>
          </div>

          {/* Features */}
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-extrabold">Key Features</h2>
            {amenities.length > 0 ? (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                {amenities.map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <TbCircleCheck size={18} className="text-[#f09712]" />
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No amenities listed.</p>
            )}
          </div>
        </div>

        {/* Contact Card */}
        <div className="bg-white shadow-lg border-2 border-orange-200 rounded-3xl p-8 md:p-10 flex flex-col gap-6 h-fit">
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-extrabold mb-2">Price</h3>
            <p className="text-3xl font-bold text-orange-500">
              LKR {listing.price?.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">(Negotiable)</p>
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
                {listing.is_furnished ? "Furnished" : "UnFurnished"}
              </span>
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-4 mt-4">
            <Link
              href="tel:+94761676603"
              className="btn-orange-sm btn-dynamic text-center select-none"
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

export default Page;

"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  TbChevronLeft,
  TbChevronRight,
  TbMapPin,
  TbBed,
  TbBath,
  TbRulerMeasure,
  TbHome,
  TbCircleCheck,
  TbSofa,
  TbSquareCheck,
  TbBuilding,
  TbPhone,
} from "react-icons/tb";
import { supabase } from "@/lib/supabaseClient";

interface Listing {
  id: string;
  property_title: string;
  property_subtitle: string;
  city: string;
  location: string;
  bedrooms: string;
  bathrooms: string;
  floors: string;
  is_furnished: "Fully-Furnished" | "Semi-Furnished" | "Unfurnished";
  property_type: string;
  price: number;
  full_price: string;
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
  const [current, setCurrent] = useState(0);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  /* ---------------- FETCH LISTING ---------------- */
  useEffect(() => {
    const fetchListing = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("listing")
        .select("*")
        .eq("id", id)
        .single();

      if (!error) setListing(data as Listing);
      else console.error(error);

      setLoading(false);
    };

    if (id) fetchListing();
  }, [id]);

  /* ---------------- NORMALIZE IMAGES ---------------- */
  const images = useMemo<string[]>(() => {
    if (!listing?.image_urls) return [];

    if (Array.isArray(listing.image_urls)) return listing.image_urls;

    if (typeof listing.image_urls === "string") {
      try {
        return JSON.parse(listing.image_urls);
      } catch {
        return [];
      }
    }

    return [];
  }, [listing?.image_urls]);

  /* ---------------- NORMALIZE AMENITIES ---------------- */
  const amenities = useMemo<string[]>(() => {
    if (!listing?.amenities) return [];

    if (Array.isArray(listing.amenities)) return listing.amenities;

    if (typeof listing.amenities === "string") {
      try {
        return JSON.parse(listing.amenities);
      } catch {
        return [];
      }
    }

    return [];
  }, [listing?.amenities]);

  /* ---------------- AUTO SLIDER ---------------- */
  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [images.length]);

  /* ---------------- CONTROLS ---------------- */
  const prevSlide = () => {
    if (!images.length) return;
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  const nextSlide = () => {
    if (!images.length) return;
    setCurrent((prev) => (prev + 1) % images.length);
  };

  /* ---------------- TOUCH GESTURES ---------------- */
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!images.length) return;

    if (touchStartX.current - touchEndX.current > 75) nextSlide();
    if (touchEndX.current - touchStartX.current > 75) prevSlide();
  };

  /* ---------------- STATES ---------------- */
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <p className="ml-3 text-gray-500">Loading property details...</p>
      </div>
    );
  }

  if (!listing) {
    return (
      <p className="text-center text-gray-500 py-20">Property not found.</p>
    );
  }

  const furnishingLabel =
    listing.is_furnished === "Fully-Furnished"
      ? "Fully-Furnished"
      : listing.is_furnished === "Semi-Furnished"
      ? "Semi-Furnished"
      : "UnFurnished";

  const currentImage = images[current];

  return (
    <div className="max-w-6xl mx-auto mt-18 px-0 xl:px-6 2xl:px-0">
      {/* Hero Slider Section */}
      <div
        className="relative h-[60vh] md:h-[66vh] w-full overflow-hidden select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {currentImage && (
          <>
            <Image
              src={currentImage}
              alt={listing.property_title}
              fill
              className="object-cover transition-all duration-700 xl:rounded-b-4xl"
              priority
            />
            <div className="absolute inset-0 bg-black/15 xl:rounded-b-4xl" />
          </>
        )}

        {/* CONTROLS */}
        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-3 md:left-6 -translate-y-1/2 text-white z-20"
        >
          <TbChevronLeft size={44} />
        </button>

        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-3 md:right-6 -translate-y-1/2 text-white z-20"
        >
          <TbChevronRight size={44} />
        </button>

        <div className="absolute inset-0 flex items-start justify-between gap-1 text-white z-10 p-6 pb-10 md:p-8 2xl:p-10">
          <p className="text-sm font-bold opacity-90 flex items-center gap-2">
            <TbMapPin size={24} className="text-orange-500" /> {listing.city}
          </p>
          <span className="absolute top-6 right-6 bg-orange-500/60 text-sm text-white font-bold px-6 py-2.5 shadow-2xl rounded-3xl">
            {listing.property_type}
          </span>
        </div>

        {/* Slider Dots */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === current
                  ? "bg-white scale-110"
                  : "bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Property Details */}
      <div className="max-w-7xl mx-auto p-6 md:py-10 md:px-4 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-8 2xl:gap-10">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 text-sm border-b border-gray-200 pb-6">
            {/* <p>Listed on {new Date(listing.created_at).toLocaleDateString()}</p>
            <span>|</span> */}

            <p className="text-xs text-gray-500">
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
            <div className="space-y-1">
              <h1 className="text-xl md:text-2xl font-bold drop-shadow-lg line-clamp-1">
                {listing.property_title}
              </h1>

              <div className="flex flex-col md:flex-row justify-between gap-1">
                <p className="ext-sm text-gray-600 line-clamp-1">
                  {listing.property_subtitle}
                </p>
              </div>
            </div>
          </div>

          {/* Specs */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 items-center text-sm capitalize font-bold border-b border-gray-200 pb-6">
            <p className="flex items-center gap-2">
              <TbBed size={22} className="text-orange-500" />
              {listing.bedrooms} Beds
            </p>
            <p className="flex items-center gap-2">
              <TbBath size={22} className="text-orange-500" />
              {listing.bathrooms} Baths
            </p>
            <p className="flex items-center gap-2">
              <TbBuilding size={22} className="text-orange-500" />
              {listing.floors}
            </p>
            <p className="flex items-center gap-2">
              <TbSofa size={22} className="text-orange-500" />
              {furnishingLabel}
            </p>
            <p className="flex items-center gap-2">
              <TbSquareCheck size={22} className="text-orange-500" />
              {listing.perches} Perch
            </p>
            <p className="flex items-center gap-2">
              <TbHome size={22} className="text-orange-500" />
              {listing.property_type}
            </p>

            <p className="flex items-center gap-2">
              <TbRulerMeasure size={22} className="text-orange-500" />
              {listing.sqft} Sqft.
            </p>
          </div>

          {/* <div className="flex flex-col gap-4 border-b border-gray-200 pb-6">
            <div className="bg-white shadow-lg border-2 border-orange-400 rounded-3xl py-4 flex flex-col gap-3 px-6 h-fit">
              <div className="flex items-center justify-between">
                <div>
                  <h1>Zain Jay</h1>
                  <p className="whitespace-pre-line text-xs text-gray-500 leading-relaxed">
                    Property Owner
                  </p>
                </div>
                <Link
                  href="tel:+94123456789"
                  className="bg-gray-100 p-3 rounded-full shadow-md hover:scale-105 transition-all"
                >
                  <TbPhone size={22} className="text-orange-500" />
                </Link>
              </div>

              <i className="text-sm whitespace-pre-line text-orange-600 leading-relaxed">
                Span Tower Marine Drive
              </i>
            </div>
             <div className="bg-white shadow-lg border-2 border-orange-400 rounded-3xl py-4 flex flex-col gap-3 px-6 h-fit">
              <div className="flex items-center justify-between">
                <div>
                  <h1>Zain Jay</h1>
                  <p className="whitespace-pre-line text-xs text-gray-500 leading-relaxed">
                    Agent Information
                  </p>
                </div>
                <Link
                  href="tel:+94123456789"
                  className="bg-gray-100 p-3 rounded-full shadow-md hover:scale-105 transition-all"
                >
                  <TbPhone size={22} className="text-orange-500" />
                </Link>
              </div>

              <i className="text-sm whitespace-pre-line text-orange-600 leading-relaxed">
                Span Tower Marine Drive
              </i>
            </div>
          </div> */}

          {/* Description */}
          <div className="flex flex-col gap-3 border-b border-gray-200 pb-8">
            <h2 className="text-xl font-extrabold">Property Description</h2>
            <p className="whitespace-pre-line text-sm text-gray-500 leading-relaxed">
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
                    <TbCircleCheck size={18} className="text-orange-600" />
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
            <p className="text-base font-semibold text-gray-700">
              {" "}
              ({listing.full_price} - Negotiable)
            </p>
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
                {furnishingLabel}
              </span>
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-2.5 mt-4">
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

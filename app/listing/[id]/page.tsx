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
  TbBrandWhatsapp,
  TbPhone,
  TbShare,
} from "react-icons/tb";
import { supabase } from "@/lib/supabaseClient";

interface Listing {
  id: string;
  property_title: string;
  property_subtitle: string;
  property_type: string;
  listing_type: string;
  city: string;
  location: string;
  bedrooms: string;
  bathrooms: string;
  floors: string;
  is_furnished: "Fully-Furnished" | "Semi-Furnished" | "Unfurnished";
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

export const runtime = "edge";

const statusStyle: Record<string, string> = {
  Available: "bg-emerald-50 text-emerald-600 border border-emerald-200",
  Sold: "bg-red-50 text-red-500 border border-red-200",
};

const parseJsonArray = (val: string[] | string | undefined): string[] => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  try {
    return JSON.parse(val);
  } catch {
    return [];
  }
};

const Page = () => {
  const { id } = useParams();

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("dlink_listings")
        .select("*")
        .eq("id", id)
        .single();
      if (!error) setListing(data as Listing);
      else console.error(error);
      setLoading(false);
    };
    fetch();
  }, [id]);

  const images = useMemo(
    () => parseJsonArray(listing?.image_urls),
    [listing?.image_urls],
  );
  const amenities = useMemo(
    () => parseJsonArray(listing?.amenities),
    [listing?.amenities],
  );

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(
      () => setCurrent((p) => (p + 1) % images.length),
      10000,
    );
    return () => clearInterval(interval);
  }, [images.length]);

  const prevSlide = () =>
    setCurrent((p) => (p - 1 + images.length) % images.length);
  const nextSlide = () => setCurrent((p) => (p + 1) % images.length);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 75) nextSlide();
    if (touchEndX.current - touchStartX.current > 75) prevSlide();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] gap-3">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 text-sm">Loading property details...</p>
      </div>
    );
  }

  if (!listing) {
    return (
      <p className="text-center text-gray-500 py-20">Property not found.</p>
    );
  }

  const listingUrl = typeof window !== "undefined" ? window.location.href : "";

  const agentWhatsAppUrl = `https://wa.me/94761676603?text=${encodeURIComponent(
    [
      `*D-LINK REALTORS*`,
      `_Roy.Su Realtors | Colombo, Sri Lanka_`,
      ``,
      `Hi, I found this listing on D-Link Realtors and I'm interested:`,
      ``,
      `*${listing.property_title}*`,
      `📍 ${listing.city} — ${listing.location}`,
      `💰 LKR ${listing.price?.toLocaleString()} _(Negotiable)_`,
      ``,
      `🛏 ${listing.bedrooms} Beds  |  🚿 ${listing.bathrooms} Baths  |  ${listing.perches} Perch`,
      ``,
      `Could you please share more details or schedule a viewing?`,
      ``,
      `${listingUrl}`,
    ].join("\n")
  )}`;

  const shareWhatsAppUrl = `https://wa.me/?text=${encodeURIComponent(
    [
      `*D-LINK REALTORS*`,
      `_Sri Lanka's Premier Property Platform_`,
      ``,
      `🏠 *${listing.property_title}*`,
      ``,
      `📍 ${listing.city} — ${listing.location}`,
      `💰 LKR ${listing.price?.toLocaleString()} _(Negotiable)_`,
      ``,
      `🛏 ${listing.bedrooms} Beds  |  🚿 ${listing.bathrooms} Baths  |  ${listing.perches} Perch  |  ${listing.floors} Floor(s)`,
      `✅ ${listing.status}  •  ${listing.is_furnished}`,
      ``,
      `👉 View full listing:`,
      `${listingUrl}`,
      ``,
      `📞 +94 76 167 6603`,
      `_Roy.Su Realtors | D-Link Colombo_`,
    ].join("\n")
  )}`;

  const specs = [
    { icon: TbBed, label: "Bedrooms", value: `${listing.bedrooms} Beds` },
    { icon: TbBath, label: "Bathrooms", value: `${listing.bathrooms} Baths` },
    { icon: TbBuilding, label: "Floors", value: `${listing.floors} Floor` },
    {
      icon: TbSquareCheck,
      label: "Perches",
      value: `${listing.perches} Perch`,
    },
    { icon: TbRulerMeasure, label: "Area", value: `${listing.sqft} Sqft` },
    { icon: TbSofa, label: "Furnishing", value: listing.is_furnished },
    { icon: TbHome, label: "Type", value: listing.property_type },
  ];

  return (
    <div className="max-w-6xl mx-auto mt-20 px-0 xl:px-6 2xl:px-0">
      {/* ── Mobile: full-width slider ── */}
      <div
        className="md:hidden relative h-[64vh] w-full overflow-hidden select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {images[current] && (
          <>
            <Image
              src={images[current]}
              alt={listing.property_title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
          </>
        )}
        <div className="absolute top-4 inset-x-4 flex justify-between items-start z-10">
          <p className="flex items-center gap-1.5 text-xs font-bold text-white bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
            <TbMapPin size={13} className="text-orange-400" /> {listing.city}
          </p>
          <span className="bg-white/90 text-xs text-orange-600 font-bold px-3 py-1.5 rounded-full">
            {listing.property_type} · {listing.listing_type}
          </span>
        </div>
        {images.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute top-1/2 left-3 -translate-y-1/2 z-20 bg-black/30 backdrop-blur-sm text-white rounded-full p-2"
            >
              <TbChevronLeft size={20} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute top-1/2 right-3 -translate-y-1/2 z-20 bg-black/30 backdrop-blur-sm text-white rounded-full p-2"
            >
              <TbChevronRight size={20} />
            </button>
            <div className="absolute bottom-4 inset-x-0 flex justify-center gap-1.5 z-20">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`rounded-full transition-all duration-300 ${i === current ? "w-4 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/40"}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── Desktop: grid gallery ── */}
      <div className="hidden md:block select-none px-0">
        <div className="grid grid-cols-[3fr_2fr] gap-1.5 h-[80vh] bg-black rounded-3xl overflow-hidden">
          {/* Main image */}
          <div
            className="relative group cursor-pointer"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {images[current] && (
              <Image
                src={images[current]}
                alt={listing.property_title}
                fill
                className="object-cover transition-all duration-500"
                priority
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />

            {/* Overlays */}
            <div className="absolute top-5 left-5 flex flex-col gap-2 z-10">
              <p className="flex items-center gap-1.5 text-sm font-bold text-white bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full w-fit">
                <TbMapPin size={14} className="text-orange-400" />{" "}
                {listing.city}
              </p>
            </div>
            <span className="absolute top-5 right-5 bg-white/90 text-xs text-orange-600 font-bold px-3.5 py-1.5 rounded-full z-10">
              {listing.property_type} · {listing.listing_type}
            </span>
            <span className="absolute bottom-5 left-5 text-xs font-extrabold text-white/60 uppercase tracking-widest select-none z-10">
              Roy.Su Realtors
            </span>

            {/* Arrows over main */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute top-1/2 left-4 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/60 backdrop-blur-sm text-white rounded-full p-2.5 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <TbChevronLeft size={22} />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute top-1/2 right-4 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/60 backdrop-blur-sm text-white rounded-full p-2.5 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <TbChevronRight size={22} />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails 2×2 */}
          <div className="grid grid-cols-2 grid-rows-2 gap-1.5">
            {[0, 1, 2, 3].map((i) => {
              const src = images[i];
              const isActive = current === i;
              const isLast = i === 3 && images.length > 4;
              return (
                <div
                  key={i}
                  onClick={() => src && setCurrent(i)}
                  className={`relative overflow-hidden cursor-pointer transition-all duration-200 ${
                    isActive
                      ? "ring-2 ring-orange-400 ring-inset"
                      : "opacity-80 hover:opacity-100"
                  } ${!src ? "bg-gray-800" : ""}`}
                >
                  {src ? (
                    <Image
                      src={src}
                      alt={`Photo ${i + 1}`}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800" />
                  )}
                  {/* "+N more" overlay on last slot */}
                  {isLast && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <p className="text-white font-extrabold text-lg">
                        +{images.length - 4}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="p-6 md:pt-10 md:pb-20 md:px-4 grid grid-cols-1 md:grid-cols-2 gap-8 2xl:gap-12">
        {/* Left column */}
        <div className="flex flex-col gap-8">
          {/* Title block */}
          <div className="flex flex-col gap-2 pb-6 border-b border-gray-200">
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full w-fit ${statusStyle[listing.status] ?? "bg-orange-50 text-orange-500 border border-orange-200"}`}
            >
              {listing.status}
            </span>
            <h1 className="text-xl md:text-2xl font-extrabold leading-snug">
              {listing.property_title}
            </h1>
            <p className="text-sm text-gray-500">{listing.property_subtitle}</p>
            <p className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold mt-1">
              <TbMapPin size={13} className="text-orange-500 shrink-0" />
              {listing.city} — {listing.location}
            </p>
          </div>

          {/* Specs grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 pb-6 border-b border-gray-200">
            {specs.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex items-center gap-3 bg-gray-50 rounded-2xl px-4 py-3"
              >
                <Icon size={18} className="text-orange-500 shrink-0" />
                <div>
                  <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">
                    {label}
                  </p>
                  <p className="text-xs font-extrabold text-gray-700 capitalize">
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="flex flex-col gap-3 pb-6 border-b border-gray-200">
            <h2 className="text-base font-extrabold">Property Description</h2>
            <p className="whitespace-pre-line text-sm text-gray-500 leading-relaxed">
              {listing.description ||
                `Discover your dream property in ${listing.city}, near ${listing.location}. This ${listing.property_type.toLowerCase()} blends modern design with comfort and practicality.`}
            </p>
          </div>

          {/* Amenities */}
          <div className="flex flex-col gap-3">
            <h2 className="text-base font-extrabold">Key Features</h2>
            {amenities.length > 0 ? (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {amenities.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-sm text-gray-600"
                  >
                    <TbCircleCheck
                      size={16}
                      className="text-orange-500 shrink-0"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400">No features listed.</p>
            )}
          </div>
        </div>

        {/* Right column — sticky card */}
        <div className="md:sticky md:top-24 h-fit">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-lg p-8 flex flex-col gap-6">
            {/* Price */}
            <div className="pb-5 border-b border-gray-100">
              <p className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-1">
                Asking Price
              </p>
              <p className="text-3xl font-extrabold text-orange-500">
                LKR {listing.price?.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {listing.full_price} &mdash; Negotiable
              </p>
            </div>

            {/* Meta */}
            <div className="flex flex-col gap-2.5 text-sm pb-5 border-b border-gray-100">
              {[
                { label: "Type", value: listing.property_type },
                {
                  label: "Location",
                  value: `${listing.city} — ${listing.location}`,
                },
                { label: "Furnishing", value: listing.is_furnished },
                { label: "Status", value: listing.status },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between gap-2">
                  <span className="text-gray-400">{label}</span>
                  <span className="font-bold text-gray-800 text-right">
                    {value}
                  </span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-3">
              <Link
                href="tel:+94761676603"
                className="btn-orange-sm select-none w-full justify-center gap-2"
              >
                <TbPhone size={16} /> Call Agent
              </Link>
              <Link
                href={agentWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-dark-base select-none w-full justify-center gap-2"
              >
                <TbBrandWhatsapp size={16} /> Message Agent
              </Link>
              <Link
                href={shareWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full font-bold text-sm px-6 py-3 rounded-full border-2 border-green-500 text-green-600 hover:bg-green-500 hover:text-white transition-colors duration-200 select-none"
              >
                <TbShare size={16} /> Share Listing
              </Link>
              <Link
                href="/"
                className="btn-light-outline select-none justify-center text-sm"
              >
                ← Back to Listings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { TbBed, TbBath } from "react-icons/tb";

interface Listing {
  id: string;
  property_title: string;
  city: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  is_furnished: boolean;
  property_type: string;
  status: string;
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
        <p className="ml-3 text-gray-500">Loading...</p>
      </div>
    );

  if (!listing)
    return (
      <p className="text-center text-gray-500 py-20">Listing not found.</p>
    );

  // ✅ Handle images safely
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
      <div className="relative h-[60vh] w-full overflow-hidden">
        <div className="relative min-w-full h-full">
          <Image
            src={mainImage}
            alt={listing.property_title}
            fill
            className="object-cover 2xl:rounded-b-4xl"
          />
          <div className="absolute inset-0 bg-black/40 2xl:rounded-b-4xl" />
        </div>

        <div className="absolute inset-0 flex flex-col justify-end items-start text-start gap-2 text-white z-10 p-8 md:p-12 2xl:p-10">
          <h1 className="text-xl md:text-3xl font-bold">
            {listing.property_title}
          </h1>
          <p className="text-sm font-medium opacity-80">
            {listing.city} - {listing.location}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 text-gray-800">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4 text-sm font-semibold">
            <p className="flex items-center gap-1.5">
              <TbBed size={18} className="text-orange-400" />
              {listing.bedrooms} Bed
            </p>
            <p className="flex items-center gap-1.5">
              <TbBath size={18} className="text-orange-400" />
              {listing.bathrooms} Bath
            </p>
          </div>

          <p className="text-blue-600 font-semibold">
            {listing.is_furnished ? "Furnished" : "Unfurnished"}
          </p>

          <p className="text-gray-600">{listing.property_type}</p>

          <p className="text-sm text-gray-500">
            Status:{" "}
            <span className="font-semibold text-green-600">
              {listing.status}
            </span>
          </p>

          <p className="text-xs text-gray-400">
            Created: {new Date(listing.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;

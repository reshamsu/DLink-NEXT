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
  TbSofa,
  TbSquareCheck,
  TbBuilding,
  TbBuildingEstate,
  TbHome2,
  TbCheckbox,
  TbEyeDollar,
  TbMapDollar,
  TbPencil,
} from "react-icons/tb";
import { supabase } from "@/lib/supabaseClient";

interface Listing {
  price_negotiable: boolean | undefined;
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
  property_identity: string;
  contact_number: string;
  actual_floor: string;
  property_location: string;
  building_age: string;
  listing_type: string;
  image_urls?: string[] | string;
}

export default function Page() {
  const { id } = useParams<{ id: string }>();

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [current, setCurrent] = useState(0);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  /* ---------------- FETCH LISTING ---------------- */
  useEffect(() => {
    if (!id) return;

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

    fetchListing();
  }, [id]);

  /* ---------------- NORMALIZE IMAGES ---------------- */
  const images = useMemo<string[]>(() => {
    if (!listing?.image_urls) return [];
    if (Array.isArray(listing.image_urls)) return listing.image_urls;
    try {
      return JSON.parse(listing.image_urls);
    } catch {
      return [];
    }
  }, [listing?.image_urls]);

  const amenities = useMemo<string[]>(() => {
    if (!listing?.amenities) return [];
    if (Array.isArray(listing.amenities)) return listing.amenities;
    try {
      return JSON.parse(listing.amenities);
    } catch {
      return [];
    }
  }, [listing?.amenities]);

  const is_furnished = useMemo<string[]>(() => {
    if (!listing?.is_furnished) return [];
    if (Array.isArray(listing.is_furnished)) return listing.is_furnished;
    try {
      return JSON.parse(listing.is_furnished);
    } catch {
      return [];
    }
  }, [listing?.is_furnished]);

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

  /* ---------------- UPDATE HANDLER ---------------- */
  const updateField = <K extends keyof Listing>(key: K, value: Listing[K]) => {
    if (!listing) return;
    setListing({ ...listing, [key]: value });
  };

  const saveChanges = async () => {
    if (!listing) return;

    setSaving(true);

    const { error } = await supabase
      .from("listing")
      .update({
        ...listing,
        amenities,
      })
      .eq("id", id);

    setSaving(false);

    if (!error) alert("Listing updated successfully");
    else {
      console.error(error);
      alert("Failed to update listing");
    }
  };

  /* ---------------- STATES ---------------- */
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
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

        <div className="absolute inset-0 flex items-start justify-between gap-1 text-white z-10 p-6 pb-10 md:p-8">
          <p className="text-sm font-bold opacity-90 flex items-center gap-2">
            <TbMapPin size={24} className="text-orange-500" /> {listing.city}
          </p>
          <span className="bg-white/90 text-xs lg:text-sm text-orange-500 font-bold px-4 py-2 shadow-2xl rounded-3xl">
            {listing.property_type} for {listing.listing_type}
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
          <div className="absolute bottom-0 right-6 flex gap-2 bg-white text-black py-2 px-4 text-sm rounded-3xl">
            <TbPencil size={20} />
            {/* <div className="flex flex-col gap-2 w-full">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => updateImages(e.target.files)}
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5"
                required
              />
            </div> */}
          </div>
        </div>
      </div>

      {/* Property Details */}
      <div className="max-w-7xl mx-auto p-6 md:py-10 md:px-4 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-8 2xl:gap-10">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-0 text-sm border-b border-gray-300 pb-6">
            {/* <p>Listed on {new Date(listing.created_at).toLocaleDateString()}</p>
            <span>|</span> */}

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                <div className="flex flex-col gap-2 w-full">
                  <label className="flex gap-2 text-black font-bold text-sm">
                    <TbCheckbox size={20} className="text-orange-500" /> Status*
                  </label>
                  <select
                    value={listing.status}
                    onChange={(e) => updateField("status", e.target.value)}
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 capitalize"
                  >
                    <option value="Available">Available</option>
                    <option value="Unavailable">Unavailable</option>
                    <option value="Sold">Sold</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <label className="flex gap-2 text-black font-bold text-sm">
                    <TbMapPin size={20} className="text-orange-500" /> Location*
                  </label>
                  <select
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 input w-full"
                    value={listing.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      Select City
                    </option>
                    <optgroup label="Colombo City">
                      <option value="Colombo 03">Colombo 03</option>
                      <option value="Colombo 04">Colombo 04</option>
                      <option value="Colombo 05">Colombo 05</option>
                      <option value="Colombo 06">Colombo 06</option>
                      <option value="Colombo 07">Colombo 07</option>
                    </optgroup>

                    <optgroup label="Suburbs & Coastal">
                      <option value="Dehiwela">Dehiwela</option>
                      <option value="Mount Lavinia">Mount Lavinia</option>
                      <option value="Wellawatta">Wellawatta</option>
                      <option value="Bambalapitiya">Bambalapitiya</option>
                      <option value="Ratmalana">Ratmalana</option>
                      <option value="Moratuwa">Moratuwa</option>
                    </optgroup>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-2 w-full">
                <label className="text-black font-bold text-sm">
                  Property Title<span className="text-orange-500">*</span>
                </label>
                <input
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 capitalize"
                  value={listing.property_title}
                  onChange={(e) =>
                    updateField("property_title", e.target.value)
                  }
                />
              </div>
              <div className="flex flex-col gap-2 w-full">
                <label className="text-black font-bold text-sm">
                  Property Subtitle<span className="text-orange-500">*</span>
                </label>
                <input
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 capitalize"
                  value={listing.property_subtitle}
                  onChange={(e) =>
                    updateField("property_subtitle", e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          {/* Specs */}
          <div className="grid grid-cols-2 lg:grid-cols-2 gap-6 items-center text-sm capitalize font-bold border-b border-gray-300 pb-6">
            <div className="flex flex-col gap-2 w-full">
              <label className="flex gap-2 text-black font-bold text-sm">
                <TbBed size={22} className="text-orange-500" /> Bedrooms*
              </label>
              <input
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 capitalize"
                value={listing.bedrooms}
                onChange={(e) => updateField("bedrooms", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <label className="flex gap-2 text-black font-bold text-sm">
                <TbBath size={22} className="text-orange-500" /> Bathrooms*
              </label>
              <input
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 capitalize"
                value={listing.bathrooms}
                onChange={(e) => updateField("bathrooms", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <label className="flex gap-2 text-black font-bold text-sm">
                <TbBuilding size={22} className="text-orange-500" /> Floors*
              </label>
              <input
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 capitalize"
                value={listing.floors}
                onChange={(e) => updateField("floors", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <label className="flex gap-2 text-black font-bold text-sm">
                <TbSofa size={20} className="text-orange-500" /> Furnishing
              </label>
              <select
                value={listing.is_furnished}
                // onChange={(e) => updateField("is_furnished", e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 capitalize"
              >
                <option value="" disabled>
                  Select Furnishing
                </option>
                <option value="Fully-Furnished">Fully-Furnished</option>
                <option value="Semi-Furnished">Semi-Furnished</option>
                <option value="UnFurnished">Un-Furnished</option>
              </select>
            </div>

            <div className="flex flex-col gap-2 w-full">
              <label className="flex gap-2 text-black font-bold text-sm">
                <TbSquareCheck size={20} className="text-orange-500" /> Perch*
              </label>
              <input
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 capitalize"
                value={listing.perches}
                onChange={(e) => updateField("perches", Number(e.target.value))}
              />
            </div>

            <div className="flex flex-col gap-2 w-full">
              <label className="flex gap-2 text-black font-bold text-sm">
                <TbBuildingEstate size={20} className="text-orange-500" />{" "}
                Building Age*
              </label>
              <input
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 capitalize"
                value={listing.building_age}
                onChange={(e) => updateField("building_age", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2 w-full">
              <label className="flex gap-2 text-black font-bold text-sm">
                <TbHome size={22} className="text-orange-500" /> Property Type*
              </label>
              <select
                value={listing.property_type}
                onChange={(e) => updateField("property_type", e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 capitalize"
                required
              >
                <option value="" disabled>
                  Select Type
                </option>
                <option value="Apartment">Apartment</option>
                <option value="House">House</option>
                <option value="Land">Lands</option>
                <option value="Comm. Building/Shop">
                  Commercial Building/Shop
                </option>
                <option value="Commercial Land">Commercial Land</option>
                <option value="Villa">Villas</option>
              </select>
            </div>

            <div className="flex flex-col gap-2 w-full">
              <label className="flex gap-2 text-black font-bold text-sm">
                <TbHome2 size={22} className="text-orange-500" /> Listing Type*
              </label>
              <select
                name="listing_type"
                value={listing.listing_type}
                onChange={(e) => updateField("listing_type", e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 capitalize"
                required
              >
                <option value="" disabled>
                  Select Type
                </option>
                <option value="Sale">Sale</option>
                <option value="Rent">Rent</option>
                <option value="Lease">Lease</option>
              </select>
            </div>

            <div className="flex flex-col gap-2 w-full">
              <label className="flex gap-2 text-black font-bold text-sm">
                <TbRulerMeasure size={20} className="text-orange-500" /> Sqft.*
              </label>
              <input
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 capitalize"
                value={listing.sqft}
                onChange={(e) => updateField("sqft", Number(e.target.value))}
              />
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-3 border-b border-gray-200 pb-8">
            <label className="text-black font-bold text-sm">
              Description<span className="text-orange-500">*</span>
            </label>
            <textarea
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 capitalize"
              rows={5}
              value={listing.description}
              onChange={(e) => updateField("description", e.target.value)}
            />
          </div>

          {/* Features */}
          <div className="flex flex-col gap-4">
            <label className="text-black font-bold text-sm">Amenities</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-semibold">
              {[
                "24/7 Security",
                // "High-Speed Internet",
                "Gym & Fitness Center",
                "Swimming Pool",
                "Air Conditioning",
                "CCTV Systems",
                "Backup Generator",
                "Solar Power & Hot Water",
                "Roller Shutter Gates",
              ].map((amenity) => (
                <label
                  key={amenity}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    name="amenities"
                    value={amenity}
                    checked={listing.amenities.includes(amenity)}
                    onChange={(e) => updateField("amenities", e.target.value)}
                    className="accent-blue-600 w-3 h-3"
                  />
                  <span className="text-gray-700 text-[15px]">{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mt-10 flex justify-end">
            <button
              onClick={saveChanges}
              disabled={saving}
              className="btn-orange-sm"
            >
              {saving ? "Updating…" : "Update Changes"}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {/* Contact Card */}
          <div className="bg-white shadow-lg border-2 border-orange-200 rounded-3xl p-8 md:p-10 flex flex-col gap-6 h-fit">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2 w-full">
                <label className="flex gap-2 text-black font-bold text-sm">
                  <TbEyeDollar size={20} className="text-orange-500" /> Price*
                </label>
                <input
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 capitalize"
                  value={listing.price}
                  onChange={(e) => updateField("price", Number(e.target.value))}
                />
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={listing.price_negotiable}
                    onChange={(e) =>
                      updateField("price_negotiable", e.target.checked)
                    }
                  />
                  <label
                    htmlFor="price_negotiable"
                    className="text-xs font-semibold"
                  >
                    Negotiable
                  </label>
                </div>
              </div>

              <div className="flex flex-col gap-2 w-full">
                <label className="flex gap-2 text-black font-bold text-sm">
                  <TbMapDollar size={20} className="text-orange-500" /> Full
                  Price*
                </label>
                <input
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 capitalize"
                  value={listing.full_price}
                  onChange={(e) => updateField("full_price", e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 text-sm pt-6 border-t border-gray-300">
              <h3 className="text-xl font-extrabold mb-2">Price</h3>
              <p className="text-3xl font-bold text-orange-500">
                LKR {listing.price?.toLocaleString()}
              </p>
              <p className="text-base font-semibold text-gray-700">
                {" "}
                ({listing.full_price} - Negotiable)
              </p>
            </div>

            <div className="flex flex-col gap-2 text-sm text-gray-500 pt-6 border-t border-gray-300">
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
                className="btn-light-sm btn-dynamic text-center select-none"
              >
                Back to Listings
              </Link>
            </div>
          </div>

          <div className="bg-white shadow-lg border-2 border-orange-200 rounded-3xl p-8 md:p-10 flex flex-col gap-6 h-fit">
            <h1 className="text-xl font-bold">Private Display</h1>

            <div className="flex flex-col gap-2 text-sm text-gray-600 pt-6 border-t border-gray-300">
              <p>
                Property Identity:{" "}
                <span className="font-semibold">
                  {listing.property_identity}
                </span>
              </p>
              <p>
                Contact Number:{" "}
                <span className="font-semibold">{listing.contact_number}</span>
              </p>
              <p>
                Actual Floor:{" "}
                <span className="font-semibold">{listing.actual_floor}</span>
              </p>
              <p>
                Property Location:{" "}
                <span className="font-semibold">
                  {listing.property_location}
                </span>
              </p>
            </div>

            <div className="flex flex-col lg:flex-row items-center gap-2.5 mt-4">
              <Link
                href="tel:+94761676603"
                className="btn-dark-sm btn-dynamic text-center select-none"
              >
                Contact Owner
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

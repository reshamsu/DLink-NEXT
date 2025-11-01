"use client";

import Link from "next/link";
import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { TbSend2 } from "react-icons/tb";

interface Listing {
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
  floors: string;
  building_age: string;
  price: string;
  amenities: string[];
  status: string;
  is_furnished: string;
  image_urls: string[];
}

const Page = () => {
  const [, setListings] = useState<Listing[]>([]); // removed unused variable warning
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [newListing, setNewListing] = useState<Listing>({
    property_title: "",
    property_subtitle: "",
    property_type: "",
    listing_type: "",
    city: "",
    location: "",
    description: "",
    bedrooms: "",
    bathrooms: "",
    perches: "",
    sqft: "",
    floors: "",
    building_age: "",
    price: "",
    amenities: [],
    status: "Available",
    is_furnished: "",
    image_urls: [],
  });

  const [images, setImages] = useState<FileList | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const target = e.target as HTMLInputElement;
      setNewListing((prev) => ({
        ...prev,
        amenities: target.checked
          ? [...prev.amenities, target.value]
          : prev.amenities.filter((f) => f !== target.value),
      }));
    } else {
      setNewListing((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageUpload = async (): Promise<string[]> => {
    if (!images || images.length === 0) return [];

    try {
      setUploading(true);
      const uploadedUrls: string[] = [];

      for (let i = 0; i < images.length; i++) {
        const file = images[i];

        if (file.size > 5 * 1024 * 1024) {
          alert(`${file.name} is too large! Max 5MB.`);
          continue;
        }

        const filePath = `images/${Date.now()}_${file.name}`;

        const { error: uploadError } = await supabase.storage
          .from("listings")
          .upload(filePath, file, { cacheControl: "3600", upsert: false });

        if (uploadError) {
          console.error("Upload error:", uploadError.message);
          continue;
        }

        const { data: publicUrlData } = supabase.storage
          .from("listings")
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrlData.publicUrl);
      }

      setMessage(`${uploadedUrls.length} image(s) uploaded successfully`);
      return uploadedUrls;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error uploading images:", error.message);
      } else {
        console.error("Unknown upload error:", error);
      }
      setMessage("Error uploading images");
      return [];
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const uploadedUrls = images ? await handleImageUpload() : [];

    const payload = {
      ...newListing,
      bedrooms: newListing.bedrooms ? Number(newListing.bedrooms) : null,
      bathrooms: newListing.bathrooms ? Number(newListing.bathrooms) : null,
      perches: newListing.perches ? Number(newListing.perches) : null,
      sqft: newListing.sqft ? Number(newListing.sqft) : null,
      floors: newListing.floors ? Number(newListing.floors) : null,
      price: newListing.price ? Number(newListing.price) : null,
      image_urls: uploadedUrls.length ? uploadedUrls : newListing.image_urls,
    };

    const { data, error } = await supabase
      .from("listings")
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error("Error adding listing:", error.message);
      alert("Failed to add listing. Check console for details.");
    } else {
      setListings((prev) => [...prev, data]);
      setNewListing({
        property_title: "",
        property_subtitle: "",
        property_type: "",
        listing_type: "",
        city: "",
        location: "",
        description: "",
        bedrooms: "",
        bathrooms: "",
        perches: "",
        sqft: "",
        floors: "",
        building_age: "",
        price: "",
        amenities: [],
        status: "Available",
        is_furnished: "",
        image_urls: [],
      });
      setImages(null);
      setMessage("Listing added successfully!");
      alert("Listing added successfully!");
    }

    setLoading(false);
  };

  return (
    <div className="bg-gray-200 text-gray-800 relative">
      <div className="max-w-4xl mx-auto pt-26 md:pb-10 h-full">
        <div className="bg-white border-none md:border-2 border-gray-100 relative w-full h-full md:h-fit md:rounded-3xl overflow-hidden shadow-none md:shadow-lg flex flex-col justify-between md:justify-normal">
          <div className="flex flex-col text-center md:text-start gap-1 border-b-2 border-gray-100 p-8 pb-6">
            <h2 className="text-lg font-bold">
              Add a New Listing to{" "}
              <span className="text-orange-400">D-Link Colombo</span>
            </h2>
            <p className="text-sm text-gray-400 max-w-3xl">
              Send your Listing Info for display on{" "}
              <Link href="/" className="underline">
                D-Link Colombo
              </Link>
            </p>
          </div>

          <form
            className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full 2xl:text-base overflow-hidden group p-8 md:p-10 border-b-2 border-gray-100"
            id="listingForm"
            onSubmit={handleSubmit}
            method="post"
          >
            <div className="flex flex-col gap-6">
              {/* Common Fields */}
              <div className="flex flex-col md:grid-cols-2 gap-6 w-full">
                <div className="flex flex-col gap-2 w-full">
                  <label htmlFor="property_title" className="text-sm font-bold">
                    Property Title*
                  </label>
                  <input
                    name="property_title"
                    value={newListing.property_title}
                    onChange={handleChange}
                    type="text"
                    placeholder="Enter Title"
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5"
                    required
                  />
                </div>

                <div className="flex flex-col gap-2 w-full">
                  <label
                    htmlFor="property_subtitle"
                    className="text-sm font-bold"
                  >
                    Property Subtitle*
                  </label>
                  <input
                    name="property_subtitle"
                    value={newListing.property_subtitle}
                    onChange={handleChange}
                    placeholder="Enter Subtitle"
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5"
                    required
                  />
                </div>

                <div className="flex flex-col gap-2 w-full">
                  <label htmlFor="property_type" className="text-sm font-bold">
                    Property Type*
                  </label>
                  <select
                    name="property_type"
                    value={newListing.property_type}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5"
                  >
                    <option value="" disabled>
                      Select Type
                    </option>
                    <option value="Apartment">Apartment</option>
                    <option value="House">House</option>
                    <option value="Land">Lands</option>
                    <option value="Villa">Villas</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2 w-full">
                  <label htmlFor="city" className="text-sm font-bold">
                    Town/City*
                  </label>
                  <select
                    name="city"
                    value={newListing.city}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5"
                  >
                    <option value="" disabled>
                      Select City
                    </option>
                    <option value="Dehiwela">Dehiwela</option>
                    <option value="Wellawatta">Wellawatta</option>
                    <option value="Mount_lavinia">Mount Lavinia</option>
                    <option value="Bambalapitiya">Bambalapitiya</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2 w-full md:col-span-2">
                  <label htmlFor="description" className="text-sm font-bold">
                    Description*
                  </label>
                  <textarea
                    name="description"
                    value={newListing.description}
                    onChange={handleChange}
                    placeholder="Enter Description"
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5"
                    required
                  />
                </div>
              </div>

              {/* Bedrooms & Bathrooms */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                <div className="flex flex-col gap-2 w-full">
                  <label htmlFor="bedrooms" className="text-sm font-bold">
                    Bedrooms*
                  </label>
                  <input
                    name="bedrooms"
                    value={newListing.bedrooms}
                    onChange={handleChange}
                    type="number"
                    placeholder="Bedrooms"
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5"
                  />
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <label htmlFor="bathrooms" className="text-sm font-bold">
                    Bathrooms*
                  </label>
                  <input
                    name="bathrooms"
                    value={newListing.bathrooms}
                    onChange={handleChange}
                    type="number"
                    placeholder="Bathrooms"
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5"
                  />
                </div>
              </div>

              {/* Floors & Age */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                <div className="flex flex-col gap-2 w-full">
                  <label htmlFor="floors" className="text-sm font-bold">
                    Floors*
                  </label>
                  <input
                    name="floors"
                    value={newListing.floors}
                    onChange={handleChange}
                    type="number"
                    placeholder="Floors"
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5"
                  />
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <label htmlFor="building_age" className="text-sm font-bold">
                    Building Age*
                  </label>
                  <input
                    name="building_age"
                    value={newListing.building_age}
                    onChange={handleChange}
                    type="number"
                    placeholder="Building Age"
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5"
                  />
                </div>
              </div>

              {/* Sqft & Perches */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                <div className="flex flex-col gap-2 w-full">
                  <label htmlFor="sqft" className="text-sm font-bold">
                    Sqft.*
                  </label>
                  <input
                    name="sqft"
                    value={newListing.sqft}
                    onChange={handleChange}
                    type="number"
                    placeholder="Enter Sqft."
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <label htmlFor="perches" className="text-sm font-bold">
                    Perches*
                  </label>
                  <input
                    name="perches"
                    value={newListing.perches}
                    onChange={handleChange}
                    type="number"
                    placeholder="Perches"
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="flex flex-col gap-6">
              {/* Price */}
              <div className="flex flex-col gap-2 w-full">
                <label htmlFor="price" className="text-sm font-bold">
                  Price (LKR)*
                </label>
                <input
                  name="price"
                  value={newListing.price}
                  onChange={handleChange}
                  type="number"
                  placeholder="Enter Price"
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5"
                  required
                />
              </div>

              {/* Location */}
              <div className="flex flex-col gap-2 w-full">
                <label htmlFor="location" className="text-sm font-bold">
                  Location*
                </label>
                <select
                  name="location"
                  value={newListing.location}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5"
                >
                  <option value="" disabled>
                    Select Area
                  </option>
                  <option value="Land Side">Land Side</option>
                  <option value="Sea Side">Sea Side</option>
                </select>
              </div>

              {/* Listing Type */}
              <div className="flex flex-col gap-2 w-full">
                <label htmlFor="listing_type" className="text-sm font-bold">
                  Listing Type*
                </label>
                <select
                  name="listing_type"
                  value={newListing.listing_type}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5"
                >
                  <option value="" disabled>
                    Select Type
                  </option>
                  <option value="Sale">Sale</option>
                  <option value="Rent">Rent</option>
                  <option value="Lease">Lease</option>
                </select>
              </div>

              {/* Furnishing */}
              <div className="flex flex-col gap-2 w-full">
                <label htmlFor="is_furnished" className="text-sm font-bold">
                  Furnishing*
                </label>
                <select
                  name="is_furnished"
                  value={newListing.is_furnished}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5"
                >
                  <option value="" disabled>
                    Select Furnishing
                  </option>
                  <option value="Furnished">Furnished</option>
                  <option value="UnFurnished">Un-Furnished</option>
                </select>
              </div>

              {/* Status */}
              <div className="flex flex-col gap-2 w-full">
                <label htmlFor="status" className="text-sm font-bold">
                  Status
                </label>
                <select
                  name="status"
                  value={newListing.status}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5"
                >
                  <option value="Available">Available</option>
                  <option value="Unavailable">Unavailable</option>
                  <option value="Sold">Sold</option>
                </select>
              </div>

              {/* Amenities */}
              <div className="flex flex-col gap-4 w-full">
                <label htmlFor="amenities" className="text-sm font-bold">
                  Amenities
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-semibold">
                  {[
                    "24/7 Lift Access",
                    "Secure Parking",
                    "High-Speed Internet",
                    "Gym & Fitness Center",
                    "Swimming Pool",
                    "Air Conditioning",
                    "Security Systems",
                  ].map((amenity) => (
                    <label
                      key={amenity}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        name="amenities"
                        value={amenity}
                        checked={newListing.amenities.includes(amenity)}
                        onChange={handleChange}
                        className="accent-blue-600 w-4 h-4"
                      />
                      <span className="text-gray-700 text-[15px]">
                        {amenity}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Upload Images */}
              <div className="flex flex-col gap-2 w-full">
                <label htmlFor="upload" className="text-sm font-bold">
                  Upload Images*
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setImages(e.target.files)}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5"
                />
              </div>

              {message && (
                <p className="text-sm text-center text-gray-600 mt-2 w-full">
                  {message}
                </p>
              )}

              {/* Submit */}
              <div className="flex items-end justify-end">
                <button
                  type="submit"
                  disabled={loading || uploading}
                  className="select-none btn-orange-base btn-dynamic flex items-center gap-2"
                >
                  {loading || uploading ? "Uploading..." : "Submit Listing"}
                  <TbSend2 size={22} />
                </button>
              </div>
            </div>
          </form>

          <p className="text-xs bg-gray-50 text-gray-400 text-center p-6">
            By continuing, you agree to D-Link Colombo&apos;s{" "}
            <Link href="/new_listing" className="underline">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/new_listing" className="underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;

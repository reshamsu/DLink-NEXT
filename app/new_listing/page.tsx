"use client";

import Link from "next/link";
import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { TbSend2 } from "react-icons/tb";

const Page = () => {
  const [formData, setFormData] = useState({
    property_title: "",
    property_subtitle: "",
    property_type: "",
    listing_type: "",
    city: "",
    location: "",
    owner: "",
    description: "",
    bedrooms: "",
    bathrooms: "",
    perches: "",
    sqft: "",
    floors: "",
    building_age: "",
    maintain_fee: "",
    price: "",
    amenities: "",
    remarks: "",
    status: "available",
    is_furnished: "",
  });

  const [images, setImages] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Input handler
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Upload + insert
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      let imageUrls: string[] = [];

      // Upload images if any
      if (images && images.length > 0) {
        const uploads = Array.from(images).map(async (file) => {
          const fileName = `${Date.now()}-${file.name}`;

          // Upload file
          const { error: uploadError } = await supabase.storage
            .from("listings")
            .upload(fileName, file);

          if (uploadError) throw uploadError;

          // Get public URL
          const { data: publicUrlData } = supabase.storage
            .from("listings")
            .getPublicUrl(fileName);

          return publicUrlData.publicUrl || null;
        });

        // Wait for all uploads and filter out nulls
        imageUrls = (await Promise.all(uploads)).filter(
          (url): url is string => !!url
        );
      }

      // Prepare data for insertion
      const insertData = {
        ...formData,
        bedrooms: parseInt(formData.bedrooms) || null,
        bathrooms: parseInt(formData.bathrooms) || null,
        perches: parseInt(formData.perches) || null,
        sqft: parseInt(formData.sqft) || null,
        floors: parseInt(formData.floors) || null,
        price: parseInt(formData.price) || null,
        image_urls: imageUrls.length ? imageUrls : [],
        status: formData.status || "available",
      };

      const { error: insertError } = await supabase
        .from("listings")
        .insert([insertData]);

      if (insertError) throw insertError;

      setMessage("✅ Listing added successfully!");
      setFormData({
        property_title: "",
        property_subtitle: "",
        property_type: "",
        listing_type: "",
        city: "",
        location: "",
        owner: "",
        description: "",
        bedrooms: "",
        bathrooms: "",
        perches: "",
        sqft: "",
        floors: "",
        building_age: "",
        maintain_fee: "",
        price: "",
        amenities: "",
        remarks: "",
        status: "available",
        is_furnished: "",
      });
      setImages(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.warn("Upload failed:", err.message);
        setMessage(`❌ Error: ${err.message}`);
      } else {
        console.warn("Upload failed:", err);
        setMessage("❌ Error: Unknown error occurred");
      }
    }
  };

  return (
    <div className="bg-gray-200 text-gray-800 relative">
      <div className="max-w-4xl mx-auto pt-26 md:pb-10 h-full">
        <div className="bg-white border-none md:border-2 border-gray-100 relative w-full h-full md:h-fit md:rounded-3xl overflow-hidden shadow-none md:shadow-lg flex flex-col justify-between md:justify-normal">
          <div className="flex flex-col text-center md:text-start gap-1 border-b-2 border-gray-100 p-8 pb-6">
            <h2 className="text-lg font-bold">
              {" "}
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
                    value={formData.property_title}
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
                    value={formData.property_subtitle}
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
                    value={formData.property_type}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5"
                  >
                    <option value="" disabled>
                      Select Type
                    </option>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="land">Lands</option>
                    <option value="villa">Villas</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2 w-full">
                  <label htmlFor="city" className="text-sm font-bold">
                    Town/City*
                  </label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5"
                  >
                    <option value="" disabled>
                      Select City
                    </option>
                    <option value="dehiwela">Dehiwela</option>
                    <option value="wellawatta">Wellawatta</option>
                    <option value="mount_lavinia">Mount Lavinia</option>
                    <option value="bambalapitiya">Bambalapitiya</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2 w-full md:col-span-2">
                  <label htmlFor="description" className="text-sm font-bold">
                    Description*
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter Description"
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                <div className="flex flex-col gap-2 w-full">
                  <label htmlFor="bedrooms" className="text-sm font-bold">
                    Bedrooms*
                  </label>
                  <input
                    name="bedrooms"
                    value={formData.bedrooms}
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
                    value={formData.bathrooms}
                    onChange={handleChange}
                    type="number"
                    placeholder="Bathrooms"
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                <div className="flex flex-col gap-2 w-full">
                  <label htmlFor="floors" className="text-sm font-bold">
                    Floors*
                  </label>
                  <input
                    name="floors"
                    value={formData.floors}
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
                    value={formData.building_age}
                    onChange={handleChange}
                    type="number"
                    placeholder="Building Age"
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                <div className="flex flex-col gap-2 w-full">
                  <label htmlFor="sqft" className="text-sm font-bold">
                    Sqft.*
                  </label>
                  <input
                    name="sqft"
                    value={formData.sqft}
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
                    value={formData.perches}
                    onChange={handleChange}
                    type="number"
                    placeholder="Perches"
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2 w-full">
                <label htmlFor="price" className="text-sm font-bold">
                  Price (LKR)*
                </label>
                <input
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  type="number"
                  placeholder="Enter Price"
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5"
                  required
                />
              </div>

              <div className="flex flex-col gap-2 w-full">
                <label htmlFor="location" className="text-sm font-bold">
                  Location*
                </label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5"
                >
                  <option value="" disabled>
                      Select Area
                    </option>
                  <option value="land_side">Land Side</option>
                  <option value="sea_side">Sea Side</option>
                </select>
              </div>

              <div className="flex flex-col gap-2 w-full">
                <label htmlFor="listing_type" className="text-sm font-bold">
                  Listing Type*
                </label>
                <select
                  name="listing_type"
                  value={formData.listing_type}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5"
                >
                  <option value="" disabled>
                      Select Type
                    </option>
                  <option value="sale">Sale</option>
                  <option value="rent">Rent</option>
                  <option value="lease">Lease</option>
                </select>
              </div>

              <div className="flex flex-col gap-2 w-full">
                <label htmlFor="is_furnished" className="text-sm font-bold">
                  Furnishing*
                </label>
                <select
                  name="is_furnished"
                  value={formData.is_furnished}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5"
                >
                  <option value="" disabled>
                      Select Furnishing
                    </option>
                  <option value="furnished">Furnished</option>
                  <option value="unfurnished">UnFurnished</option>
                  <option value="fully-furnished">Fully-Furnished</option>
                </select>
              </div>

              <div className="flex flex-col gap-2 w-full">
                <label htmlFor="status" className="text-sm font-bold">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5"
                >
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                  <option value="sold">Sold</option>
                </select>
              </div>

              <div className="flex flex-col gap-4 w-full">
                <label htmlFor="status" className="text-sm font-bold">
                  Amenities
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-semibold">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="support"
                      value="24/7 Support"
                      className="accent-blue-600 w-4 h-4"
                    />
                    <span className="text-gray-700 text-[15px]">
                      24/7 Lift Access
                    </span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="support"
                      value="24/7 Support"
                      className="accent-blue-600 w-4 h-4"
                    />
                    <span className="text-gray-700 text-[15px]">
                      Secure Parking
                    </span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="support"
                      value="24/7 Support"
                      className="accent-blue-600 w-4 h-4"
                    />
                    <span className="text-gray-700 text-[15px]">
                      High-Speed Internet
                    </span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="support"
                      value="24/7 Support"
                      className="accent-blue-600 w-4 h-4"
                    />
                    <span className="text-gray-700 text-[15px]">
                      Gym & Fitness Center
                    </span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="support"
                      value="24/7 Support"
                      className="accent-blue-600 w-4 h-4"
                    />
                    <span className="text-gray-700 text-[15px]">
                      Swimming Pool
                    </span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="support"
                      value="24/7 Support"
                      className="accent-blue-600 w-4 h-4"
                    />
                    <span className="text-gray-700 text-[15px]">
                      Air Conditioning
                    </span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="support"
                      value="24/7 Support"
                      className="accent-blue-600 w-4 h-4"
                    />
                    <span className="text-gray-700 text-[15px]">
                      Security Systems
                    </span>
                  </label>
                </div>
              </div>

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
                  disabled={loading}
                  className="select-none btn-orange-base btn-dynamic"
                >
                  {loading ? "Uploading..." : "Submit Listing"}
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

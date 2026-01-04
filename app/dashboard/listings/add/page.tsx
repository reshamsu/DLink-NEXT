"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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

  actual_floor: string;
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

  owner_name: string;
  property_location: string;
  property_identity: string;
  contact_number: string;

  image_urls: string[];
}

const Page = () => {
  if (!supabase) {
    return (
      <div className="p-10 text-center text-teal-600">
        Supabase not configured.
      </div>
    );
  }

  const [, setListing] = useState<Listing[]>([]); // removed unused variable warning
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const router = useRouter();

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
    actual_floor: "",
    floors: "",
    building_age: "",
    price: "",
    full_price: "",
    approx: false,
    price_negotiable: false,
    property_documents: [],
    lift_access: "",
    vehicle_park: "",
    remarks: "",
    amenities: [],
    status: "Available",
    is_furnished: "",
    owner_name: "",
    property_location: "",
    property_identity: "",
    contact_number: "",
    image_urls: [],
  });

  const [images, setImages] = useState<FileList | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const target = e.target;
    const { name, value } = target;

    // ✅ Handle checkboxes safely
    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      const checked = target.checked;

      if (name === "amenities") {
        setNewListing((prev) => ({
          ...prev,
          amenities: checked
            ? [...prev.amenities, value]
            : prev.amenities.filter((a) => a !== value),
        }));
        return;
      }

      if (name === "property_documents") {
        setNewListing((prev) => ({
          ...prev,
          property_documents: checked
            ? [...prev.property_documents, value]
            : prev.property_documents.filter((d) => d !== value),
        }));
        return;
      }

      if (name === "approx") {
        setNewListing((prev) => ({
          ...prev,
          approx: checked,
        }));
        return;
      }

      if (name === "price_negotiable") {
        setNewListing((prev) => ({
          ...prev,
          price_negotiable: checked,
        }));
        return;
      }
    }

    // ✅ Default handler (text / select / textarea)
    setNewListing((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = async (): Promise<string[]> => {
    if (!images || images.length === 0) return [];

    try {
      setUploading(true);
      const uploadedUrls: string[] = [];

      for (let i = 0; i < images.length; i++) {
        const file = images[i];

        if (file.size > 5 * 2048 * 2048) {
          alert(`${file.name} is too large! Max 5MB.`);
          continue;
        }

        const filePath = `images/${Date.now()}_${file.name}`;

        const { error: uploadError } = await supabase.storage
          .from("listing")
          .upload(filePath, file, { cacheControl: "3600", upsert: false });

        if (uploadError) {
          console.error("Upload error:", uploadError.message);
          continue;
        }

        const { data: publicUrlData } = supabase.storage
          .from("listing")
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

  const handleRadio = (name: string, value: number) => {
    setNewListing((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const uploadedUrls = images ? await handleImageUpload() : [];

    const payload = {
      ...newListing,
      bedrooms: newListing.bedrooms ? Number(newListing.bedrooms) : null,
      bathrooms: newListing.bathrooms ? Number(newListing.bathrooms) : null,
      sqft: newListing.sqft ? Number(newListing.sqft) : null,

      floors: newListing.floors || null,
      building_age: newListing.building_age || null,

      price: newListing.price || null,
      full_price: newListing.full_price || null,
      approx: newListing.approx || null,
      contact_number: newListing.contact_number || null,

      image_urls: uploadedUrls.length ? uploadedUrls : newListing.image_urls,
    };

    const { data, error } = await supabase
      .from("listing")
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error("Error adding listing:", error.message);
      alert("Failed to add listing. Check console for details.");
    } else {
      setListing((prev) => [...prev, data]);
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
        actual_floor: "",
        floors: "",
        building_age: "",
        price: "",
        full_price: "",
        approx: false,
        price_negotiable: false,
        property_documents: [],
        lift_access: "None",
        vehicle_park: "",
        remarks: "",
        amenities: [],
        status: "Available",
        owner_name: "",
        property_location: "",
        property_identity: "",
        contact_number: "",
        is_furnished: "",
        image_urls: [],
      });
      setImages(null);
      setMessage("Listing added successfully!");
      alert("Listing added successfully!");
    }

    if (error) {
      console.error("Error adding listing:", error.message);
      alert("Failed to add listing. Check console for details.");
    } else {
      // ✅ redirect to the newly created listing
      router.push(`/listing/${data.id}`);
    }

    setLoading(false);
  };

  return (
    <div className="bg-gray-100 text-gray-800 relative">
      <div className="max-w-5xl mx-auto lg:ml-80 md:px-6 pt-24 lg:pt-16 pb-10 flex flex-col gap-6">
        <div className="bg-white border-none md:border-2 border-gray-100 relative w-full h-full md:h-fit md:rounded-3xl overflow-hidden shadow-none md:shadow-lg flex flex-col justify-between md:justify-normal">
          <div className="flex flex-col text-center md:text-start gap-1 border-b-2 border-gray-100 p-8 pb-6">
            <h2 className="text-lg font-bold">
              Add a New Listing to{" "}
              <span className="text-orange-500">D-Link Colombo</span>
            </h2>
            <p className="text-xs text-gray-400 max-w-3xl">
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
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 capitalize"
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
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 capitalize"
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
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 capitalize"
                    required
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
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 capitalize"
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

                <div className="flex flex-col gap-2 w-full md:col-span-2">
                  <label htmlFor="description" className="text-sm font-bold">
                    Description*
                  </label>
                  <textarea
                    name="description"
                    value={newListing.description}
                    onChange={handleChange}
                    placeholder="Enter Description"
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 capitalize"
                    required
                  />
                </div>
              </div>

              {/* Bedrooms & Bathrooms */}
              <div className="grid grid-cols-2 gap-6 w-full">
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
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 capitalize"
                    required
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
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 capitalize"
                    required
                  />
                </div>
              </div>

              {/* Floors & Age */}
              <div className="grid grid-cols-2 gap-6 w-full">
                <div className="flex flex-col gap-2 w-full">
                  <label htmlFor="floors" className="text-sm font-bold">
                    Floors*
                  </label>
                  <input
                    name="floors"
                    value={newListing.floors}
                    onChange={handleChange}
                    placeholder="Floors"
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 capitalize"
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
                    placeholder="Perches"
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 capitalize"
                    required
                  />
                </div>
              </div>

              {/* Sqft & Perches */}
              <div className="grid grid-cols-2 gap-6 w-full">
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
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 capitalize"
                    required
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
                    placeholder="Building Age"
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 capitalize"
                    required
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newListing.approx}
                      onChange={(e) =>
                        setNewListing((p) => ({
                          ...p,
                          approx: e.target.checked,
                        }))
                      }
                    />

                    <label htmlFor="approx" className="text-xs font-semibold">
                      Approx.
                    </label>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="flex flex-col gap-2 w-full">
                <label htmlFor="price" className="text-sm font-bold">
                  Price (LKR)*
                </label>
                <input
                  name="price"
                  value={newListing.price}
                  onChange={handleChange}
                  placeholder="Enter Price"
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 capitalize"
                  required
                />
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newListing.price_negotiable}
                    onChange={(e) =>
                      setNewListing((p) => ({
                        ...p,
                        price_negotiable: e.target.checked,
                      }))
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
                <label htmlFor="price" className="text-sm font-bold">
                  Price in Full (LKR)*
                </label>
                <input
                  name="full_price"
                  value={newListing.full_price}
                  onChange={handleChange}
                  placeholder="Enter Lakhs Amount"
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 capitalize"
                  required
                />
              </div>
            </div>

            {/* Right column */}
            <div className="flex flex-col gap-6">
              {/* Location & Listing Type */}
              <div className="grid grid-cols-2 gap-6 w-full">
                <div className="flex flex-col gap-2 w-full">
                  <label htmlFor="location" className="text-sm font-bold">
                    Location*
                  </label>
                  <select
                    name="location"
                    value={newListing.location}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 capitalize"
                    required
                  >
                    <option value="" disabled>
                      Select Area
                    </option>
                    <option value="Land Side">Land Side</option>
                    <option value="Sea Side">Sea Side</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2 w-full">
                  <label htmlFor="listing_type" className="text-sm font-bold">
                    Listing Type*
                  </label>
                  <select
                    name="listing_type"
                    value={newListing.listing_type}
                    onChange={handleChange}
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
              </div>

              <div className="flex flex-col gap-4 w-full">
                <label htmlFor="amenities" className="text-sm font-bold">
                  Property Documents*
                </label>
                <div className="grid grid-cols-2 gap-4 font-semibold">
                  {[
                    "Sales Agreement",
                    "Deed",
                    "COC",
                    "Bimsaviya Certificate",
                  ].map((property_documents) => (
                    <label
                      key={property_documents}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        name="property_documents"
                        value={property_documents}
                        checked={newListing.property_documents.includes(
                          property_documents
                        )}
                        onChange={handleChange}
                        className="accent-blue-600 w-4 h-4"
                      />
                      <span className="text-gray-700 text-[15px]">
                        {property_documents}
                      </span>
                    </label>
                  ))}
                </div>

                <div className="flex flex-col gap-2 w-full">
                  <label htmlFor="remarks" className="text-sm font-bold">
                    Remarks
                  </label>
                  <input
                    name="remarks"
                    value={newListing.remarks}
                    onChange={handleChange}
                    placeholder="Enter Remarks"
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 capitalize"
                  />
                </div>
              </div>

              {/* Furnishing */}
              <div className="flex flex-col gap-2 w-full">
                <label htmlFor="is_furnished" className="text-sm font-bold">
                  Furnishing
                </label>
                <select
                  name="is_furnished"
                  value={newListing.is_furnished}
                  onChange={handleChange}
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

              {/* Status */}
              <div className="flex flex-col gap-2 w-full">
                <label htmlFor="status" className="text-sm font-bold">
                  Status*
                </label>
                <select
                  name="status"
                  value={newListing.status}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 capitalize"
                  required
                >
                  <option value="Available">Available</option>
                  <option value="Unavailable">Unavailable</option>
                  <option value="Sold">Sold</option>
                </select>
              </div>

              {/* Amenities */}
              <div className="flex flex-col gap-3 w-full">
                <label htmlFor="amenities" className="text-sm font-bold">
                  Amenities
                </label>
                <div className="grid grid-cols-1 gap-3 font-semibold">
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

              {/* Lift Access */}
              <div className="flex flex-col gap-3 w-full">
                <label className="text-sm font-bold">Lift Access</label>
                <div className="grid grid-cols-4 gap-4">
                  {["None", "1 Lift", "2 Lifts", "3 Lifts"].map((option) => (
                    <label
                      key={option}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="lift_access"
                        value={option}
                        checked={newListing.lift_access === option}
                        onChange={(e) =>
                          setNewListing((p) => ({
                            ...p,
                            lift_access: e.target.value,
                          }))
                        }
                        className="accent-blue-600 w-4 h-4"
                        required
                      />
                      <span className="text-gray-700 text-sm">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Vehicle Park */}
              <div className="flex flex-col gap-3 w-full">
                <label className="text-sm font-bold">Vehicle Parking</label>
                <div className="grid grid-cols-2 gap-4">
                  {["None", "1 Parking", "2 Parking", "3 Parking & above"].map(
                    (option) => (
                      <label
                        key={option}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="vehicle_park"
                          value={option}
                          checked={newListing.vehicle_park === option}
                          onChange={(e) =>
                            setNewListing((p) => ({
                              ...p,
                              vehicle_park: e.target.value,
                            }))
                          }
                          className="accent-blue-600 w-4 h-4"
                        />
                        <span className="text-gray-700 text-sm">{option}</span>
                      </label>
                    )
                  )}
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
                  required
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
        <div className="bg-white border-none md:border-2 border-gray-100 relative w-full h-full md:h-fit md:rounded-3xl overflow-hidden shadow-none md:shadow-lg flex flex-col justify-between md:justify-normal">
          <div className="flex flex-col text-start gap-1 border-b-2 border-gray-100 p-8 pb-6">
            <h2 className="text-base font-bold">
              Add Contact Info to Listing for{" "}
              <span className="text-orange-500">D-Link Colombo</span>
            </h2>
            <p className="text-xs text-gray-400 max-w-3xl">
              Send your Listing Info for display on{" "}
              <Link href="/" className="underline">
                D-Link Colombo
              </Link>
            </p>
          </div>

          {/* <form
            className="flex flex-col gap-10 w-full 2xl:text-base overflow-hidden group p-8 md:p-10 border-b-2 border-gray-100"
            // id="listingForm"
            // method="post"
          >
            <div className="flex flex-col gap-6">
           
              <div className="flex flex-col md:grid-cols-2 gap-6 w-full">
                <div className="flex flex-col gap-2 w-full">
                  <label htmlFor="property_title" className="text-sm font-bold">
                    Property Ownership's Name
                  </label>
                  <input
                    name="owner_name"
                    value={newListing.owner_name}
                    onChange={handleChange}
                    placeholder="Enter Name"
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 capitalize"
                  />
                </div>

                <div className="flex flex-col gap-2 w-full">
                  <label htmlFor="property_title" className="text-sm font-bold">
                    Apartment Name/Location
                  </label>
                  <input
                    name="property_location"
                    value={newListing.property_location}
                    onChange={handleChange}
                    placeholder="Enter Location"
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 capitalize"
                  />
                </div>

                <div className="flex flex-col gap-2 w-full">
                  <label htmlFor="actual_floor" className="text-sm font-bold">
                    Actual Floor
                  </label>
                  <input
                    name="actual_floor"
                    value={newListing.actual_floor}
                    onChange={handleChange}
                    placeholder="Enter Floor"
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 capitalize"
                  />
                  <p className="text-[10px] text-gray-500">
                    For personal references Only. Not publicly displayed*
                  </p>
                </div>

                <div className="flex flex-col gap-2 w-full">
                  <label htmlFor="is_furnished" className="text-sm font-bold">
                    Property Identity
                  </label>
                  <select
                    name="property_identity"
                    value={newListing.property_identity}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 capitalize"
                  >
                    <option value="" disabled>
                      Select Identity
                    </option>
                    <option value="Owner">Owner</option>
                    <option value="Agent">Agent</option>
                    <option value="Investor">Investor</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2 w-full">
                  <label htmlFor="property_title" className="text-sm font-bold">
                    Contact Number
                  </label>
                  <input
                    name="contact_number"
                    value={newListing.contact_number}
                    onChange={handleChange}
                    type="number"
                    placeholder="Enter Contact Number"
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 capitalize"
                  />
                </div>
              </div>
              
              {message && (
                <p className="text-sm text-center text-gray-600 mt-2 w-full">
                  {message}
                </p>
              )}

          
              <div className="flex flex-col items-end justify-end">
                <button
                  type="submit"
                  disabled={loading || uploading}
                  className="select-none btn-orange-base btn-dynamic flex items-center gap-2"
                >
                  {loading || uploading ? "Uploading..." : "Submit Contact"}
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
          </p> */}
        </div>
      </div>
    </div>
  );
};

export default Page;

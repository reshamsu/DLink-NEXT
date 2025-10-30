"use client";
import Link from "next/link";
import React, { useState } from "react";

const Page = () => {
  const [listingType, setListingType] = useState("property");

  return (
    <div className="bg-gray-100 text-gray-800 relative">
      <div className="max-w-2xl mx-auto pt-26 pb-10 h-full flex items-center">
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
            className="flex flex-col items-end gap-6 w-full 2xl:text-base overflow-hidden group p-8 md:p-10 border-b-2 border-gray-100"
            id="listingForm"
            method="post"
          >
            {/* Dropdown */}
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="listing" className="text-sm font-bold">
                Select Listing Type:
              </label>
              <select
                name="listing"
                id="listing"
                value={listingType}
                onChange={(e) => setListingType(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5"
              >
                <option value="apartment">Apartments</option>
                <option value="house">House</option>
                <option value="land">Lands</option>
                <option value="villa">Villas</option>
              </select>
            </div>

            {/* Common Fields */}
            <div className="flex flex-col md:grid-cols-2 gap-6 w-full">
              <div className="flex flex-col gap-2 w-full">
                <label htmlFor="title" className="text-sm font-bold">
                  Listing Title*
                </label>
                <input
                  id="title"
                  type="text"
                  placeholder="Enter Title"
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5"
                  required
                />
              </div>

              <div className="flex flex-col gap-2 w-full">
                <label htmlFor="subtitle" className="text-sm font-bold">
                  Listing Subtitle*
                </label>
                <input
                  id="subtitle"
                  placeholder="Enter Subtitle"
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5"
                  required
                />
              </div>

              <div className="flex flex-col gap-2 w-full">
                <label htmlFor="location" className="text-sm font-bold">
                  Location*
                </label>
                <select
                  name="listing"
                  id="listing"
                  value={listingType}
                  onChange={(e) => setListingType(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5"
                >
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
                  id="description"
                  placeholder="Enter Description"
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              <div className="flex flex-col gap-2 w-ful">
                <label htmlFor="listing" className="text-sm font-bold">
                  Area of Property*
                </label>
                <select
                  name="listing"
                  id="listing"
                  value={listingType}
                  onChange={(e) => setListingType(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5"
                >
                  <option value="land_side">Land Side</option>
                  <option value="sea_side">Sea Side</option>
                </select>
              </div>
              <div className="flex flex-col gap-2 w-ful">
                <label htmlFor="listing" className="text-sm font-bold">
                  Furnishing*
                </label>
                <select
                  name="listing"
                  id="listing"
                  value={listingType}
                  onChange={(e) => setListingType(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5"
                >
                  <option value="furnished">Furnished</option>
                  <option value="unfurnished">UnFurnished</option>
                  <option value="fully-furnished">Fully-Furnished</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              <div className="flex flex-col gap-2 w-ful">
                <label htmlFor="listing" className="text-sm font-bold">
                  Bedrooms*
                </label>
                <select
                  name="listing"
                  id="listing"
                  value={listingType}
                  onChange={(e) => setListingType(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5"
                >
                  <option value="1_bed">1 Bedroom</option>
                  <option value="2_bed">2 Bedrooms</option>
                  <option value="3_bed">3 Bedrooms</option>
                  <option value="4_bed">4 Bedrooms</option>
                  <option value="5_bed">5 Bedrooms</option>
                  <option value="6_bed">6 Bedrooms</option>
                </select>
              </div>
              <div className="flex flex-col gap-2 w-full">
                <label htmlFor="listing" className="text-sm font-bold">
                  Bathrooms*
                </label>
                <select
                  name="listing"
                  id="listing"
                  value={listingType}
                  onChange={(e) => setListingType(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5"
                >
                  <option value="1_bath">1 Bathroom</option>
                  <option value="2_bath">2 Bathrooms</option>
                  <option value="3_bath">3 Bathrooms</option>
                  <option value="4_bath">4 Bathrooms</option>
                  <option value="5_bath">5 Bathrooms</option>
                  <option value="6_bath">6 Bathrooms</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              <div className="flex flex-col gap-2 w-full">
                <label htmlFor="listing" className="text-sm font-bold">
                  Sqft.*
                </label>
                <input
                  id="sqft"
                  type="number"
                  placeholder="Enter Sqft."
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5"
                  required
                />
              </div>
              <div className="flex flex-col gap-2 w-full">
                <label htmlFor="listing" className="text-sm font-bold">
                  Perches*
                </label>
                <input
                  id="perches"
                  type="number"
                  placeholder="Enter Perches"
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              <div className="flex flex-col gap-2 w-full">
                <label htmlFor="location" className="text-sm font-bold">
                  Price (LKR)*
                </label>
                <input
                  id="price"
                  type="number"
                  placeholder="Enter Price"
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5"
                  required
                />
              </div>
              <div className="flex flex-col gap-2 w-full">
                <label htmlFor="listing" className="text-sm font-bold">
                  Status
                </label>
                <select
                  name="listing"
                  id="listing"
                  value={listingType}
                  onChange={(e) => setListingType(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5"
                >
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                  <option value="sold">Sold</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="listing" className="text-sm font-bold">
                Upload Images*
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                className="border border-gray-200 rounded-xl px-4 py-2 bg-gray-50"
              />
            </div>

            {/* Conditional Fields */}
            {listingType === "packages" && (
              <div className="flex flex-col gap-2 w-full">
                <label htmlFor="package" className="text-sm font-bold">
                  Package Details
                </label>
                <textarea
                  id="package"
                  placeholder="Enter Package Details"
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5"
                  required
                />
              </div>
            )}

            {listingType === "hotels" && (
              <div className="flex flex-col gap-2 w-full">
                <label htmlFor="amenities" className="text-sm font-bold">
                  Hotel Amenities
                </label>
                <textarea
                  id="amenities"
                  placeholder="Enter Hotel Amenities"
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5"
                  required
                />
              </div>
            )}

            {listingType === "destinations" && (
              <div className="flex flex-col gap-2 w-full">
                <label htmlFor="highlights" className="text-sm font-bold">
                  Property Highlights
                </label>
                <textarea
                  id="highlights"
                  placeholder="Enter Key Highlights"
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5"
                  required
                />
              </div>
            )}

            {/* Submit */}
            <div className="flex items-end w-full">
              <button
                type="submit"
                className="select-none btn-orange-base btn-dynamic"
              >
                Submit Listing
              </button>
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

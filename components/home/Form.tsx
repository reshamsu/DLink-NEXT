"use client";

import Image from "next/image";
import { ReactTyped } from "react-typed";
import { TbSearch } from "react-icons/tb";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const Hero = () => {
  const router = useRouter();

  // 🔹 Search states
  const [keyword, setKeyword] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [beds, setBeds] = useState("");

  // 🔹 Autofilter states
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingSuggest, setLoadingSuggest] = useState(false);

  /* -------------------------------------------------------
     🔍 AUTOFILTER (debounced)
  ------------------------------------------------------- */
  useEffect(() => {
    if (!keyword || keyword.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      if (!supabase) return;

      setLoadingSuggest(true);

      const { data, error } = await supabase
        .from("listing")
        .select("city")
        // .select("city, location, price, property_title")
        // .or(
        //   `city.ilike.%${keyword}%,location.ilike.%${keyword}%,price.ilike.%${keyword}%,property_title.ilike.%${keyword}%`
        // )
        .limit(6);

      if (!error && data) {
        const unique = Array.from(
          new Set(
            data.flatMap((row) => [
              row.city,
              // row.location,
              // row.price,
              // row.property_title,
            ]),
          ),
        )
          .filter(Boolean)
          .slice(0, 6);

        setSuggestions(unique);
      }

      setLoadingSuggest(false);
    }, 350); // debounce

    return () => clearTimeout(timer);
  }, [keyword]);

  /* -------------------------------------------------------
     🔎 SEARCH SUBMIT
  ------------------------------------------------------- */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams(window.location.search);

    if (keyword) params.set("q", keyword);
    else params.delete("q");

    if (propertyType) params.set("type", propertyType);
    else params.delete("type");
    25;

    if (beds) params.set("beds", beds);
    else params.delete("beds");

    // ✅ update URL WITHOUT page navigation
    router.replace(`/?${params.toString()}#listings`, {
      scroll: false,
    });

    // ✅ smooth scroll to listings
    document.getElementById("listings")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="bg-gray-200 text-gray-900" id="form">
      <div className="relative h-screen md:h-[40vh] lg:h-80 w-full overflow-hidden flex flex-col justify-center gap-10 text-center">
        <form
          onSubmit={handleSearch}
          className="max-w-6xl mx-8 lg:mx-auto relative z-50 bg-white text-black text-[15px] p-8 rounded-3xl shadow-xl hover:scale-105 duration-1000 flex flex-col justify-between gap-4 lg:flex-row"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-end gap-6">
            <div className="relative flex-1">
              <div className="flex flex-col items-start justify-center gap-2">
                <label className="text-sm font-bold">Search City</label>
                <input
                  type="text"
                  placeholder="Dehiwela, Wellawatta, Colombo"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="bg-gray-100 hover:bg-white duration-500 transition-all border border-black/10 px-4 py-3 rounded-xl w-full"
                  required
                />
              </div>

              {loadingSuggest && (
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                  Searching…
                </span>
              )}

              {suggestions.length > 0 && (
                <ul className="absolute top-full mt-4 p-2 w-full bg-gray-500 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
                  {suggestions.map((item, index) => (
                    <li
                      key={index}
                      onClick={() => {
                        setKeyword(item);
                        setSuggestions([]);
                      }}
                      className="px-4 py-2 text-left cursor-pointer hover:bg-orange-500/10"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Price Range */}
            <div className="flex flex-col items-start justify-center gap-2">
              <label className="text-sm font-bold">Price Range</label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="bg-gray-100 hover:bg-white duration-500 transition-all border border-black/10 px-4 py-3 rounded-xl w-full"
              >
                <option value="" disabled>
                  Price Range
                </option>
                <option value="30 Million-Below">30 Million - Below</option>
                <option value="31 Million-39 Million">
                  31 Million - 39 Million
                </option>
                <option value="40 Million-58 Million">
                  40 Million - 58 Million
                </option>
                <option value="59 Million-70 Million">
                  59 Million - 70 Million
                </option>
                <option value="71 Million-Above">71 Million - Above</option>
              </select>
            </div>

            {/* Property Side */}
            <div className="flex flex-col items-start justify-center gap-2">
              <label className="text-sm font-bold">Property Side</label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="bg-gray-100 hover:bg-white duration-500 transition-all border border-black/10 px-4 py-3 rounded-xl w-full"
              >
                <option value="" disabled>
                  Property Side
                </option>
                <option value="Sea Side">Sea Side</option>
                <option value="Land Side">Land Side</option>
              </select>
            </div>

            {/* Property Type */}
            <div className="flex flex-col items-start justify-center gap-2">
              <label className="text-sm font-bold">Property Type</label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="bg-gray-100 hover:bg-white duration-500 transition-all border border-black/10 px-4 py-3 rounded-xl w-full"
              >
                <option value="" disabled>
                  Property Type
                </option>
                <option value="Apartment">Apartment</option>
                <option value="House">House</option>
                <option value="Land">Lands</option>
                <option value="Commercial">Commercial Property</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Search City */}
            <div className="flex flex-col items-start justify-center gap-2">
              <label className="text-sm font-bold">Choose Beds</label>
              <select
                value={beds}
                onChange={(e) => setBeds(e.target.value)}
                className="bg-gray-100 hover:bg-white duration-500 transition-all border border-black/10 px-4 py-3 rounded-2xl w-full"
              >
                <option value="" disabled>
                  Beds+
                </option>
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>
                    {n}+
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="select-none btn-orange-sm cursor-pointer"
            >
              <TbSearch size="22" /> Search
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Hero;

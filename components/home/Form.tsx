"use client";

import { TbSearch } from "react-icons/tb";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const Hero = () => {
  const router = useRouter();

  // 🔹 Filter states
  const [keyword, setKeyword] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [propertySide, setPropertySide] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [beds, setBeds] = useState("");

  // 🔹 Autocomplete states
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingSuggest, setLoadingSuggest] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  /* -------------------------------------------------------
     🔍 AUTOCOMPLETE — queries `city` column with keyword
  ------------------------------------------------------- */
  useEffect(() => {
    if (!keyword || keyword.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(async () => {
      if (!supabase) return;
      setLoadingSuggest(true);

      const { data, error } = await supabase
        .from("listing")
        .select("city")
        .ilike("city", `%${keyword}%`)
        .limit(6);

      if (!error && data) {
        const unique = Array.from(
          new Set(data.map((row) => row.city).filter(Boolean))
        ) as string[];

        setSuggestions(unique);
        setShowSuggestions(true);
      }

      setLoadingSuggest(false);
    }, 350);

    return () => clearTimeout(timer);
  }, [keyword]);

  /* -------------------------------------------------------
     🔎 SEARCH SUBMIT — pushes params to URL
     Listings component should read these params and filter
     the `listing` table accordingly using:
       city        → .ilike("city", `%q%`)
       price       → compare against `price` or `full_price`
       listing_type → .eq("listing_type", side)   (Sea Side / Land Side)
       property_type → .eq("property_type", type)
       bedrooms    → .gte("bedrooms", beds)
  ------------------------------------------------------- */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);

    const params = new URLSearchParams();

    if (keyword)      params.set("q", keyword);
    if (priceRange)   params.set("price", priceRange);
    if (propertySide) params.set("side", propertySide);
    if (propertyType) params.set("type", propertyType);
    if (beds)         params.set("beds", beds);

    router.replace(`/?${params.toString()}#listings`, { scroll: false });
    document.getElementById("listings")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="bg-gray-200 text-gray-900" id="form">
      <div className="relative h-screen md:h-[40vh] lg:h-80 w-full overflow-hidden flex flex-col justify-center gap-10 text-center">
        <form
          onSubmit={handleSearch}
          className="max-w-6xl mx-8 lg:mx-auto relative z-50 bg-white text-black text-[15px] p-8 rounded-3xl shadow-xl hover:scale-105 duration-1000"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-end gap-6">

            {/* Search City → queries `city` column */}
            <div className="relative flex flex-col items-start gap-2">
              <label className="text-sm font-bold">Search City</label>
              <input
                type="text"
                placeholder="Dehiwela, Wellawatta, Colombo"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                className="bg-gray-100 hover:bg-white duration-500 transition-all border border-black/10 px-4 py-2.5 rounded-xl w-full"
                required
                autoComplete="off"
              />

              {loadingSuggest && (
                <span className="absolute right-3 top-[42px] text-xs text-gray-400">
                  Searching…
                </span>
              )}

              {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
                  {suggestions.map((item, index) => (
                    <li
                      key={index}
                      onMouseDown={() => {
                        setKeyword(item);
                        setSuggestions([]);
                        setShowSuggestions(false);
                      }}
                      className="px-4 py-2.5 text-left cursor-pointer text-gray-800 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Price Range → compare against `price` column in listings */}
            <div className="flex flex-col items-start gap-2">
              <label className="text-sm font-bold">Price Range</label>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="bg-gray-100 hover:bg-white duration-500 transition-all border border-black/10 px-4 py-2.5 rounded-xl w-full"
              >
                <option value="">Any Price</option>
                <option value="30 Million-Below">30 Million &amp; Below</option>
                <option value="31 Million-39 Million">31 – 39 Million</option>
                <option value="40 Million-58 Million">40 – 58 Million</option>
                <option value="59 Million-70 Million">59 – 70 Million</option>
                <option value="71 Million-Above">71 Million &amp; Above</option>
              </select>
            </div>

            {/* Property Side → queries `listing_type` column */}
            <div className="flex flex-col items-start gap-2">
              <label className="text-sm font-bold">Property Side</label>
              <select
                value={propertySide}
                onChange={(e) => setPropertySide(e.target.value)}
                className="bg-gray-100 hover:bg-white duration-500 transition-all border border-black/10 px-4 py-2.5 rounded-xl w-full"
              >
                <option value="">Any Side</option>
                <option value="Sea Side">Sea Side</option>
                <option value="Land Side">Land Side</option>
              </select>
            </div>

            {/* Property Type → queries `property_type` column */}
            <div className="flex flex-col items-start gap-2">
              <label className="text-sm font-bold">Property Type</label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="bg-gray-100 hover:bg-white duration-500 transition-all border border-black/10 px-4 py-2.5 rounded-xl w-full"
              >
                <option value="">Any Type</option>
                <option value="Apartment">Apartment</option>
                <option value="House">House</option>
                <option value="Land">Land</option>
                <option value="Commercial">Commercial Property</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Bedrooms → queries `bedrooms` column with .gte() */}
            <div className="flex flex-col items-start gap-2">
              <label className="text-sm font-bold">Bedrooms</label>
              <select
                value={beds}
                onChange={(e) => setBeds(e.target.value)}
                className="bg-gray-100 hover:bg-white duration-500 transition-all border border-black/10 px-4 py-2.5 rounded-xl w-full"
              >
                <option value="">Any</option>
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>
                    {n}+
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="select-none btn-orange-sm cursor-pointer flex items-center justify-center gap-2"
            >
              <TbSearch size={22} /> Search
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Hero;
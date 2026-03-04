"use client";

import Image from "next/image";
import { ReactTyped } from "react-typed";
import { TbSearch } from "react-icons/tb";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

const Hero = () => {
  const router = useRouter();

  const [keyword, setKeyword] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [propertySide, setPropertySide] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [beds, setBeds] = useState("");

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingSuggest, setLoadingSuggest] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  /* autocomplete */
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
          new Set(data.map((row) => row.city).filter(Boolean)),
        ) as string[];
        setSuggestions(unique);
        setShowSuggestions(true);
      }
      setLoadingSuggest(false);
    }, 350);
    return () => clearTimeout(timer);
  }, [keyword]);

  /* search */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    const params = new URLSearchParams();
    if (keyword) params.set("q", keyword);
    if (priceRange) params.set("price", priceRange);
    if (propertySide) params.set("side", propertySide);
    if (propertyType) params.set("type", propertyType);
    if (beds) params.set("beds", beds);
    router.replace(`/?${params.toString()}#listings`, { scroll: false });
    document.getElementById("listings")?.scrollIntoView({ behavior: "smooth" });
  };

  const activeCount = [
    keyword,
    priceRange,
    propertySide,
    propertyType,
    beds,
  ].filter(Boolean).length;

  return (
    <div className="bg-gray-200 text-gray-900">
      {/* ── Hero photo band ── */}
      <div className="relative h-[80vh] w-full overflow-hidden flex flex-col justify-center items-center gap-8 text-center">
        <div className="absolute inset-0">
          <Image
            src="/assets/banner/property5.jpg"
            alt="Hero"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[#f2836f]/20 transition-all duration-1000" />
        </div>

        {/* Text */}
        <div className="relative z-10 flex flex-col items-center gap-4 text-white px-6 pt-16">
          <h1 className="text-4xl 2xl:text-5xl font-extrabold flex flex-col md:flex-row gap-2">
            Find your Next{" "}
            <ReactTyped
              className="text-4xl 2xl:text-5xl font-extrabold text-orange-500"
              strings={["Property", "Home", "Apartment", "Villa", "Land"]}
              typeSpeed={200}
              backSpeed={140}
              loop
            />
          </h1>
          <p className="text-sm font-medium text-white/80">
            Find Properties for Sale, Rent or Invest
          </p>
        </div>

        {/* <Link
          href="#listings"
          scroll={false}
          className="relative z-10 select-none btn-light-base cursor-pointer"
        >
          Find Listings
        </Link> */}
      </div>

      {/* ── Filter card — overlaps hero ── */}
      <div className="relative z-20 -mt-20 px-4 pb-10">
        <form
          onSubmit={handleSearch}
          className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8"
        >
          {/* Row 1: City · Price · Side */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* City */}
            <div className="relative flex flex-col gap-1.5">
              <label className="text-xs font-bold tracking-wide">
                Search City
              </label>
              <input
                type="text"
                placeholder="Dehiwela, Wellawatta, Colombo"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onFocus={() =>
                  suggestions.length > 0 && setShowSuggestions(true)
                }
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                autoComplete="off"
                required
                className="border-2 border-gray-200 bg-gray-50 rounded-xl px-3.5 py-2.5 text-sm placeholder:text-gray-400 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
              />
              {loadingSuggest && (
                <span className="absolute right-3 top-[38px] text-xs text-gray-400">
                  ...
                </span>
              )}
              {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                  {suggestions.map((item, i) => (
                    <li
                      key={i}
                      onMouseDown={() => {
                        setKeyword(item);
                        setSuggestions([]);
                        setShowSuggestions(false);
                      }}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm cursor-pointer hover:bg-orange-50 hover:text-orange-600 transition-colors"
                    >
                      <svg
                        className="text-orange-400 shrink-0"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Price */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold tracking-wide">
                Price Range
              </label>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="border-2 border-gray-200 bg-gray-50 rounded-xl px-3.5 py-2.5 text-sm text-gray-500 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all cursor-pointer"
              >
                <option value="">Any Price</option>
                <option value="30 Million-Below">Under 30M</option>
                <option value="31 Million-39 Million">31M – 39M</option>
                <option value="40 Million-58 Million">40M – 58M</option>
                <option value="59 Million-70 Million">59M – 70M</option>
                <option value="71 Million-Above">71M & Above</option>
              </select>
            </div>

            {/* Side */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-700 tracking-wide">
                Property Side
              </label>
              <select
                value={propertySide}
                onChange={(e) => setPropertySide(e.target.value)}
                className="border-2 border-gray-200 bg-gray-50 rounded-xl px-3.5 py-2.5 text-sm text-gray-500 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all cursor-pointer"
              >
                <option value="">Any Side</option>
                <option value="Sea Side">Sea Side</option>
                <option value="Land Side">Land Side</option>
              </select>
            </div>
          </div>

          {/* Row 2: Type · Beds · Button */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            {/* Type */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold tracking-wide">
                Property Type
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="border-2 border-gray-200 bg-gray-50 rounded-xl px-3.5 py-2.5 text-sm text-gray-500 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all cursor-pointer"
              >
                <option value="">Any Type</option>
                <option value="Apartment">Apartment</option>
                <option value="House">House</option>
                <option value="Land">Land</option>
                <option value="Commercial">Commercial</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Beds — pills */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold tracking-wide">
                Bedrooms
              </label>
              <div className="flex gap-2">
                {["1", "2", "3", "4", "5+"].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setBeds(beds === n ? "" : n)}
                    className={`flex-1 py-2 rounded-2xl text-sm border-2 transition-all font-semibold
                      ${
                        beds === n
                          ? "bg-orange-500 border-orange-500 text-white"
                          : "border-gray-200 bg-gray-50 text-gray-500 hover:border-orange-300 hover:text-orange-500"
                      }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn-orange-sm"
            >
              <TbSearch size={17} /> Search
            </button>
          </div>

          {/* Active filter chips */}
          {activeCount > 0 && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100 items-center">
              {keyword && (
                <Chip label={keyword} onRemove={() => setKeyword("")} />
              )}
              {priceRange && (
                <Chip
                  label={priceRange.replace("-", " – ")}
                  onRemove={() => setPriceRange("")}
                />
              )}
              {propertySide && (
                <Chip
                  label={propertySide}
                  onRemove={() => setPropertySide("")}
                />
              )}
              {propertyType && (
                <Chip
                  label={propertyType}
                  onRemove={() => setPropertyType("")}
                />
              )}
              {beds && (
                <Chip label={`${beds} beds`} onRemove={() => setBeds("")} />
              )}
              <button
                type="button"
                onClick={() => {
                  setKeyword("");
                  setPriceRange("");
                  setPropertySide("");
                  setPropertyType("");
                  setBeds("");
                }}
                className="text-xs text-gray-400 hover:text-gray-600 underline underline-offset-2 transition-colors ml-1"
              >
                Clear all
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

const Chip = ({ label, onRemove }: { label: string; onRemove: () => void }) => (
  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 border border-orange-200 rounded-full text-xs font-medium text-orange-700">
    {label}
    <button
      type="button"
      onClick={onRemove}
      className="text-orange-400 hover:text-orange-600 transition-colors leading-none"
    >
      ✕
    </button>
  </span>
);

export default Hero;

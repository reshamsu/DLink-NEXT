"use client";

import Image from "next/image";
import { ReactTyped } from "react-typed";
import { TbSearch, TbMapPin, TbX } from "react-icons/tb";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const FIELD_CLS =
  "border border-gray-200 bg-gray-50 rounded-xl px-3.5 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all w-full";

const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">
    {children}
  </label>
);

const Hero = () => {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [keyword, setKeyword] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [propertySide, setPropertySide] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [beds, setBeds] = useState("");

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingSuggest, setLoadingSuggest] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (!keyword || keyword.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const timer = setTimeout(async () => {
      setLoadingSuggest(true);
      const { data, error } = await supabase
        .from("listing")
        .select("city")
        .ilike("city", `%${keyword}%`)
        .limit(6);
      if (!error && data) {
        const unique = Array.from(
          new Set(data.map((row: { city: string }) => row.city).filter(Boolean)),
        ) as string[];
        setSuggestions(unique);
        setShowSuggestions(unique.length > 0);
      }
      setLoadingSuggest(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [keyword]);

  const selectSuggestion = (city: string) => {
    setKeyword(city);
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

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

  const activeFilters = [
    keyword && { key: "q", label: keyword, clear: () => setKeyword("") },
    priceRange && { key: "price", label: priceRange.replace("-", " – "), clear: () => setPriceRange("") },
    propertySide && { key: "side", label: propertySide, clear: () => setPropertySide("") },
    propertyType && { key: "type", label: propertyType, clear: () => setPropertyType("") },
    beds && { key: "beds", label: `${beds} beds`, clear: () => setBeds("") },
  ].filter(Boolean) as { key: string; label: string; clear: () => void }[];

  return (
    <div className="bg-gray-100">
      {/* Hero image */}
      <div className="relative h-[75vh] w-full overflow-hidden flex flex-col justify-center items-center text-center">
        <div className="absolute inset-0">
          <Image
            src="/assets/banner/property5.jpg"
            alt="Hero"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-orange-600/50 via-orange-600/20 to-black/60" />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-6 px-6 pt-20">
          <p className="text-xs font-extrabold bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 px-4 py-1.5 rounded-full tracking-widest uppercase">
            Sri Lanka&apos;s Premier Property Platform
          </p>
          <h1 className="text-4xl 2xl:text-5xl font-extrabold text-white flex flex-col md:flex-row items-center gap-3 leading-tight">
            Find your Next
            <ReactTyped
              className="text-orange-500"
              strings={["Property", "Home", "Apartment", "Villa", "Land"]}
              typeSpeed={180}
              backSpeed={120}
              loop
            />
          </h1>
          <p className="text-sm text-white/60">
            Browse hundreds of verified listings across Colombo and beyond
          </p>
        </div>
      </div>

      {/* Search form card — overlaps hero */}
      <div className="relative z-20 -mt-16 px-4 pb-4">
        <form
          onSubmit={handleSearch}
          className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 md:p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm font-extrabold text-gray-800">Search Properties</p>
              <p className="text-xs text-gray-400 mt-0.5">Filter by city, price, type and more</p>
            </div>
            {activeFilters.length > 0 && (
              <button
                type="button"
                onClick={() => { setKeyword(""); setPriceRange(""); setPropertySide(""); setPropertyType(""); setBeds(""); }}
                className="text-xs text-gray-400 hover:text-orange-500 transition-colors font-bold flex items-center gap-1"
              >
                <TbX size={13} /> Clear all
              </button>
            )}
          </div>

          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* City autocomplete */}
            <div className="relative flex flex-col gap-1.5">
              <Label>City</Label>
              <div className="relative">
                <TbMapPin
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Colombo, Dehiwela..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                  autoComplete="off"
                  required
                  className={`${FIELD_CLS} pl-9`}
                />
                {loadingSuggest && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-0.5">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="w-1 h-1 rounded-full bg-orange-400 animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </span>
                )}
              </div>

              {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden">
                  {suggestions.map((city, i) => (
                    <li
                      key={i}
                      onMouseDown={(e) => { e.preventDefault(); selectSuggestion(city); }}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm cursor-pointer hover:bg-orange-50 hover:text-orange-600 transition-colors"
                    >
                      <TbMapPin size={13} className="text-orange-400 shrink-0" />
                      {city}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Price */}
            <div className="flex flex-col gap-1.5">
              <Label>Price Range</Label>
              <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)} className={FIELD_CLS}>
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
              <Label>Property Side</Label>
              <select value={propertySide} onChange={(e) => setPropertySide(e.target.value)} className={FIELD_CLS}>
                <option value="">Any Side</option>
                <option value="Sea Side">Sea Side</option>
                <option value="Land Side">Land Side</option>
              </select>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            {/* Type */}
            <div className="flex flex-col gap-1.5">
              <Label>Property Type</Label>
              <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)} className={FIELD_CLS}>
                <option value="">Any Type</option>
                <option value="Apartment">Apartment</option>
                <option value="House">House</option>
                <option value="Villa">Villa</option>
                <option value="Land">Land</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>

            {/* Beds */}
            <div className="flex flex-col gap-1.5">
              <Label>Bedrooms</Label>
              <div className="flex gap-2">
                {["1", "2", "3", "4", "5+"].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setBeds(beds === n ? "" : n)}
                    className={`flex-1 py-2.5 rounded-xl text-xs border transition-all font-extrabold
                      ${beds === n
                        ? "bg-orange-500 border-orange-500 text-white shadow-sm"
                        : "border-gray-200 bg-gray-50 text-gray-500 hover:border-orange-300 hover:text-orange-500"
                      }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button type="submit" className="btn-orange-sm gap-2">
              <TbSearch size={16} />
              Search
            </button>
          </div>

          {/* Active filter chips */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-gray-100 items-center">
              {activeFilters.map((f) => (
                <span
                  key={f.key}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 border border-orange-200 rounded-full text-xs font-bold text-orange-600"
                >
                  {f.label}
                  <button
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); f.clear(); }}
                    className="text-orange-400 hover:text-orange-700 transition-colors leading-none"
                  >
                    <TbX size={11} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Hero;

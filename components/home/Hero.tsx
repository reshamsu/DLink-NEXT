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
    <div className="bg-gray-200 text-gray-900">
      <div className="relative h-screen md:h-[74vh] w-full overflow-hidden flex flex-col justify-center gap-10 text-center">
        <div className="absolute inset-0 transition-opacity duration-1000">
          <Image
            src="/assets/banner/property5.jpg"
            alt="Hero"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/20 md:bg-[#f2836f]/15 group-hover:bg-black/64 transition-all duration-1000" />
        </div>

        {/* TEXT */}
        <div className="max-w-6xl mx-auto flex flex-col justify-center items-center text-center gap-10 text-white z-10 md:pt-24 px-8">
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl md:text-5xl 2xl:text-6xl font-extrabold flex flex-col md:flex-row gap-2 md:gap-2.5">
              Find your Next{" "}
              <ReactTyped
                className="text-4xl md:text-5xl 2xl:text-6xl font-extrabold text-orange-500/80"
                strings={["Property", "Home", "Apartment", "Villa", "Land"]}
                typeSpeed={200}
                backSpeed={140}
                loop
              />
            </h1>
            <p className="text-sm 2xl:text-base font-medium max-w-3xl">
              Find Properties for Sale, Rent or Invest
            </p>
          </div>

          <Link href="#listings" scroll={false}
            type="submit"
            className="select-none btn-light-base cursor-pointer"
          >
            Find Listings
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;

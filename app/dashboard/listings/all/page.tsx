"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion, Variants, Transition } from "framer-motion";
import {
  TbBuilding,
  TbSquareCheck,
  TbBed,
  TbBath,
  TbPencil,
  TbArrowRight,
  TbSearch,
  TbMapPin,
  TbCurrencyDollar,
  TbLayoutGrid,
  TbList,
  TbPlus,
} from "react-icons/tb";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export const runtime = "edge";

type FurnishingStatus = "Fully-Furnished" | "Semi-Furnished" | "UnFurnished";

interface Listing {
  id: number;
  property_title: string;
  property_subtitle: string;
  property_type: string;
  listing_type: string;
  city: string;
  location: string;
  bedrooms: string;
  bathrooms: string;
  perches: string;
  sqft: string;
  floors: string;
  price: string;
  status: string;
  is_furnished: FurnishingStatus;
  image_urls: string[];
  amenities: string[];
  property_documents: string[];
}

const fade: Transition["ease"] = [0.25, 0.1, 0.25, 1];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04, duration: 0.35, ease: fade },
  }),
};

const statusStyle: Record<string, string> = {
  Available: "bg-emerald-50 text-emerald-600 border border-emerald-200",
  Sold:      "bg-red-50 text-red-500 border border-red-200",
  Unavailable: "bg-yellow-50 text-yellow-600 border border-yellow-200",
};

const furnishLabel: Record<string, string> = {
  "Fully-Furnished": "Fully Furnished",
  "Semi-Furnished":  "Semi Furnished",
  "UnFurnished":     "Unfurnished",
};

export default function AllListings() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading]   = useState(true);
  const [query, setQuery]       = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterType, setFilterType]     = useState("All");
  const [view, setView]         = useState<"grid" | "list">("grid");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("dlink_listings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) { console.error(error.message); setLoading(false); return; }

      setListings(
        (data ?? []).map((r: any) => ({
          ...r,
          image_urls:         Array.isArray(r.image_urls)         ? r.image_urls         : [],
          amenities:          Array.isArray(r.amenities)          ? r.amenities          : [],
          property_documents: Array.isArray(r.property_documents) ? r.property_documents : [],
        }))
      );
      setLoading(false);
    };
    load();
  }, []);

  const filtered = useMemo(() => listings.filter((l) => {
    const q = query.toLowerCase();
    const matchQ = !q || l.property_title.toLowerCase().includes(q) || l.city.toLowerCase().includes(q);
    const matchS = filterStatus === "All" || l.status === filterStatus;
    const matchT = filterType   === "All" || l.property_type === filterType;
    return matchQ && matchS && matchT;
  }), [listings, query, filterStatus, filterType]);

  const types = useMemo(() =>
    ["All", ...Array.from(new Set(listings.map((l) => l.property_type)))],
    [listings]
  );

  return (
    <div className="bg-gray-100 min-h-screen text-gray-800">
      <div className="max-w-6xl mx-auto lg:ml-80 px-4 md:px-6 pt-24 lg:pt-16 pb-16 flex flex-col gap-6">

        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold">
              All <span className="text-orange-500">Listings</span>
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {loading ? "Loading…" : `${listings.length} listing${listings.length !== 1 ? "s" : ""} total`}
            </p>
          </div>
          <Link
            href="/dashboard/listings/add"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-4 py-2.5 rounded-full transition-all hover:scale-105 duration-200 shrink-0"
          >
            <TbPlus size={15} /> Add Listing
          </Link>
        </div>

        {/* ── Filters ── */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <TbSearch size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title or city…"
              className="bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 w-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 transition placeholder:text-gray-400"
            />
          </div>

          {/* Status filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 transition"
          >
            {["All", "Available", "Unavailable", "Sold"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          {/* Type filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 transition"
          >
            {types.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>

          {/* View toggle */}
          <div className="flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden shrink-0">
            <button
              onClick={() => setView("grid")}
              className={`p-2.5 transition ${view === "grid" ? "bg-orange-500 text-white" : "text-gray-400 hover:text-gray-700"}`}
            >
              <TbLayoutGrid size={18} />
            </button>
            <button
              onClick={() => setView("list")}
              className={`p-2.5 transition ${view === "list" ? "bg-orange-500 text-white" : "text-gray-400 hover:text-gray-700"}`}
            >
              <TbList size={18} />
            </button>
          </div>
        </div>

        {/* ── States ── */}
        {loading ? (
          <div className="h-[60vh] flex items-center justify-center gap-3">
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 text-sm">Loading listings…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-60 gap-3 text-gray-400">
            <TbSearch size={36} className="opacity-30" />
            <p className="text-sm">No listings match your filters.</p>
          </div>
        ) : view === "grid" ? (

          /* ── Grid view ── */
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
            initial="hidden"
            animate="visible"
          >
            {filtered.map((listing, index) => (
              <motion.div
                key={listing.id}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden group flex flex-col"
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={listing.image_urls[0] || "/assets/banner/property1.webp"}
                    alt={listing.property_title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                  {/* Type badge */}
                  <span className="absolute top-3 left-3 bg-orange-500/90 backdrop-blur-sm text-[11px] text-white font-bold px-3 py-1 rounded-lg">
                    {listing.property_type} · {listing.listing_type}
                  </span>

                  {/* Price */}
                  <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-xs text-orange-600 font-extrabold px-3 py-1 rounded-lg">
                    LKR {listing.price}
                  </span>

                  {/* Action buttons */}
                  <div className="absolute top-3 right-3 flex flex-col gap-1.5">
                    <Link
                      href={`/dashboard/listings/edit?id=${listing.id}`}
                      className="bg-white/90 hover:bg-blue-500 hover:text-white p-1.5 rounded-lg transition-all duration-200 text-gray-700 backdrop-blur-sm"
                    >
                      <TbPencil size={16} />
                    </Link>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-3 p-5 flex-1">
                  <div>
                    <Link
                      href={`/listing/${listing.id}`}
                      className="text-sm font-extrabold text-gray-800 hover:text-orange-500 transition line-clamp-1"
                    >
                      {listing.property_title}
                    </Link>
                    <p className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-1 line-clamp-1">
                      <TbMapPin size={11} className="text-orange-400 shrink-0" />
                      {listing.city} — {listing.location}
                    </p>
                  </div>

                  {/* Specs */}
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px] font-semibold text-gray-600 border-t border-gray-100 pt-3">
                    <span className="flex items-center gap-1.5"><TbBed size={13} className="text-orange-400" />{listing.bedrooms} Bed</span>
                    <span className="flex items-center gap-1.5"><TbBath size={13} className="text-orange-400" />{listing.bathrooms} Bath</span>
                    <span className="flex items-center gap-1.5"><TbBuilding size={13} className="text-orange-400" />{listing.floors || "—"} Floor</span>
                    <span className="flex items-center gap-1.5"><TbSquareCheck size={13} className="text-orange-400" />{listing.perches || "—"} Perch</span>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${statusStyle[listing.status] ?? "bg-gray-100 text-gray-500"}`}>
                        {listing.status}
                      </span>
                      {listing.is_furnished && (
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-500 border border-blue-200">
                          {furnishLabel[listing.is_furnished] ?? listing.is_furnished}
                        </span>
                      )}
                    </div>
                    <Link
                      href={`/listing/${listing.id}`}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-orange-500 hover:bg-orange-600 text-white transition-all hover:scale-110 duration-200"
                    >
                      <TbArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

        ) : (

          /* ── List view ── */
          <motion.div className="flex flex-col gap-3" initial="hidden" animate="visible">
            {filtered.map((listing, index) => (
              <motion.div
                key={listing.id}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 p-4 group hover:border-orange-200 hover:shadow-md transition-all duration-200"
              >
                {/* Thumbnail */}
                <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                  <Image
                    src={listing.image_urls[0] || "/assets/banner/property1.webp"}
                    alt={listing.property_title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/listing/${listing.id}`}
                    className="text-sm font-extrabold text-gray-800 hover:text-orange-500 transition line-clamp-1"
                  >
                    {listing.property_title}
                  </Link>
                  <p className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-1">
                    <TbMapPin size={11} className="text-orange-400" />
                    {listing.city} — {listing.location}
                  </p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${statusStyle[listing.status] ?? "bg-gray-100 text-gray-500"}`}>
                      {listing.status}
                    </span>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-orange-50 text-orange-500 border border-orange-200">
                      {listing.property_type} · {listing.listing_type}
                    </span>
                  </div>
                </div>

                {/* Specs */}
                <div className="hidden md:flex items-center gap-4 text-xs font-semibold text-gray-500 shrink-0">
                  <span className="flex items-center gap-1"><TbBed size={14} className="text-orange-400" />{listing.bedrooms}</span>
                  <span className="flex items-center gap-1"><TbBath size={14} className="text-orange-400" />{listing.bathrooms}</span>
                  <span className="flex items-center gap-1"><TbCurrencyDollar size={14} className="text-orange-400" />{listing.price}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/dashboard/listings/edit?id=${listing.id}`}
                    className="p-2 rounded-xl bg-gray-100 hover:bg-blue-500 hover:text-white text-gray-500 transition-all duration-200"
                  >
                    <TbPencil size={16} />
                  </Link>
                  <Link
                    href={`/listing/${listing.id}`}
                    className="p-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white transition-all duration-200"
                  >
                    <TbArrowRight size={16} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* ── Result count ── */}
        {!loading && filtered.length > 0 && filtered.length !== listings.length && (
          <p className="text-xs text-gray-400 text-center">
            Showing {filtered.length} of {listings.length} listings
          </p>
        )}

      </div>
    </div>
  );
}

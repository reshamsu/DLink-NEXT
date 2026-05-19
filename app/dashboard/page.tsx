"use client";

import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import Image from "next/image";
import {
  TbBuilding, TbSquareCheck, TbAlertCircle, TbCurrencyDollar,
  TbMapPin, TbPlus, TbArrowRight, TbTrendingUp, TbHome,
  TbBuildingSkyscraper, TbReportAnalytics,
} from "react-icons/tb";

export const runtime = "edge";

interface Property {
  id: number;
  property_title: string;
  property_type: string;
  listing_type: string;
  city: string;
  price: string;
  status: string;
  is_furnished: string;
  image_urls: string[];
  created_at: string;
}

function parsePrice(s: string): number {
  if (!s) return 0;
  return parseFloat(s.replace(/[^0-9.]/g, "")) || 0;
}

function fmtPrice(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}K`;
  return n.toString();
}

const statusColor: Record<string, string> = {
  Available:   "text-emerald-600",
  Sold:        "text-red-500",
  Unavailable: "text-amber-500",
};

export default function Dashboard() {
  const [props, setProps]     = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("property")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!error && data)
          setProps(data.map((r: any) => ({
            ...r,
            image_urls: Array.isArray(r.image_urls) ? r.image_urls : [],
          })));
        setLoading(false);
      });
  }, []);

  const stats = useMemo(() => {
    const total       = props.length;
    const available   = props.filter((p) => p.status === "Available").length;
    const sold        = props.filter((p) => p.status === "Sold").length;
    const unavailable = props.filter((p) => p.status === "Unavailable").length;
    const forSale     = props.filter((p) => p.listing_type === "Sale").length;
    const forRent     = props.filter((p) => p.listing_type === "Rent").length;
    const furnished   = props.filter((p) => p.is_furnished === "Fully-Furnished").length;
    const semi        = props.filter((p) => p.is_furnished === "Semi-Furnished").length;
    const unfurnished = props.filter((p) => p.is_furnished === "UnFurnished").length;

    const typeCount: Record<string, number> = {};
    props.forEach((p) => { typeCount[p.property_type] = (typeCount[p.property_type] || 0) + 1; });

    const cityCount: Record<string, number> = {};
    props.forEach((p) => { if (p.city) cityCount[p.city] = (cityCount[p.city] || 0) + 1; });

    const prices  = props.map((p) => parsePrice(p.price)).filter((n) => n > 0);
    const avgPrice = prices.length ? prices.reduce((a, b) => a + b, 0) / prices.length : 0;
    const maxPrice = prices.length ? Math.max(...prices) : 0;
    const minPrice = prices.length ? Math.min(...prices) : 0;

    return {
      total, available, sold, unavailable,
      forSale, forRent,
      furnished, semi, unfurnished,
      typeCount, cityCount,
      avgPrice, maxPrice, minPrice,
    };
  }, [props]);

  const recent     = props.slice(0, 5);
  const topTypes   = Object.entries(stats.typeCount).sort((a, b) => b[1] - a[1]);
  const topCities  = Object.entries(stats.cityCount).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const maxType    = Math.max(...Object.values(stats.typeCount), 1);
  const maxCity    = Math.max(...topCities.map(([, n]) => n), 1);

  if (loading) {
    return (
      <div className="lg:ml-72 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-400 text-sm">Loading analytics…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen text-gray-800">
      <div className="max-w-6xl mx-auto lg:ml-80 px-4 md:px-6 lg:px-0 pt-24 lg:pt-10 pb-16 flex flex-col gap-6">

        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <TbReportAnalytics size={22} className="text-blue-500" />
              <h1 className="text-2xl font-extrabold">
                Dashboard <span className="text-blue-600">Analytics</span>
              </h1>
            </div>
            <p className="text-xs text-gray-400">Real-time overview of your property portfolio</p>
          </div>
          <Link
            href="/dashboard/listings/add"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-full transition shrink-0"
          >
            <TbPlus size={15} /> Add Listing
          </Link>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Listings"
            value={stats.total}
            icon={TbBuilding}
            color="blue"
          />
          <StatCard
            label="Available"
            value={stats.available}
            icon={TbSquareCheck}
            color="emerald"
            sub={stats.total ? `${Math.round((stats.available / stats.total) * 100)}% of portfolio` : undefined}
          />
          <StatCard
            label="Sold"
            value={stats.sold}
            icon={TbCurrencyDollar}
            color="violet"
            sub={stats.total ? `${Math.round((stats.sold / stats.total) * 100)}% of portfolio` : undefined}
          />
          <StatCard
            label="Unavailable"
            value={stats.unavailable}
            icon={TbAlertCircle}
            color="amber"
            sub={stats.total ? `${Math.round((stats.unavailable / stats.total) * 100)}% of portfolio` : undefined}
          />
        </div>

        {/* ── Price Insights ── */}
        <div className="grid grid-cols-3 gap-4">
          <PriceMini label="Average Price" value={`LKR ${fmtPrice(stats.avgPrice)}`} />
          <PriceMini label="Highest Listed" value={`LKR ${fmtPrice(stats.maxPrice)}`} />
          <PriceMini label="Entry Price"    value={`LKR ${fmtPrice(stats.minPrice)}`} />
        </div>

        {/* ── Middle Row: Type Breakdown + Listing / Furnishing Split ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Property type bars */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5">
              <TbBuildingSkyscraper size={16} className="text-blue-500" />
              <h2 className="text-sm font-extrabold">Property Type Breakdown</h2>
              <span className="ml-auto text-[10px] text-gray-400 font-medium">{stats.total} total</span>
            </div>
            <div className="flex flex-col gap-4">
              {topTypes.length > 0 ? topTypes.map(([type, count]) => (
                <div key={type} className="flex items-center gap-3">
                  <span className="text-[11px] text-gray-500 w-28 shrink-0 truncate">{type}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-700"
                      style={{ width: `${(count / maxType) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-gray-700 w-5 text-right shrink-0">{count}</span>
                </div>
              )) : <p className="text-xs text-gray-400">No listings yet.</p>}
            </div>
          </div>

          {/* Listing type + furnishing */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-5">
            <div>
              <h2 className="text-sm font-extrabold mb-3">Listing Type</h2>
              <div className="flex flex-col gap-3">
                <SplitBar label="For Sale" value={stats.forSale} total={stats.total} color="bg-blue-500" />
                <SplitBar label="For Rent" value={stats.forRent} total={stats.total} color="bg-violet-500" />
              </div>
            </div>

            <div className="border-t border-gray-100 pt-5">
              <h2 className="text-sm font-extrabold mb-3">Furnishing Status</h2>
              <div className="flex flex-col gap-3">
                <SplitBar label="Fully Furnished" value={stats.furnished}   total={stats.total} color="bg-emerald-500" />
                <SplitBar label="Semi Furnished"  value={stats.semi}        total={stats.total} color="bg-amber-400" />
                <SplitBar label="Unfurnished"     value={stats.unfurnished} total={stats.total} color="bg-gray-300" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom Row: Top Cities + Recent Listings ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Top cities */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5">
              <TbMapPin size={15} className="text-blue-500" />
              <h2 className="text-sm font-extrabold">Top Cities</h2>
            </div>
            <div className="flex flex-col gap-3.5">
              {topCities.length > 0 ? topCities.map(([city, count], i) => (
                <div key={city} className="flex items-center gap-2.5">
                  <span className="text-[10px] font-bold text-gray-300 w-4 shrink-0 text-right">{i + 1}</span>
                  <span className="text-[11px] text-gray-600 flex-1 truncate">{city}</span>
                  <div className="w-14 bg-gray-100 rounded-full h-1.5 overflow-hidden shrink-0">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${(count / maxCity) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-gray-700 w-4 text-right shrink-0">{count}</span>
                </div>
              )) : <p className="text-xs text-gray-400">No data yet.</p>}
            </div>
          </div>

          {/* Recent listings */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-extrabold">Recent Listings</h2>
              <Link
                href="/dashboard/listings/all"
                className="text-[11px] text-blue-500 font-bold hover:underline flex items-center gap-1"
              >
                View all <TbArrowRight size={13} />
              </Link>
            </div>

            <div className="flex flex-col divide-y divide-gray-50">
              {recent.length > 0 ? recent.map((p) => (
                <div key={p.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                    {p.image_urls[0] ? (
                      <Image src={p.image_urls[0]} alt={p.property_title} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <TbHome size={16} className="text-gray-300" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/listing/${p.id}`}
                      className="text-xs font-bold text-gray-800 hover:text-blue-600 transition line-clamp-1"
                    >
                      {p.property_title}
                    </Link>
                    <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                      <TbMapPin size={10} className="text-blue-400 shrink-0" />
                      {p.city} · {p.property_type} · {p.listing_type}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-xs font-extrabold text-blue-600">LKR {p.price}</p>
                    <span className={`text-[10px] font-bold ${statusColor[p.status] ?? "text-gray-400"}`}>
                      {p.status}
                    </span>
                  </div>
                </div>
              )) : (
                <p className="text-xs text-gray-400 py-6 text-center">No listings yet.</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

type Color = "blue" | "emerald" | "violet" | "amber";

const colorMap: Record<Color, { bg: string; icon: string; value: string }> = {
  blue:    { bg: "bg-blue-50",    icon: "text-blue-500",    value: "text-blue-700" },
  emerald: { bg: "bg-emerald-50", icon: "text-emerald-500", value: "text-emerald-700" },
  violet:  { bg: "bg-violet-50",  icon: "text-violet-500",  value: "text-violet-700" },
  amber:   { bg: "bg-amber-50",   icon: "text-amber-500",   value: "text-amber-700" },
};

function StatCard({
  label, value, icon: Icon, color, sub,
}: {
  label: string; value: number; icon: React.ElementType; color: Color; sub?: string;
}) {
  const c = colorMap[color];
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
      <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center`}>
        <Icon size={20} className={c.icon} />
      </div>
      <div>
        <p className={`text-3xl font-extrabold ${c.value}`}>{value}</p>
        <p className="text-xs text-gray-500 font-semibold mt-0.5">{label}</p>
        {sub && <p className="text-[10px] text-gray-400 mt-1">{sub}</p>}
      </div>
    </div>
  );
}

function PriceMini({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-3">
      <TbTrendingUp size={17} className="text-blue-400 shrink-0" />
      <div>
        <p className="text-[10px] text-gray-400 font-medium">{label}</p>
        <p className="text-sm font-extrabold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

function SplitBar({
  label, value, total, color,
}: {
  label: string; value: number; total: number; color: string;
}) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-gray-500 font-medium">{label}</span>
        <span className="font-bold text-gray-700">
          {value}{" "}
          <span className="text-gray-400 font-normal">({pct}%)</span>
        </span>
      </div>
      <div className="bg-gray-100 rounded-full h-1.5 overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

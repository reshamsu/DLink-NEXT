"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  TbHome,
  TbMapPin,
  TbRulerMeasure,
  TbCurrencyDollar,
  TbUser,
  TbPhone,
  TbPhoto,
  TbCheck,
  TbArrowLeft,
  TbDeviceFloppy,
  TbTrash,
  TbSearch,
  TbPencil,
} from "react-icons/tb";
import { supabase } from "@/lib/supabaseClient";

export const runtime = "edge";

interface Listing {
  id: number;
  property_title: string;
  property_subtitle: string;
  property_type: string;
  listing_type: string;
  city: string;
  location: string;
  description: string;
  bedrooms: string | number;
  bathrooms: string | number;
  perches: string | number | null;
  sqft: string | number;
  actual_floor: string;
  floors: string | null;
  building_age: string | null;
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

// ── WebP conversion ───────────────────────────────────────────────────────────
const compressToWebP = (file: File, quality = 0.82): Promise<File> =>
  new Promise((resolve, reject) => {
    const img = new window.Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) { URL.revokeObjectURL(url); return reject(new Error("Canvas failed")); }
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error("WebP conversion failed"));
          resolve(new File([blob], file.name.replace(/\.[^.]+$/, ".webp"), { type: "image/webp" }));
        },
        "image/webp",
        quality,
      );
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Image load failed")); };
    img.src = url;
  });

const uploadImages = async (files: FileList, folder: string): Promise<string[]> => {
  const urls: string[] = [];
  for (const file of Array.from(files)) {
    let fileToUpload: File;
    try { fileToUpload = await compressToWebP(file, 0.82); } catch { fileToUpload = file; }
    const fd = new FormData();
    fd.append("file", fileToUpload);
    fd.append("folder", folder);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const text = await res.text();
    if (!res.ok || !text) throw new Error(`Upload failed: ${res.status}`);
    const { publicUrl } = JSON.parse(text);
    urls.push(publicUrl);
  }
  return urls;
};

const safeArray = (val: unknown): string[] => {
  if (Array.isArray(val)) return val as string[];
  if (typeof val === "string") {
    try { return JSON.parse(val); } catch { return []; }
  }
  return [];
};

// ── Shared styles ─────────────────────────────────────────────────────────────
const inp =
  "bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm transition placeholder:text-gray-400";

const SectionCard = ({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
    <div className="flex items-center gap-3 px-8 py-5 border-b border-gray-100">
      <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-orange-50 text-orange-500">
        <Icon size={18} />
      </span>
      <h3 className="font-bold text-sm">{title}</h3>
    </div>
    <div className="p-8">{children}</div>
  </div>
);

const Field = ({
  label,
  required,
  note,
  children,
}: {
  label: string;
  required?: boolean;
  note?: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-bold text-gray-700">
      {label}
      {required && <span className="text-orange-500 ml-0.5">*</span>}
    </label>
    {children}
    {note && <p className="text-[10px] text-gray-400">{note}</p>}
  </div>
);

const AMENITIES = [
  "24/7 Security",
  "Gym & Fitness Center",
  "Swimming Pool",
  "Air Conditioning",
  "CCTV Systems",
  "Backup Generator",
  "Solar Power & Hot Water",
  "Roller Shutter Gates",
];
const DOCUMENTS = ["Sales Agreement", "Deed", "COC", "Bimsaviya Certificate"];

// ── Listing Picker ────────────────────────────────────────────────────────────
type PickerListing = Pick<Listing, "id" | "property_title" | "property_subtitle" | "city" | "status" | "image_urls">;

function ListingPicker({ onSelect }: { onSelect: (id: number) => void }) {
  const [listings, setListings] = useState<PickerListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("dlink_listings")
        .select("id, property_title, property_subtitle, city, status, image_urls")
        .order("created_at", { ascending: false });
      if (!error && data) {
        setListings(data.map((r) => ({ ...r, image_urls: safeArray(r.image_urls) })));
      }
      setLoading(false);
    };
    load();
  }, []);

  const filtered = useMemo(() =>
    listings.filter((l) =>
      l.property_title.toLowerCase().includes(query.toLowerCase()) ||
      l.city.toLowerCase().includes(query.toLowerCase())
    ), [listings, query]);

  const statusColor: Record<string, string> = {
    Available: "bg-green-100 text-green-700",
    Sold: "bg-red-100 text-red-600",
    Unavailable: "bg-yellow-100 text-yellow-700",
  };

  return (
    <div className="bg-gray-100 min-h-screen text-gray-800">
      <div className="max-w-5xl mx-auto lg:ml-80 px-4 md:px-6 pt-24 lg:pt-16 pb-16 flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-extrabold">
            Edit <span className="text-orange-500">Listing</span>
          </h1>
          <p className="text-xs text-gray-400">Select a listing below to edit its details.</p>
        </div>

        {/* Search */}
        <div className="relative">
          <TbSearch size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title or city…"
            className={`${inp} pl-10`}
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-40 gap-3">
            <div className="w-7 h-7 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-500">Loading listings…</p>
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-400 py-20 text-sm">No listings found.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((l) => (
              <button
                key={l.id}
                onClick={() => onSelect(l.id)}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-orange-300 hover:shadow-md transition-all duration-200 flex items-center gap-4 p-4 text-left group"
              >
                {/* Thumbnail */}
                <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                  {l.image_urls[0] ? (
                    <Image src={l.image_urls[0]} alt={l.property_title} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <TbHome size={20} className="text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-gray-800 line-clamp-1 group-hover:text-orange-500 transition-colors">
                    {l.property_title}
                  </p>
                  <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{l.property_subtitle}</p>
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <TbMapPin size={11} className="text-orange-400" /> {l.city}
                  </p>
                </div>

                {/* Status + arrow */}
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${statusColor[l.status] ?? "bg-gray-100 text-gray-500"}`}>
                    {l.status}
                  </span>
                  <TbPencil size={18} className="text-gray-300 group-hover:text-orange-500 transition-colors" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function EditPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-[70vh] gap-3">
        <div className="w-7 h-7 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-500">Loading…</p>
      </div>
    }>
      <EditRouter />
    </Suspense>
  );
}

function EditRouter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  if (!id) {
    return <ListingPicker onSelect={(selectedId) => router.push(`/dashboard/listings/edit?id=${selectedId}`)} />;
  }

  return <EditForm id={id} />;
}

// ── Edit Form ─────────────────────────────────────────────────────────────────
function EditForm({ id }: { id: string }) {
  const router = useRouter();

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newImages, setNewImages] = useState<FileList | null>(null);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [removedImages, setRemovedImages] = useState<Set<string>>(new Set());

  // ── Fetch ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchListing = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("dlink_listings")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        console.error("Fetch error:", error?.message);
        setLoading(false);
        return;
      }

      setListing({
        ...data,
        amenities: safeArray(data.amenities),
        property_documents: safeArray(data.property_documents),
        image_urls: safeArray(data.image_urls),
        price_negotiable: data.price_negotiable ?? false,
        approx: data.approx ?? false,
        lift_access: data.lift_access ?? "",
        vehicle_park: data.vehicle_park ?? "",
        remarks: data.remarks ?? "",
        owner_name: data.owner_name ?? "",
        property_location: data.property_location ?? "",
        property_identity: data.property_identity ?? "",
        contact_number: data.contact_number ?? "",
        actual_floor: data.actual_floor ?? "",
        is_furnished: data.is_furnished ?? "",
      } as Listing);
      setLoading(false);
    };
    fetchListing();
  }, [id]);

  // ── Field updater ─────────────────────────────────────────────────────────
  const set = <K extends keyof Listing>(key: K, value: Listing[K]) =>
    setListing((prev) => (prev ? { ...prev, [key]: value } : prev));

  const toggleArray = (key: "amenities" | "property_documents", value: string) => {
    if (!listing) return;
    const arr = listing[key];
    set(key, arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]);
  };

  // ── Existing image removal ────────────────────────────────────────────────
  const toggleRemoveImage = (url: string) => {
    setRemovedImages((prev) => {
      const next = new Set(prev);
      next.has(url) ? next.delete(url) : next.add(url);
      return next;
    });
  };

  const existingImages = useMemo(
    () => (listing?.image_urls ?? []).filter((u) => !removedImages.has(u)),
    [listing?.image_urls, removedImages],
  );

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!listing) return;
    setSaving(true);
    setMessage(null);

    let finalImages = existingImages;
    if (newImages && newImages.length > 0) {
      try {
        setUploading(true);
        const uploaded = await uploadImages(newImages, "listings");
        finalImages = [...existingImages, ...uploaded];
      } catch (err) {
        console.error("Image upload error:", err);
        setMessage({ type: "err", text: "Image upload failed — check console." });
        setUploading(false);
        setSaving(false);
        return;
      } finally {
        setUploading(false);
      }
    }

    const payload = {
      property_title: listing.property_title,
      property_subtitle: listing.property_subtitle,
      property_type: listing.property_type,
      listing_type: listing.listing_type,
      city: listing.city,
      location: listing.location,
      description: listing.description,
      bedrooms: Number(listing.bedrooms),
      bathrooms: Number(listing.bathrooms),
      sqft: Number(listing.sqft),
      perches: listing.perches || null,
      floors: listing.floors || null,
      building_age: listing.building_age || null,
      actual_floor: listing.actual_floor,
      price: listing.price,
      full_price: listing.full_price,
      price_negotiable: listing.price_negotiable,
      approx: listing.approx,
      property_documents: listing.property_documents,
      lift_access: listing.lift_access,
      vehicle_park: listing.vehicle_park,
      remarks: listing.remarks,
      amenities: listing.amenities,
      status: listing.status,
      is_furnished: listing.is_furnished,
      owner_name: listing.owner_name,
      property_location: listing.property_location,
      property_identity: listing.property_identity,
      contact_number: listing.contact_number,
      image_urls: finalImages,
    };

    const { error } = await supabase
      .from("dlink_listings")
      .update(payload)
      .eq("id", listing.id);

    setSaving(false);

    if (error) {
      console.error("Update error:", error.message);
      setMessage({ type: "err", text: `Failed to update: ${error.message}` });
    } else {
      setListing((prev) => prev ? { ...prev, image_urls: finalImages } : prev);
      setNewImages(null);
      setRemovedImages(new Set());
      setMessage({ type: "ok", text: "Listing updated successfully!" });
      router.push(`/listing/${id}`);
    }
  };

  // ── States ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh] gap-3">
        <div className="w-7 h-7 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-500">Loading listing…</p>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
        <p className="text-gray-500 text-sm">Listing not found.</p>
        <Link href="/dashboard/listings/edit" className="btn-orange-sm w-fit">
          Back to Listings
        </Link>
      </div>
    );
  }

  const busy = saving || uploading;

  return (
    <div className="bg-gray-100 min-h-screen text-gray-800">
      <div className="max-w-5xl mx-auto lg:ml-80 px-4 md:px-6 pt-24 lg:pt-16 pb-16 flex flex-col gap-6">

        {/* ── Page header ──────────────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-extrabold">
              Edit <span className="text-orange-500">Listing</span>
            </h1>
            <p className="text-xs text-gray-400 line-clamp-1">{listing.property_title}</p>
          </div>
          <Link
            href="/dashboard/listings/edit"
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-orange-500 transition shrink-0 mt-1"
          >
            <TbArrowLeft size={15} /> All Listings
          </Link>
        </div>

        {/* ── 1. Property Info ─────────────────────────────────────────── */}
        <SectionCard icon={TbHome} title="Property Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Property Title" required>
              <input value={listing.property_title}
                onChange={(e) => set("property_title", e.target.value)}
                placeholder="e.g. Modern Sea-View Apartment" className={inp} />
            </Field>
            <Field label="Property Subtitle" required>
              <input value={listing.property_subtitle}
                onChange={(e) => set("property_subtitle", e.target.value)}
                placeholder="e.g. 3BR with sea views, Colombo 03" className={inp} />
            </Field>
            <Field label="Property Type" required>
              <select value={listing.property_type}
                onChange={(e) => set("property_type", e.target.value)} className={inp}>
                <option value="" disabled>Select type…</option>
                <option value="Apartment">Apartment</option>
                <option value="House">House</option>
                <option value="Land">Land</option>
                <option value="Comm. Building/Shop">Commercial Building / Shop</option>
                <option value="Commercial Land">Commercial Land</option>
                <option value="Villa">Villa</option>
              </select>
            </Field>
            <Field label="Listing Type" required>
              <select value={listing.listing_type}
                onChange={(e) => set("listing_type", e.target.value)} className={inp}>
                <option value="" disabled>Select type…</option>
                <option value="Sale">Sale</option>
                <option value="Rent">Rent</option>
                <option value="Lease">Lease</option>
              </select>
            </Field>
            <Field label="Status" required>
              <select value={listing.status}
                onChange={(e) => set("status", e.target.value)} className={inp}>
                <option value="Available">Available</option>
                <option value="Unavailable">Unavailable</option>
                <option value="Sold">Sold</option>
              </select>
            </Field>
            <Field label="Furnishing">
              <select value={listing.is_furnished}
                onChange={(e) => set("is_furnished", e.target.value)} className={inp}>
                <option value="" disabled>Select…</option>
                <option value="Fully-Furnished">Fully Furnished</option>
                <option value="Semi-Furnished">Semi Furnished</option>
                <option value="UnFurnished">Unfurnished</option>
              </select>
            </Field>
            <Field label="Description" required>
              <textarea value={listing.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Describe the property…" rows={4} className={inp} />
            </Field>
            <Field label="Remarks">
              <textarea value={listing.remarks}
                onChange={(e) => set("remarks", e.target.value)}
                placeholder="Any additional notes…" rows={4} className={inp} />
            </Field>
          </div>
        </SectionCard>

        {/* ── 2. Location ──────────────────────────────────────────────── */}
        <SectionCard icon={TbMapPin} title="Location">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Town / City" required>
              <select value={listing.city}
                onChange={(e) => set("city", e.target.value)} className={inp}>
                <option value="" disabled>Select city…</option>
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
                  <option value="Borelasgamuwa">Borelasgamuwa</option>
                  <option value="Ratmalana">Ratmalana</option>
                  <option value="Moratuwa">Moratuwa</option>
                </optgroup>
              </select>
            </Field>
            <Field label="Location Side" required>
              <select value={listing.location}
                onChange={(e) => set("location", e.target.value)} className={inp}>
                <option value="" disabled>Select…</option>
                <option value="Land Side">Land Side</option>
                <option value="Sea Side">Sea Side</option>
              </select>
            </Field>
          </div>
        </SectionCard>

        {/* ── 3. Specifications ────────────────────────────────────────── */}
        <SectionCard icon={TbRulerMeasure} title="Property Specifications">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            <Field label="Bedrooms" required>
              <input value={listing.bedrooms} type="number" min={0}
                onChange={(e) => set("bedrooms", e.target.value)} placeholder="0" className={inp} />
            </Field>
            <Field label="Bathrooms" required>
              <input value={listing.bathrooms} type="number" min={0}
                onChange={(e) => set("bathrooms", e.target.value)} placeholder="0" className={inp} />
            </Field>
            <Field label="Sqft." required>
              <input value={listing.sqft} type="number" min={0}
                onChange={(e) => set("sqft", e.target.value)} placeholder="0" className={inp} />
            </Field>
            <Field label="Perches">
              <input value={listing.perches ?? ""}
                onChange={(e) => set("perches", e.target.value)} placeholder="e.g. 10" className={inp} />
            </Field>
            <Field label="Floors">
              <input value={listing.floors ?? ""}
                onChange={(e) => set("floors", e.target.value)} placeholder="e.g. 5" className={inp} />
            </Field>
            <Field label="Building Age">
              <input value={listing.building_age ?? ""}
                onChange={(e) => set("building_age", e.target.value)} placeholder="e.g. 5 years" className={inp} />
            </Field>
          </div>

          {/* Lift Access */}
          <div className="mt-6">
            <p className="text-xs font-bold text-gray-700 mb-3">Lift Access</p>
            <div className="flex flex-wrap gap-3">
              {["None", "1 Lift", "2 Lifts", "3 Lifts"].map((opt) => (
                <label key={opt} className={`flex items-center gap-2 cursor-pointer text-xs font-semibold px-4 py-2 rounded-xl border transition ${listing.lift_access === opt ? "border-orange-400 bg-orange-50 text-orange-600" : "border-gray-200 bg-gray-50 text-gray-600"}`}>
                  <input type="radio" value={opt} checked={listing.lift_access === opt}
                    onChange={() => set("lift_access", opt)} className="hidden" />
                  {listing.lift_access === opt && <TbCheck size={12} />}
                  {opt}
                </label>
              ))}
            </div>
          </div>

          {/* Vehicle Parking */}
          <div className="mt-5">
            <p className="text-xs font-bold text-gray-700 mb-3">Vehicle Parking</p>
            <div className="flex flex-wrap gap-3">
              {["None", "1 Parking", "2 Parking", "3 Parking & above"].map((opt) => (
                <label key={opt} className={`flex items-center gap-2 cursor-pointer text-xs font-semibold px-4 py-2 rounded-xl border transition ${listing.vehicle_park === opt ? "border-orange-400 bg-orange-50 text-orange-600" : "border-gray-200 bg-gray-50 text-gray-600"}`}>
                  <input type="radio" value={opt} checked={listing.vehicle_park === opt}
                    onChange={() => set("vehicle_park", opt)} className="hidden" />
                  {listing.vehicle_park === opt && <TbCheck size={12} />}
                  {opt}
                </label>
              ))}
            </div>
          </div>
        </SectionCard>

        {/* ── 4. Pricing ───────────────────────────────────────────────── */}
        <SectionCard icon={TbCurrencyDollar} title="Pricing">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Price (LKR)" required>
              <input value={listing.price}
                onChange={(e) => set("price", e.target.value)}
                placeholder="e.g. 45 Mn" className={inp} />
              <label className="flex items-center gap-2 text-xs font-semibold mt-1 cursor-pointer select-none">
                <input type="checkbox" checked={listing.price_negotiable}
                  onChange={(e) => set("price_negotiable", e.target.checked)}
                  className="accent-orange-500 w-3.5 h-3.5" />
                Negotiable
              </label>
            </Field>
            <Field label="Price in Full (LKR)" required>
              <input value={listing.full_price}
                onChange={(e) => set("full_price", e.target.value)}
                placeholder="e.g. 45000000" className={inp} />
            </Field>
          </div>
        </SectionCard>

        {/* ── 5. Features ──────────────────────────────────────────────── */}
        <SectionCard icon={TbCheck} title="Features & Documents">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-xs font-bold text-gray-700 mb-3">Amenities</p>
              <div className="grid grid-cols-1 gap-2">
                {AMENITIES.map((a) => (
                  <label key={a} className="flex items-center gap-3 cursor-pointer text-sm font-semibold select-none group"
                    onClick={() => toggleArray("amenities", a)}>
                    <span className={`flex items-center justify-center w-4 h-4 rounded border transition ${listing.amenities.includes(a) ? "bg-orange-500 border-orange-500" : "border-gray-300 group-hover:border-orange-300"}`}>
                      {listing.amenities.includes(a) && <TbCheck size={10} className="text-white" />}
                    </span>
                    <span className="text-gray-700">{a}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-700 mb-3">Property Documents</p>
              <div className="grid grid-cols-1 gap-2">
                {DOCUMENTS.map((d) => (
                  <label key={d} className="flex items-center gap-3 cursor-pointer text-sm font-semibold select-none group"
                    onClick={() => toggleArray("property_documents", d)}>
                    <span className={`flex items-center justify-center w-4 h-4 rounded border transition ${listing.property_documents.includes(d) ? "bg-orange-500 border-orange-500" : "border-gray-300 group-hover:border-orange-300"}`}>
                      {listing.property_documents.includes(d) && <TbCheck size={10} className="text-white" />}
                    </span>
                    <span className="text-gray-700">{d}</span>
                  </label>
                ))}
              </div>

              <div className="mt-6">
                <p className="text-xs font-bold text-gray-700 mb-1">Building Age Approx?</p>
                <label className="flex items-center gap-3 cursor-pointer text-sm font-semibold select-none group"
                  onClick={() => set("approx", !listing.approx)}>
                  <span className={`flex items-center justify-center w-4 h-4 rounded border transition ${listing.approx ? "bg-orange-500 border-orange-500" : "border-gray-300 group-hover:border-orange-300"}`}>
                    {listing.approx && <TbCheck size={10} className="text-white" />}
                  </span>
                  <span className="text-gray-700">Mark as approximate</span>
                </label>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* ── 6. Images ────────────────────────────────────────────────── */}
        <SectionCard icon={TbPhoto} title="Property Images">
          {listing.image_urls.length > 0 && (
            <div className="mb-6">
              <p className="text-xs font-bold text-gray-700 mb-3">
                Current Images — click to mark for removal
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {listing.image_urls.map((url, i) => {
                  const isRemoved = removedImages.has(url);
                  return (
                    <div key={i} className="relative group rounded-xl overflow-hidden aspect-video cursor-pointer"
                      onClick={() => toggleRemoveImage(url)}>
                      <Image src={url} alt={`Image ${i + 1}`} fill className="object-cover" />
                      <div className={`absolute inset-0 flex items-center justify-center transition ${isRemoved ? "bg-red-500/70" : "bg-black/0 group-hover:bg-black/30"}`}>
                        {isRemoved
                          ? <TbTrash size={22} className="text-white" />
                          : <span className="text-white text-xs font-bold opacity-0 group-hover:opacity-100">Remove</span>
                        }
                      </div>
                    </div>
                  );
                })}
              </div>
              {removedImages.size > 0 && (
                <p className="mt-2 text-xs text-red-500 font-semibold">
                  {removedImages.size} image{removedImages.size > 1 ? "s" : ""} will be removed on save.
                </p>
              )}
            </div>
          )}

          <Field label="Add New Images — auto-converted to WebP">
            <input type="file" multiple accept="image/*"
              onChange={(e) => setNewImages(e.target.files)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 w-full text-sm file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-orange-500 file:text-white hover:file:bg-orange-600 transition" />
          </Field>
          {newImages && newImages.length > 0 && (
            <p className="mt-2 text-xs text-gray-500">
              {newImages.length} new file{newImages.length > 1 ? "s" : ""} selected
            </p>
          )}
        </SectionCard>

        {/* ── 7. Contact Info ──────────────────────────────────────────── */}
        <SectionCard icon={TbUser} title="Contact Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Owner / Agent Name">
              <input value={listing.owner_name}
                onChange={(e) => set("owner_name", e.target.value)}
                placeholder="Enter name" className={inp} />
            </Field>
            <Field label="Property Identity">
              <select value={listing.property_identity}
                onChange={(e) => set("property_identity", e.target.value)} className={inp}>
                <option value="" disabled>Select…</option>
                <option value="Owner">Owner</option>
                <option value="Agent">Agent</option>
                <option value="Investor">Investor</option>
              </select>
            </Field>
            <Field label="Apartment Name / Location">
              <input value={listing.property_location}
                onChange={(e) => set("property_location", e.target.value)}
                placeholder="e.g. Monarch Residencies" className={inp} />
            </Field>
            <Field label="Actual Floor" note="For internal reference only — not publicly displayed.">
              <input value={listing.actual_floor}
                onChange={(e) => set("actual_floor", e.target.value)}
                placeholder="e.g. 12" className={inp} />
            </Field>
            <Field label="Contact Number">
              <div className="relative">
                <TbPhone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={listing.contact_number}
                  onChange={(e) => set("contact_number", e.target.value)}
                  type="tel" placeholder="e.g. 0771234567" className={`${inp} pl-9`} />
              </div>
            </Field>
          </div>
        </SectionCard>

        {/* ── Message & Save ────────────────────────────────────────────── */}
        {message && (
          <div className={`rounded-2xl px-5 py-3.5 text-sm font-semibold ${message.type === "ok" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-600 border border-red-200"}`}>
            {message.text}
          </div>
        )}

        <div className="flex items-center justify-between gap-4">
          <Link
            href="/dashboard/listings/edit"
            className="text-sm font-semibold text-gray-500 hover:text-gray-800 transition"
          >
            ← Back to Listings
          </Link>
          <button onClick={handleSave} disabled={busy}
            className="inline-flex items-center gap-2.5 font-bold rounded-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed px-8 py-3 text-sm text-white transition-all hover:scale-105 duration-300 select-none">
            {busy ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {uploading ? "Uploading images…" : "Saving…"}
              </>
            ) : (
              <>
                <TbDeviceFloppy size={18} />
                Save Changes
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}

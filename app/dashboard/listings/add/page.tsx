"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  TbSend2,
  TbHome,
  TbMapPin,
  TbRulerMeasure,
  TbCurrencyDollar,
  TbUser,
  TbPhone,
  TbPhoto,
  TbCheck,
} from "react-icons/tb";

export const runtime = "edge";

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

const uploadImages = async (files: FileList | null, folder: string): Promise<string[]> => {
  if (!files || files.length === 0) return [];
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

// ── Empty listing ─────────────────────────────────────────────────────────────
const emptyListing: Listing = {
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

// ── Page ──────────────────────────────────────────────────────────────────────
const Page = () => {
  const router = useRouter();
  const [form, setForm] = useState<Listing>(emptyListing);
  const [images, setImages] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // ── Change handler ────────────────────────────────────────────────────────
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const target = e.target;
    const { name, value } = target;

    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      const checked = target.checked;
      if (name === "amenities") {
        setForm((p) => ({
          ...p,
          amenities: checked ? [...p.amenities, value] : p.amenities.filter((a) => a !== value),
        }));
        return;
      }
      if (name === "property_documents") {
        setForm((p) => ({
          ...p,
          property_documents: checked
            ? [...p.property_documents, value]
            : p.property_documents.filter((d) => d !== value),
        }));
        return;
      }
      if (name === "approx") { setForm((p) => ({ ...p, approx: checked })); return; }
      if (name === "price_negotiable") { setForm((p) => ({ ...p, price_negotiable: checked })); return; }
    }

    setForm((p) => ({ ...p, [name]: value }));
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    let uploadedUrls: string[] = [];
    try {
      setUploading(true);
      uploadedUrls = await uploadImages(images, "listings");
    } catch (err) {
      console.error("Image upload error:", err);
      setMessage({ type: "err", text: "Image upload failed — check console." });
      setUploading(false);
      setLoading(false);
      return;
    } finally {
      setUploading(false);
    }

    const payload = {
      ...form,
      id: Date.now(),
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
      sqft: Number(form.sqft),
      perches: form.perches || null,
      floors: form.floors || null,
      building_age: form.building_age || null,
      image_urls: uploadedUrls,
    };

    const { data, error } = await supabase
      .from("dlink_listings")
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error("Error adding listing:", error.message);
      setMessage({ type: "err", text: `Failed to add listing: ${error.message}` });
    } else {
      setForm(emptyListing);
      setImages(null);
      setMessage({ type: "ok", text: "Listing added successfully!" });
      router.push(`/listing/${data.id}`);
    }

    setLoading(false);
  };

  const busy = loading || uploading;

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

  return (
    <div className="bg-gray-100 min-h-screen text-gray-800">
      <div className="max-w-5xl mx-auto lg:ml-80 px-4 md:px-6 pt-24 lg:pt-16 pb-16 flex flex-col gap-6">

        {/* ── Page header ──────────────────────────────────────────────── */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-extrabold">
            Add <span className="text-orange-500">New Listing</span>
          </h1>
          <p className="text-xs text-gray-400">
            Fill in the property details to publish on{" "}
            <Link href="/" className="underline hover:text-orange-500">D-Link Colombo</Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          {/* ── 1. Property Info ─────────────────────────────────────────── */}
          <SectionCard icon={TbHome} title="Property Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Property Title" required>
                <input name="property_title" value={form.property_title} onChange={handleChange}
                  placeholder="e.g. Modern Sea-View Apartment" className={inp} required />
              </Field>
              <Field label="Property Subtitle" required>
                <input name="property_subtitle" value={form.property_subtitle} onChange={handleChange}
                  placeholder="e.g. 3BR with sea views, Colombo 03" className={inp} required />
              </Field>
              <Field label="Property Type" required>
                <select name="property_type" value={form.property_type} onChange={handleChange} className={inp} required>
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
                <select name="listing_type" value={form.listing_type} onChange={handleChange} className={inp} required>
                  <option value="" disabled>Select type…</option>
                  <option value="Sale">Sale</option>
                  <option value="Rent">Rent</option>
                  <option value="Lease">Lease</option>
                </select>
              </Field>
              <Field label="Status" required>
                <select name="status" value={form.status} onChange={handleChange} className={inp} required>
                  <option value="Available">Available</option>
                  <option value="Unavailable">Unavailable</option>
                  <option value="Sold">Sold</option>
                </select>
              </Field>
              <Field label="Furnishing">
                <select name="is_furnished" value={form.is_furnished} onChange={handleChange} className={inp}>
                  <option value="" disabled>Select…</option>
                  <option value="Fully-Furnished">Fully Furnished</option>
                  <option value="Semi-Furnished">Semi Furnished</option>
                  <option value="UnFurnished">Unfurnished</option>
                </select>
              </Field>
              <Field label="Description" required>
                <textarea name="description" value={form.description} onChange={handleChange}
                  placeholder="Describe the property…" rows={4} className={inp} required />
              </Field>
              <Field label="Remarks">
                <textarea name="remarks" value={form.remarks} onChange={handleChange}
                  placeholder="Any additional notes…" rows={4} className={inp} />
              </Field>
            </div>
          </SectionCard>

          {/* ── 2. Location ──────────────────────────────────────────────── */}
          <SectionCard icon={TbMapPin} title="Location">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Town / City" required>
                <select name="city" value={form.city} onChange={handleChange} className={inp} required>
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
                <select name="location" value={form.location} onChange={handleChange} className={inp} required>
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
                <input name="bedrooms" value={form.bedrooms} onChange={handleChange}
                  type="number" min={0} placeholder="0" className={inp} required />
              </Field>
              <Field label="Bathrooms" required>
                <input name="bathrooms" value={form.bathrooms} onChange={handleChange}
                  type="number" min={0} placeholder="0" className={inp} required />
              </Field>
              <Field label="Sqft." required>
                <input name="sqft" value={form.sqft} onChange={handleChange}
                  type="number" min={0} placeholder="0" className={inp} required />
              </Field>
              <Field label="Perches">
                <input name="perches" value={form.perches} onChange={handleChange}
                  placeholder="e.g. 10" className={inp} />
              </Field>
              <Field label="Floors">
                <input name="floors" value={form.floors} onChange={handleChange}
                  placeholder="e.g. 5" className={inp} />
              </Field>
              <Field label="Building Age">
                <input name="building_age" value={form.building_age} onChange={handleChange}
                  placeholder="e.g. 5 years" className={inp} />
              </Field>
            </div>

            {/* Lift Access */}
            <div className="mt-6">
              <p className="text-xs font-bold text-gray-700 mb-3">Lift Access</p>
              <div className="flex flex-wrap gap-3">
                {["None", "1 Lift", "2 Lifts", "3 Lifts"].map((opt) => (
                  <label key={opt} className={`flex items-center gap-2 cursor-pointer text-xs font-semibold px-4 py-2 rounded-xl border transition ${form.lift_access === opt ? "border-orange-400 bg-orange-50 text-orange-600" : "border-gray-200 bg-gray-50 text-gray-600"}`}>
                    <input type="radio" name="lift_access" value={opt} checked={form.lift_access === opt}
                      onChange={(e) => setForm((p) => ({ ...p, lift_access: e.target.value }))}
                      className="hidden" />
                    {form.lift_access === opt && <TbCheck size={12} />}
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
                  <label key={opt} className={`flex items-center gap-2 cursor-pointer text-xs font-semibold px-4 py-2 rounded-xl border transition ${form.vehicle_park === opt ? "border-orange-400 bg-orange-50 text-orange-600" : "border-gray-200 bg-gray-50 text-gray-600"}`}>
                    <input type="radio" name="vehicle_park" value={opt} checked={form.vehicle_park === opt}
                      onChange={(e) => setForm((p) => ({ ...p, vehicle_park: e.target.value }))}
                      className="hidden" />
                    {form.vehicle_park === opt && <TbCheck size={12} />}
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
                <input name="price" value={form.price} onChange={handleChange}
                  placeholder="e.g. 45 Mn" className={inp} required />
                <label className="flex items-center gap-2 text-xs font-semibold mt-1 cursor-pointer select-none">
                  <input type="checkbox" name="price_negotiable" checked={form.price_negotiable} onChange={handleChange}
                    className="accent-orange-500 w-3.5 h-3.5" />
                  Negotiable
                </label>
              </Field>
              <Field label="Price in Full (LKR)" required>
                <input name="full_price" value={form.full_price} onChange={handleChange}
                  placeholder="e.g. 45000000" className={inp} required />
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
                    <label key={a} className="flex items-center gap-3 cursor-pointer text-sm font-semibold select-none group">
                      <span className={`flex items-center justify-center w-4 h-4 rounded border transition ${form.amenities.includes(a) ? "bg-orange-500 border-orange-500" : "border-gray-300 group-hover:border-orange-300"}`}>
                        {form.amenities.includes(a) && <TbCheck size={10} className="text-white" />}
                      </span>
                      <input type="checkbox" name="amenities" value={a} checked={form.amenities.includes(a)}
                        onChange={handleChange} className="hidden" />
                      <span className="text-gray-700">{a}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-700 mb-3">Property Documents</p>
                <div className="grid grid-cols-1 gap-2">
                  {DOCUMENTS.map((d) => (
                    <label key={d} className="flex items-center gap-3 cursor-pointer text-sm font-semibold select-none group">
                      <span className={`flex items-center justify-center w-4 h-4 rounded border transition ${form.property_documents.includes(d) ? "bg-orange-500 border-orange-500" : "border-gray-300 group-hover:border-orange-300"}`}>
                        {form.property_documents.includes(d) && <TbCheck size={10} className="text-white" />}
                      </span>
                      <input type="checkbox" name="property_documents" value={d} checked={form.property_documents.includes(d)}
                        onChange={handleChange} className="hidden" />
                      <span className="text-gray-700">{d}</span>
                    </label>
                  ))}
                </div>

                <div className="mt-6">
                  <p className="text-xs font-bold text-gray-700 mb-1">Building Age Approx?</p>
                  <label className="flex items-center gap-3 cursor-pointer text-sm font-semibold select-none group">
                    <span className={`flex items-center justify-center w-4 h-4 rounded border transition ${form.approx ? "bg-orange-500 border-orange-500" : "border-gray-300 group-hover:border-orange-300"}`}>
                      {form.approx && <TbCheck size={10} className="text-white" />}
                    </span>
                    <input type="checkbox" name="approx" checked={form.approx} onChange={handleChange} className="hidden" />
                    <span className="text-gray-700">Mark as approximate</span>
                  </label>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* ── 6. Images ────────────────────────────────────────────────── */}
          <SectionCard icon={TbPhoto} title="Property Images">
            <Field label="Upload Images — auto-converted to WebP" required>
              <input type="file" multiple accept="image/*"
                onChange={(e) => setImages(e.target.files)}
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 w-full text-sm file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-orange-500 file:text-white hover:file:bg-orange-600 transition"
                required />
            </Field>
            {images && images.length > 0 && (
              <p className="mt-2 text-xs text-gray-500">{images.length} file{images.length > 1 ? "s" : ""} selected</p>
            )}
          </SectionCard>

          {/* ── 7. Contact Info ──────────────────────────────────────────── */}
          <SectionCard icon={TbUser} title="Contact Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Owner / Agent Name">
                <input name="owner_name" value={form.owner_name} onChange={handleChange}
                  placeholder="Enter name" className={inp} />
              </Field>
              <Field label="Property Identity">
                <select name="property_identity" value={form.property_identity} onChange={handleChange} className={inp}>
                  <option value="" disabled>Select…</option>
                  <option value="Owner">Owner</option>
                  <option value="Agent">Agent</option>
                  <option value="Investor">Investor</option>
                </select>
              </Field>
              <Field label="Apartment Name / Location">
                <input name="property_location" value={form.property_location} onChange={handleChange}
                  placeholder="e.g. Monarch Residencies" className={inp} />
              </Field>
              <Field label="Actual Floor" note="For internal reference only — not publicly displayed.">
                <input name="actual_floor" value={form.actual_floor} onChange={handleChange}
                  placeholder="e.g. 12" className={inp} />
              </Field>
              <Field label="Contact Number">
                <div className="relative">
                  <TbPhone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input name="contact_number" value={form.contact_number} onChange={handleChange}
                    type="tel" placeholder="e.g. 0771234567" className={`${inp} pl-9`} />
                </div>
              </Field>
            </div>
          </SectionCard>

          {/* ── Message & Submit ─────────────────────────────────────────── */}
          {message && (
            <div className={`rounded-2xl px-5 py-3.5 text-sm font-semibold ${message.type === "ok" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-600 border border-red-200"}`}>
              {message.text}
            </div>
          )}

          <div className="flex justify-end">
            <button type="submit" disabled={busy}
              className="inline-flex items-center gap-2.5 font-bold rounded-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed px-8 py-3 text-sm text-white transition-all hover:scale-105 duration-300 select-none">
              {busy ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {uploading ? "Uploading images…" : "Saving…"}
                </>
              ) : (
                <>
                  <TbSend2 size={18} />
                  Submit Listing
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Page;

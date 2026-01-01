"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { TbSend2 } from "react-icons/tb";

const FALLBACK_IMAGES = ["/assets/banner/property5.jpg"];

interface HeroRow {
  title: string;
  subtitle: string;
  page_type: string[];
  image_urls: string[];
}
interface ContactForm {
  full_name: string;
  email: string;
  phone: string;
  best_reason: string[];
  inquiry_subject: string;
  inquiry_message: string;
}

const Hero = () => {
  // HARD GUARD
  if (!supabase) {
    return (
      <div className="p-10 text-center text-teal-600">
        Supabase not configured.
      </div>
    );
  }

  const [current, setCurrent] = useState(0);
  const [images, setImages] = useState<string[]>(FALLBACK_IMAGES);
  const [title, setTitle] = useState("Get in Touch");
  const [subtitle, setSubtitle] = useState(
    "Our team is here to assist you with buying, selling, or investing in premium real estate."
  );
  const [pageType, setPageType] = useState("Contact");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState<ContactForm>({
    full_name: "",
    email: "",
    phone: "",
    best_reason: [],
    inquiry_subject: "",
    inquiry_message: "",
  });

  useEffect(() => {
    if (!supabase) return;

    const fetchHero = async () => {
      const { data, error } = await supabase
        .from("hero")
        .select("*")
        .contains("page_type", ["Contact"])
        .order("created_at", { ascending: true })
        .limit(1)
        .single();

      if (error || !data) return;

      const hero = data as HeroRow;

      if (hero.image_urls?.length) {
        setImages(hero.image_urls);
      }

      if (hero.title) setTitle(hero.title);
      if (hero.subtitle) setSubtitle(hero.subtitle);
      if (hero.page_type) setPageType(hero.page_type[0]);
    };

    fetchHero();
  }, []);

  useEffect(() => {
    const interval = setInterval(
      () => setCurrent((prev) => (prev + 1) % images.length),
      10000
    );
    return () => clearInterval(interval);
  }, [images.length]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const payload = {
      full_name: form.full_name,
      email: form.email,
      phone: form.phone,
      best_reason: [form.best_reason],
      inquiry_subject: form.inquiry_subject,
      inquiry_message: form.inquiry_message,
    };

    const { error } = await supabase
      .from("contact")
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error("Insert error:", error.message);
      setMessage("Failed to submit. Try again.");
      setLoading(false);
      return;
    }

    setMessage("Message sent successfully!");

    setForm({
      full_name: "",
      email: "",
      phone: "",
      best_reason: [],
      inquiry_subject: "",
      inquiry_message: "",
    });

    setLoading(false);
  };

  return (
    <>
      {/* HERO */}
      <div className="relative h-[74vh] w-full overflow-hidden flex items-center justify-center text-center">
        {images.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === current ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <Image
              src="/assets/banner/property5.jpg"
              alt={pageType}
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-black/30 lg:bg-[#f2836f]/10 transition-all duration-1000" />
          </div>
        ))}

        {/* TEXT */}
        <div className="max-w-6xl mx-auto absolute inset-0 flex flex-col justify-center items-center gap-4 text-white z-10 px-8 md:px-10 2xl:px-0">
          <h1 className="playfair text-4xl md:text-6xl font-bold">{title}</h1>
          <p className="text-xs md:text-sm text-gray-200 max-w-3xl">
            {subtitle}
          </p>
        </div>
      </div>

      {/* FORM CARD */}
      <div className="max-w-4xl mx-auto -mt-24 bg-white px-8 md:px-12 py-12 lg:shadow-xl border-2 border-gray-100 flex flex-col gap-12 rounded-4xl relative z-30">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-base lg:text-lg font-extrabold text-orange-500">
              CONNECT
            </label>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-700">
              We’re here to guide you every step of the way.
            </h2>
          </div>

          <p className="text-xs md:text-sm font-normal text-center text-gray-600 max-w-3xl">
            Whether you're searching for your next home, exploring investment
            opportunities, or seeking expert guidance in the real estate market,
            our team is ready to assist you. From residential and commercial
            properties to market insights, legal guidance, and personalized
            consultations, we ensure a seamless and transparent experience
            tailored to your goals. Reach out to us today — your next property
            move starts here.
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="flex flex-col items-end gap-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800 w-full">
            {/* Full Name */}
            <div className="flex flex-col gap-3 w-full">
              <label className="text-gray-600 font-bold text-sm">
                Full name<span className="text-orange-500">*</span>
              </label>
              <input
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                type="text"
                placeholder="Your Full name"
                className="bg-gray-100 border border-gray-200 rounded-xl px-4 py-3"
                required
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-3 w-full">
              <label className="text-gray-600 font-bold text-sm">
                Email Address<span className="text-orange-500">*</span>
              </label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                type="email"
                placeholder="Your Email Address"
                className="bg-gray-100 border border-gray-200 rounded-xl px-4 py-3"
                required
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-3 w-full">
              <label className="text-gray-600 font-bold text-sm">
                Phone Number<span className="text-orange-500">*</span>
              </label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                type="tel"
                placeholder="Your Phone Number"
                className="bg-gray-100 border border-gray-200 rounded-xl px-4 py-3"
                required
              />
            </div>

            {/* Reason */}
            <div className="flex flex-col gap-3 w-full">
              <label className="text-gray-600 font-bold text-sm">
                How can we assist you?
                <span className="text-orange-500">*</span>
              </label>
              <select
                name="best_reason"
                value={form.best_reason}
                onChange={handleChange}
                className="bg-gray-100 border border-gray-200 rounded-xl px-4 py-3"
                required
              >
                <option value="" disabled>
                  Select option
                </option>
                <option value="Buying a Property">Buying a Property</option>
                <option value="Selling a Property">Selling a Property</option>
                <option value="Rental Inquiry">Rental Inquiry</option>
                <option value="Investment Consultation">
                  Investment Consultation
                </option>
                <option value="Property Valuation">Property Valuation</option>
                <option value="General Inquiry">General Inquiry</option>
              </select>
            </div>
          </div>

          {/* Subject */}
          <div className="flex flex-col gap-3 w-full">
            <label className="text-gray-600 font-bold text-sm">
              Inquiry Subject<span className="text-orange-500">*</span>
            </label>
            <input
              name="inquiry_subject"
              value={form.inquiry_subject}
              onChange={handleChange}
              type="text"
              placeholder="Your Purpose"
              className="bg-gray-100 border border-gray-200 rounded-xl px-4 py-3"
              required
            />
          </div>

          {/* Message */}
          <div className="flex flex-col gap-3 w-full">
            <label className="text-gray-600 font-bold text-sm">
              Inquiry Message<span className="text-orange-500">*</span>
            </label>
            <textarea
              name="inquiry_message"
              value={form.inquiry_message}
              onChange={handleChange}
              placeholder="Enter your message here"
              className="bg-gray-100 border border-gray-200 rounded-xl px-4 py-3"
              required
            />
          </div>

          {/* Feedback */}
          {message && (
            <p className="text-center text-sm font-semibold text-teal-600 w-full">
              {message}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="select-none btn-orange-base btn-dynamic flex items-center gap-2"
          >
            {loading ? "Sending..." : "Send Inquiry"} <TbSend2 size={24} />
          </button>
        </form>
      </div>
    </>
  );
};

export default Hero;

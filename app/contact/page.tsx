"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { TbMail, TbMapPin, TbPhone, TbSend2 } from "react-icons/tb";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";

export const runtime = "edge";

const FALLBACK_IMAGES = ["/assets/hero/.jpg"];
interface HeroRow {
  hero_title: string;
  hero_subtitle: string;
  hero_page_type: string[];
  hero_image_urls: string[];
}
interface ContactForm {
  full_name: string;
  email: string;
  phone: string;
  best_reason: string;
  inquiry_subject: string;
  inquiry_message: string;
}

const Hero = () => {
  const [current, setCurrent] = useState(0);
  const [images, setImages] = useState<string[]>(FALLBACK_IMAGES);
  const [title, setTitle] = useState("Get in Touch");
  const [subtitle, setSubtitle] = useState(
    "We're here to assist you with any inquiries.",
  );
  const [pageType, setPageType] = useState("Contact");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState<ContactForm>({
    full_name: "",
    email: "",
    phone: "",
    best_reason: "",
    inquiry_subject: "",
    inquiry_message: "",
  });

  useEffect(() => {
    if (!supabase) return;

    const fetchHero = async () => {
      const { data, error } = await supabase
        .from("hero")
        .select("*")
        .contains("hero_page_type", ["Contact"])
        .order("created_at", { ascending: true })
        .limit(1)
        .single();

      if (error || !data) {
        console.warn("Using fallback hero content");
        return;
      }

      const hero = data as HeroRow;

      if (hero.hero_image_urls?.length) {
        setImages(hero.hero_image_urls);
      }

      if (hero.hero_title) setTitle(hero.hero_title);
      if (hero.hero_subtitle) setSubtitle(hero.hero_subtitle);
      if (hero.hero_page_type) setPageType(hero.hero_page_type[0]);
    };

    fetchHero();
  }, []);

  useEffect(() => {
    const interval = setInterval(
      () => setCurrent((prev) => (prev + 1) % images.length),
      10000,
    );
    return () => clearInterval(interval);
  }, [images.length]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
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
      best_reason: form.best_reason,
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
      best_reason: "",
      inquiry_subject: "",
      inquiry_message: "",
    });

    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-t from-[#ffffff] via-orange-600/20 to-[#ffffff]">
      {/* HERO */}
      <div className="relative h-[70vh] w-full overflow-hidden flex items-center justify-center text-center">
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
            <div className="absolute inset-0 bg-[#f2836f]/20 transition-all duration-1000" />
          </div>
        ))}

        {/* TEXT */}
        <div className="max-w-6xl mx-auto absolute inset-0 flex flex-col justify-center items-center gap-2 md:gap-4 text-white/80 z-10 px-6 md:px-10 2xl:px-0">
          <h1 className="text-[44px] md:text-6xl font-bold">{title}</h1>
          <p className="text-sm 2xl:text-base text-gray-200 max-w-3xl">
            {subtitle}
          </p>
        </div>
      </div>

      {/* FORM CARD */}
      <div className="max-w-3xl lg:max-w-5xl mx-auto -mt-25 md:mb-20 grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 bg-white p-4 md:p-6 pb-10 lg:shadow-xl border-2 border-gray-100 rounded-4xl relative z-30">
        <div className="bg-orange-600/5 border-2 border-orange-600/10 rounded-3xl p-6 md:p-8 flex flex-col gap-12">
          <div className="flex flex-col gap-2.5">
            <div className="flex flex-col gap-4">
              <p className="text-xs font-extrabold bg-orange-500/10 text-orange-500 w-fit px-4 py-2 rounded-full">
                CONNECT
              </p>
              <h2 className="text-2xl lg:text-2xl font-bold ">
                We are here to support your journey...
              </h2>
            </div>

            <p className="text-xs text-gray-500 whitespace-break-spaces max-w-2xl">
              Every listing handpicked by The D-Link Colombo Team, so you can
              invest with confidence.
            </p>
          </div>

          <div className="flex flex-col gap-8">
            <div className="flex flex-col md:flex-row items-start gap-3 md:gap-6">
              <div className="bg-white p-3 duration-700 rounded-2xl shadow-sm w-fit">
                <TbPhone
                  size={30}
                  className="text-3xl text-orange-500 transition-all"
                />
              </div>
              <label
                htmlFor=""
                className="flex flex-col gap-0.5 text-lg font-bold"
              >
                Call Us
                <Link
                  href="tel:94761676603"
                  className="text-sm md:text-base font-medium hover:underline"
                >
                  +94 76 167 6603
                </Link>
              </label>
            </div>
            <div className="flex flex-col md:flex-row items-start gap-3 md:gap-6">
              <div className="bg-white p-3 duration-700 rounded-2xl shadow-sm w-fit">
                <FaWhatsapp
                  size={30}
                  className="text-3xl text-orange-500 transition-all"
                />
              </div>
              <label
                htmlFor=""
                className="flex flex-col gap-1 text-lg font-bold"
              >
                Whatsapp Us
                <Link
                  href="https://wa.me/94761676603"
                  className="text-sm md:text-base font-medium hover:underline"
                >
                  +94 76 167 6603
                </Link>
              </label>
            </div>
            <div className="flex flex-col md:flex-row items-start gap-3 md:gap-6">
              <div className="bg-white p-3 duration-700 rounded-2xl shadow-sm w-fit">
                <TbMail
                  size={30}
                  className="text-3xl text-orange-500 transition-all"
                />
              </div>
              <label
                htmlFor="
                        "
                className="flex flex-col gap-0.5 text-lg font-bold"
              >
                Email Us
                <Link
                  href="mailto:dlink.colombo@gmail.com"
                  className="text-sm md:text-base font-medium hover:underline break-all"
                >
                  dlink.colombo@gmail.com
                </Link>
              </label>
            </div>
          </div>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-end gap-8 py-4 md:py-6 px-4 lg:px-0 lg:pr-4 rounded-3xl"
        >
          {/* Full Name */}
          <div className="flex flex-col gap-3 w-full">
            <label className="font-bold text-sm">
              Full name<span className="text-red-500">*</span>
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
            <label className="font-bold text-sm">
              Email Address<span className="text-red-500">*</span>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800 w-full">
            {/* Phone */}
            <div className="flex flex-col gap-3 w-full">
              <label className="font-bold text-sm">
                Phone Number<span className="text-red-500">*</span>
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
            <label className="font-bold text-sm">
              Inquiry Subject<span className="text-red-500">*</span>
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
            <label className="font-bold text-sm">
              Inquiry Message<span className="text-red-500">*</span>
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
            {loading ? "Sending..." : "Submit Message"} <TbSend2 size={24} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Hero;

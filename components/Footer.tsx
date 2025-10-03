"use client";

import Link from "next/link";
import {
  FaWhatsapp,
  FaRegCopyright,
  FaFacebook,
  FaInstagram,
} from "react-icons/fa";
import { TbMail } from "react-icons/tb";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Footer = () => {
  const router = useRouter();

  const handleNavClick = (path: string) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    router.push(path);
  };

  return (
    <footer className="bg-gray-200 text-gray-600 border-t border-black/10 relative">
      <div className="max-w-7xl mx-auto py-14 2xl:py-20 px-8 2xl:px-0 flex flex-col items-center gap-10">
        <div className="flex flex-col lg:flex-row gap-10 w-full pb-10 border-b border-gray-300">
          {/* Logo + Socials */}
          <div className="flex flex-col items-center text-center gap-6 w-full md:w-xs">
            <Link href="/" className="flex items-center gap-2 text-black">
              <div className="relative w-14 h-14">
                <Image
                  src="/favicon.ico"
                  alt="DC"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h1 className="text-base 2xl:text-lg font-extrabold">D-Link</h1>
                <p className="text-xs">Colombo</p>
              </div>
            </Link>

            <ul className="flex gap-3 text-xl">
              <li>
                <Link
                  href="https://wa.me/94761676603"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex border rounded-2xl border-gray-300 p-2 hover:text-orange-400 hover:bg-orange-400/10"
                >
                  <FaWhatsapp />
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.facebook.com/roy.roger02"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex border rounded-2xl border-gray-300 p-2 hover:text-orange-400 hover:bg-orange-400/10"
                >
                  <FaFacebook />
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.instagram.com/dlink_colombo/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex border rounded-2xl border-gray-300 p-2 hover:text-orange-400 hover:bg-orange-400/10"
                >
                  <FaInstagram />
                </Link>
              </li>
              <li>
                <Link
                  href="mailto:info@dlinkcolombo.com"
                  className="flex border rounded-2xl border-gray-300 p-2 hover:text-orange-400 hover:bg-orange-400/10"
                >
                  <TbMail />
                </Link>
              </li>
            </ul>
          </div>

          {/* Footer Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full text-xs 2xl:text-sm">
            {/* Support */}
            <div className="ml-0 xl:ml-10">
              <h6 className="text-sm 2xl:text-base font-semibold mb-3 text-black">
                Support
              </h6>
              <ul className="flex flex-col gap-3">
                {[
                  "Help Center",
                  "Safety Regulations",
                  "Disability Support",
                  "Help with Booking",
                ].map((item, i) => (
                  <li key={i}>
                    <Link
                      href="/NotFound"
                      className="hover:text-orange-400 hover:underline"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Explore */}
            <div className="ml-0 xl:ml-4">
              <h6 className="text-sm 2xl:text-base font-semibold mb-3 text-black">
                Explore
              </h6>
              <ul className="flex flex-col gap-3">
                {[
                  "Write a Review",
                  "Community Forum",
                  "Assisting Resources",
                  "Buyer's Preference",
                  "Blogs",
                ].map((item, i) => (
                  <li key={i}>
                    <Link
                      href="/NotFound"
                      className="hover:text-orange-400 hover:underline"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Products */}
            <div className="ml-0 xl:ml-4">
              <h6 className="text-sm 2xl:text-base font-semibold mb-3 text-black">
                Products
              </h6>
              <ul className="flex flex-col gap-3">
                <li>
                  <button
                    onClick={() => handleNavClick("/apartments")}
                    className="hover:text-orange-400 hover:underline text-left"
                  >
                    Apartments
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavClick("/houses")}
                    className="hover:text-orange-400 hover:underline text-left"
                  >
                    Homes
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavClick("/commercial_property")}
                    className="hover:text-orange-400 hover:underline text-left"
                  >
                    Commercial Property
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavClick("/lands")}
                    className="hover:text-orange-400 hover:underline text-left"
                  >
                    Lands/Plots
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavClick("/villas")}
                    className="hover:text-orange-400 hover:underline text-left"
                  >
                    Villas
                  </button>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h6 className="text-sm 2xl:text-base font-semibold mb-3 text-black">
                D-Link Colombo
              </h6>
              <ul className="flex flex-col gap-3">
                {[
                  "About Us",
                  "Resource and Policy",
                  "Careers",
                  "Trust and Safety",
                  "Contact Us",
                ].map((item, i) => (
                  <li key={i}>
                    <Link
                      href="/about"
                      className="hover:text-orange-400 hover:underline"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <p className="text-sm flex items-center text-center gap-1">
          <FaRegCopyright /> 2025 D-Link Colombo . All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

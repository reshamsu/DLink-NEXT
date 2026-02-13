"use client";

import Link from "next/link";
import {
  FaWhatsapp,
  FaRegCopyright,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
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
    <footer className="bg-gray-950 text-gray-500 border-t border-white/10">
      <div className="max-w-6xl mx-auto py-14 pb-10 px-8 2xl:px-0 flex flex-col items-center gap-10">
        <div className="flex flex-col lg:flex-row gap-10 w-full pb-10 border-b border-gray-800">
          <div className="flex flex-col items-center text-center gap-4 w-full md:w-xs">
            <Link href="/" className="flex flex-col items-center gap-2">
              <Image
                src="/favicon.ico"
                alt="TQ"
                width={64}
                height={64}
                className="object-contain"
              />
              <span className="text-white text-lg font-bold">
                D-Link Colombo
              </span>
            </Link>

            <p className="text-sm">
              Find your next property with D-Link Colombo.
            </p>

            <ul className="flex gap-2 text-lg 2xl:text-xl">
              <li>
                <Link
                  href="https://wa.me/94761676603"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex border rounded-2xl border-gray-800 p-2 hover:text-orange-400 hover:border-gray-800"
                >
                  <FaWhatsapp />
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.facebook.com/roysu-realtors"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex border rounded-2xl border-gray-800 p-2 hover:text-orange-400 hover:border-gray-800"
                >
                  <FaFacebook />
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.instagram.com/dlink.colombo/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex border rounded-2xl border-gray-800 p-2 hover:text-orange-400 hover:border-gray-800"
                >
                  <FaInstagram />
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.linkedin.com/dlink-colombo/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex border rounded-2xl border-gray-800 p-2 hover:text-orange-400 hover:border-gray-800"
                >
                  <FaLinkedin />
                </Link>
              </li>
              <li>
                <Link
                  href="mailto:info@dlinkcolombo.com"
                  className="flex border rounded-2xl border-gray-800 p-2 hover:text-orange-400 hover:border-gray-800"
                >
                  <TbMail />
                </Link>
              </li>
            </ul>
          </div>

          {/* Footer Links */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 w-full text-xs 2xl:text-sm">
            {/* Explore */}
            <div className="ml-0 xl:ml-24">
              <h6 className="text-base font-semibold mb-5 text-white">
                Service
              </h6>
              <ul className="flex flex-col gap-2.5 text-xs 2xl:text-sm">
                {[
                  "Help Center",
                  "Safety Regulations",
                  "Disability Support",
                  "Help with Viewings",
                  "Report a Problem",
                ].map((item, i) => (
                  <li key={i}>
                    <Link
                      href="/explore-uae"
                      className="hover:text-orange-400 hover:underline"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Products */}
            <div className="ml-0 xl:ml-16">
              <h6 className="text-base font-semibold mb-5 text-white">
                Find Property
              </h6>
              <ul className="flex flex-col gap-3">
                <li>
                  <button
                    onClick={() => handleNavClick("/property/apartments")}
                    className="hover:text-orange-400 hover:underline text-left"
                  >
                    Apartments
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavClick("/property/homes")}
                    className="hover:text-orange-400 hover:underline text-left"
                  >
                    Homes
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavClick("/property/commercial")}
                    className="hover:text-orange-400 hover:underline text-left"
                  >
                    Commercial Property
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavClick("/property/lands")}
                    className="hover:text-orange-400 hover:underline text-left"
                  >
                    Lands/Plots
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavClick("/property/villas")}
                    className="hover:text-orange-400 hover:underline text-left"
                  >
                    Villas
                  </button>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div className="ml-0 xl:ml-10">
              <h6 className="text-base font-semibold mb-5 text-white">
                D-Link Colombo
              </h6>
              <ul className="flex flex-col gap-2.5 text-xs 2xl:text-sm">
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

        <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4 pb-10 border-b border-gray-800">
          <div className="flex flex-col gap-2 text-center md:text-left">
            <h6 className="text-white text-base font-semibold">
              Stay in the loop
            </h6>
            <p className="text-xs text-gray-400">
              Subscribe for property deals, updates, and exclusive offers.
            </p>
          </div>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-6 py-3 rounded-3xl text-sm bg-white/10 text-white"
            />
            <button className="btn-orange-sm">Subscribe</button>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="w-full flex flex-col items-center gap-3">
          <p className="text-sm flex items-center text-center gap-2">
            <FaRegCopyright /> 2025 D-Link Colombo. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

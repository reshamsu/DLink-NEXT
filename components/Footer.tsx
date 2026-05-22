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
import { Copyright } from "lucide-react";

const Footer = () => {
  const router = useRouter();

  const handleNavClick = (path: string) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    router.push(path);
  };

  return (
    <footer className="bg-gray-950 text-gray-700 border-t border-white/10">
      <div className="max-w-6xl mx-auto py-16 px-6 sm:px-12 2xl:px-0 flex flex-col gap-6">
        <div className="flex flex-col lg:flex-row gap-12 w-full pb-10 border-b border-gray-800">
          <div className="flex flex-col items-center text-center md:items-start md:text-start gap-4 w-full md:w-sm">
            <Link
              href="/"
              className="flex flex-col items-center md:items-start gap-2"
            >
              <Image
                src="/favicon.ico"
                alt="DC"
                width={60}
                height={20}
                className="object-contain"
              />
              <div>
                <h1 className="text-lg font-extrabold uppercase text-gray-300 mb-1">
                  D-Link Estate
                </h1>
                <p className="text-[11px] text-gray-500">
                  D-Link Colombo (Pvt) Ltd.
                </p>
              </div>
            </Link>

            <ul className="flex gap-2 text-lg">
              <li>
                <Link
                  href="https://wa.me/94761676603"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex border rounded-2xl border-gray-800 p-2 hover:text-blue-500 hover:border-gray-800"
                >
                  <FaWhatsapp />
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.facebook.com/roysu-realtors"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex border rounded-2xl border-gray-800 p-2 hover:text-blue-500 hover:border-gray-800"
                >
                  <FaFacebook />
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.instagram.com/dlink.colombo/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex border rounded-2xl border-gray-800 p-2 hover:text-blue-500 hover:border-gray-800"
                >
                  <FaInstagram />
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.linkedin.com/dlink-colombo/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex border rounded-2xl border-gray-800 p-2 hover:text-blue-500 hover:border-gray-800"
                >
                  <FaLinkedin />
                </Link>
              </li>
              <li>
                <Link
                  href="mailto:info@dlinkcolombo.com"
                  className="flex border rounded-2xl border-gray-800 p-2 hover:text-blue-500 hover:border-gray-800"
                >
                  <TbMail />
                </Link>
              </li>
            </ul>
          </div>

          {/* Footer Links */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 w-full text-[12px] font-medium">
            {/* Our Services */}
            <div className="ml-0 xl:ml-12">
              <h6 className="text-sm font-semibold mb-4 text-white">
                Our Services
              </h6>
              <ul className="flex flex-col gap-2">
                {[
                  { label: "Buy a Property", href: "/contact" },
                  { label: "Sell a Property", href: "/contact" },
                  { label: "Rental Inquiry", href: "/contact" },
                  { label: "Property Valuation", href: "/contact" },
                  { label: "Investment Consulting", href: "/service" },
                ].map((item, i) => (
                  <li key={i}>
                    <Link
                      href={item.href}
                      className="hover:text-blue-500 hover:underline"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Products */}
            <div className="ml-0 xl:ml-10">
              <h6 className="text-base font-semibold mb-4 text-white">
                Find Property
              </h6>
              <ul className="flex flex-col gap-2.5 text-xs 2xl:text-sm">
                <li>
                  <button
                    onClick={() => handleNavClick("/property/apartments")}
                    className="hover:text-blue-500 hover:underline text-left"
                  >
                    Apartments
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavClick("/property/homes")}
                    className="hover:text-blue-500 hover:underline text-left"
                  >
                    Homes
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavClick("/property/commercial")}
                    className="hover:text-blue-500 hover:underline text-left"
                  >
                    Commercial Property
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavClick("/property/lands")}
                    className="hover:text-blue-500 hover:underline text-left"
                  >
                    Lands/Plots
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavClick("/property/villas")}
                    className="hover:text-blue-500 hover:underline text-left"
                  >
                    Villas
                  </button>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div className="ml-0 xl:ml-10">
              <h6 className="text-base font-semibold mb-4 text-white">
                D-Link Colombo
              </h6>
              <ul className="flex flex-col gap-2.5 text-xs 2xl:text-sm">
                {[
                  { label: "About Us", href: "/about" },
                  { label: "Our Services", href: "/service" },
                  { label: "Browse Properties", href: "/property/homes" },
                  { label: "Why Choose Us", href: "/about" },
                  { label: "Contact Us", href: "/contact" },
                ].map((item, i) => (
                  <li key={i}>
                    <Link
                      href={item.href}
                      className="hover:text-blue-500 hover:underline"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pb-6 border-b border-gray-800 w-full">
          <div className="flex flex-col gap-2 text-center md:text-left">
            <h6 className="text-white text-sm font-semibold">
              Stay in the loop
            </h6>
            <p className="text-xs text-gray-500">
              Subscribe for property deals, updates, and exclusive offers.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-6 py-3 rounded-3xl text-sm bg-white/10 text-white"
            />
            <button className="btn-orange-sm">Subscribe</button>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs font-semibold w-full">
          <div className="flex items-center gap-1.5">
            <Copyright size={12} />
            <span>2026 D-Link Colombo (Pvt) Ltd. All Rights Reserved.</span>
          </div>
          <div>
            Powered by{" "}
            <Link
              href="https://atlascreate.io"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white underline"
            >
              Atlas&apos;Create
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

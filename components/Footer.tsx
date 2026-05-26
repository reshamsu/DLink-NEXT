"use client";

import Link from "next/link";
import { Copyright } from "lucide-react";
import {
  FaWhatsapp,
  FaInstagram,
  FaLinkedin,
  FaFacebook,
  FaEnvelope,
} from "react-icons/fa";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Footer = () => {
  const router = useRouter();

  const handleNavClick = (path: string) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    router.push(path);
  };

  return (
    <footer className="bg-gray-950 text-gray-700 border-t border-white/10">
      <div className="max-w-6xl mx-auto py-16 px-6 sm:px-12 2xl:px-0 flex flex-col gap-6">
        <div className="flex flex-col lg:flex-row gap-12 w-full pb-10 border-b border-gray-900">
          <div className="flex flex-col items-center text-center md:items-start md:text-start gap-6 w-full md:w-xs">
            <Link
              href="/"
              className="flex flex-col items-center md:items-start gap-2"
            >
              <Image
                src="/favicon.ico"
                alt="X"
                width={60}
                height={20}
                className="object-contain"
              />
              <div>
                <h1 className="text-lg font-bold uppercase text-white">
                  D-Link Estate
                </h1>
                <p className="text-[11px] text-[#2563eb] font-bold">
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
                  className="flex rounded-xl bg-white/5 hover:bg-[#2563eb]/10 border border-white/10 p-2 hover:border-[#2563eb]/20 hover:scale-105 duration-500 text-white/40 hover:text-[#2563eb]"
                >
                  <FaWhatsapp size={18} />
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.facebook.com/dlink-estates"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex rounded-xl bg-white/5 hover:bg-[#2563eb]/10 border border-white/10 p-2 hover:border-[#2563eb]/20 hover:scale-105 duration-500 text-white/40 hover:text-[#2563eb]"
                >
                  <FaFacebook size={18} />
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.instagram.com/dlinkestate/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex rounded-xl bg-white/5 hover:bg-[#2563eb]/10 border border-white/10 p-2 hover:border-[#2563eb]/20 hover:scale-105 duration-500 text-white/40 hover:text-[#2563eb]"
                >
                  <FaInstagram size={18} />
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.linkedin.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex rounded-xl bg-white/5 hover:bg-[#2563eb]/10 border border-white/10 p-2 hover:border-[#2563eb]/20 hover:scale-105 duration-500 text-white/40 hover:text-[#2563eb]"
                >
                  <FaLinkedin size={18} />
                </Link>
              </li>
              <li>
                <Link
                  href="mailto:info@dlinkestate.com"
                  className="flex rounded-xl bg-white/5 hover:bg-[#2563eb]/10 border border-white/10 p-2 hover:border-[#2563eb]/20 hover:scale-105 duration-500 text-white/40 hover:text-[#2563eb]"
                >
                  <FaEnvelope size={18} />
                </Link>
              </li>
            </ul>
          </div>

          {/* Footer Links */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 w-full text-[12px] font-medium">
            {/* Explore */}
            <div className="ml-0 xl:ml-16">
              <h6 className="text-sm font-semibold mb-3 text-white">Explore</h6>
              <ul className="flex flex-col gap-2">
                {[
                  { label: "Apartments", href: "/property/apartments" },
                  { label: "Homes", href: "/property/homes" },
                  { label: "Lands", href: "/property/lands" },
                  { label: "Commercial/Buildings", href: "/property/commercial" },
                  { label: "Villas", href: "/property/villas" },
                ].map((item, i) => (
                  <li key={i}>
                    <Link
                      href={item.href}
                      className="hover:text-[#2563eb] hover:underline"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div className="ml-0 xl:ml-6">
              <h6 className="text-sm font-semibold mb-3 text-white">
                Services
              </h6>
              <ul className="flex flex-col gap-2">
                {[
                  { label: "Buy Property", href: "/service" },
                  { label: "Sell Property", href: "/service" },
                  { label: "Rent / Lease", href: "/service" },
                  { label: "Property Valuation", href: "/service" },
                  { label: "Investment Advisory", href: "/service" },
                ].map((item, i) => (
                  <li key={i}>
                    <Link
                      href={item.href}
                      className="hover:text-[#2563eb] hover:underline text-left"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h6 className="text-sm font-semibold mb-3 text-white">
                D-Link Estate
              </h6>
              <ul className="flex flex-col gap-2">
                {[
                  { label: "About Us", href: "/about" },
                  { label: "Resource and Policy", href: "/about" },
                  { label: "Careers", href: "/about" },
                  { label: "Trust and Safety", href: "/about" },
                  { label: "Contact Us", href: "/contact" },
                ].map((item, i) => (
                  <li key={i}>
                    <Link
                      href={item.href}
                      className="hover:text-[#2563eb] hover:underline"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4 pb-6 border-b border-gray-900">
          <div className="flex flex-col gap-2 text-center md:text-left">
            <h6 className="text-white text-sm font-semibold">
              Stay in the loop
            </h6>
            <p className="text-xs text-gray-500">
              Subscribe for new listings, market updates, and exclusive offers.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-6 py-2.5 rounded-3xl text-xs bg-white/10 text-white"
            />
            <button className="btn-primary-sm">Subscribe</button>
          </div>
        </div>

        {/* App Download Platform */}
        {/* <div className="flex gap-4">
            <Image
              src="/assets/utils/appstore.png"
              alt="App Store"
              width={120}
              height={40}
              className="object-contain"
            />
            <Image
              src="/assets/utils/playstore.png"
              alt="Google Play"
              width={120}
              height={40}
              className="object-contain"
            />
          </div> */}

        {/* Bottom Line */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs font-semibold w-full">
          <div className="flex items-center gap-1.5">
            <Copyright size={12} />
            <span>2026 D-Link Estate. All Rights Reserved.</span>
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
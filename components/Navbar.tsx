"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Nav_Links } from "@/constants/NavLinks";
import { TbMenu, TbX, TbChevronDown } from "react-icons/tb";

const Navbar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Close on scroll
  useEffect(() => {
    if (!isOpen) return;
    const handleScroll = () => setIsOpen(false);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isOpen]);

  return (
    <header className="fixed z-40 w-full shadow-xs">
      <nav className="max-w-7xl mx-auto flex items-center justify-between py-2.5 px-6 2xl:px-0">
        <Link href="/" className="flex items-center gap-2">
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

        {/* Desktop Nav */}
        <ul className="hidden h-full gap-1 lg:flex text-sm">
          {Nav_Links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.key}>
                <Link
                  href={link.href}
                  className={`flex items-center cursor-pointer transition-all duration-500 py-2.5 px-4
                      ${
                        isActive
                          ? "font-bold text-orange-400"
                          : "hover:font-bold text-black"
                      }`}
                >
                  {link.label}
                  {link.key === "find-property" && (
                    <TbChevronDown size={16} className="ml-1" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex text-sm">
            <Link href="/add-listing" className="select-none btn-dark-sm">
              Get Started
            </Link>
          </div>

          <button
            aria-label="Open menu"
            className="lg:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <TbX className="w-8 h-8 cursor-pointer" />
            ) : (
              <TbMenu className="w-8 h-8 cursor-pointer" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown */}
      <div
        className={`absolute top-full left-0 w-full bg-white/90 text-black overflow-hidden lg:hidden 
          transition-transform duration-300 ease-in-out origin-top 
          ${isOpen ? "scale-y-100" : "scale-y-0"}`}
      >
        <ul className="flex flex-col gap-2 p-6 text-sm">
          {Nav_Links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.key}>
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between transition-all duration-500 w-full py-3 px-6 
                    ${
                      isActive
                        ? "font-bold text-orange-400"
                        : "hover:font-bold text-black"
                    }`}
                >
                  {link.label}
                  {link.key === "find-property" && (
                    <TbChevronDown size={16} className="ml-1" />
                  )}
                </Link>
              </li>
            );
          })}
          <div className="md:hidden items-center gap-4 p-4 text-sm">
            <Link
              href="/add-listing"
              className="select-none btn-dark-sm w-full"
            >
              Get Started
            </Link>
          </div>
        </ul>
      </div>
    </header>
  );
};

export default Navbar;

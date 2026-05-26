"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Nav_Links } from "@/constants/NavLinks";
import { Menu, X, ChevronDown } from "lucide-react";

const Navbar = () => {
  const pathname = usePathname() || "";
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeHash, setActiveHash] = useState("");
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  useEffect(() => {
    setActiveHash(window.location.hash);
    const onHashChange = () => setActiveHash(window.location.hash);
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      if (isOpen) setIsOpen(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isOpen]);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const el = document.getElementById(href.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", href);
        setActiveHash(href);
      }
      setIsOpen(false);
    } else {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <header
      className={`fixed z-40 w-full text-black transition-all duration-500 ${
        scrolled ? "bg-white shadow-md backdrop-blur-xl" : "bg-white shadow-sm"
      }`}
    >
      <nav className="max-w-6xl mx-auto flex items-center justify-between py-2 px-4 md:px-8 2xl:px-0">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2"
        >
          <Image
            src="/favicon.ico"
            alt="X"
            width={50}
            height={20}
            className="object-contain"
          />
          <div>
            <h1 className="text-base md:text-lg font-extrabold uppercase text-black leading-snug">
              D-Link Estate
            </h1>
            <p className="text-[10px] md:text-[11px] text-[#2563eb] font-bold leading-none">
              D-Link Colombo (Pvt) Ltd.
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-4 lg:gap-6 text-[12px]">
          {/* Desktop Nav */}
          <ul className="hidden md:flex items-center gap-6 text-[11px] font-medium">
            {Nav_Links.map((link) => {
              if (link.submenu) {
                const isActive = link.submenu.some((sub) =>
                  pathname.startsWith(sub.href),
                );
                return (
                  <li key={link.key} className="relative group">
                    <button
                      className={`relative flex items-center gap-1 py-1.5 px-1 transition-colors duration-300
                        after:absolute after:bottom-0 after:left-0 after:h-[2px] after:rounded-full
                        after:transition-all after:duration-300 after:ease-in-out
                        ${
                          isActive
                            ? "text-black after:w-full after:bg-blue-600 font-bold"
                            : "text-black/90 hover:text-black font-semibold after:w-0 hover:after:w-full after:bg-blue-600"
                        }`}
                    >
                      {link.label}
                      <ChevronDown
                        size={12}
                        className="transition-transform duration-200 group-hover:rotate-180"
                      />
                    </button>
                    <ul className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 rounded-xl bg-white/95 backdrop-blur-xl border border-white/[0.08] p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      {link.submenu.map((sub) => (
                        <li key={sub.href}>
                          <Link
                            href={sub.href}
                            className={`block px-4 py-2.5 rounded-lg text-[11px] transition-colors duration-150 ${
                              pathname.startsWith(sub.href)
                                ? "text-black bg-black/[0.07] font-bold"
                                : "text-black hover:text-blue-600 font-semibold hover:bg-blue-600/10"
                            }`}
                          >
                            {sub.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              }

              const href = link.href!;
              const isActive = href.startsWith("#")
                ? activeHash === href
                : pathname === href ||
                  (href !== "/" && pathname.startsWith(href));

              return (
                <li key={link.key}>
                  <Link
                    href={href}
                    onClick={(e) => handleNavClick(e, href)}
                    className={`relative flex items-center py-1.5 px-1 transition-colors duration-300
                    after:absolute after:bottom-0 after:left-0 after:h-[2px] after:rounded-full
                    after:transition-all after:duration-300 after:ease-in-out
                    ${
                      isActive
                        ? "text-black after:w-full after:bg-blue-600 font-bold"
                        : "text-black/90 hover:text-black font-semibold after:w-0 hover:after:w-full after:bg-blue-600"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right side */}
          <div className="hidden md:flex w-px h-4 bg-black/30 mr-2" />

          <a
            href="tel:+94774374420"
            className="flex items-center btn-primary-sm"
          >
            Let&apos;s Talk
          </a>

          <div className="md:hidden flex items-center gap-4">
            <button
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              onClick={() => setIsOpen((v) => !v)}
              className=" w-fit h-10 flex items-center justify-center rounded-full transition-all duration-200"
            >
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 left-0 lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile menu */}
      <div
        className={`absolute top-full left-0 right-0 lg:hidden rounded-b-3xl bg-white/95 backdrop-blur-3xl border border-white/[0.08] overflow-hidden transition-all duration-300 origin-top ${
          isOpen
            ? "opacity-100 scale-y-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-y-95 -translate-y-1 pointer-events-none"
        }`}
      >
        {/* Thin gold accent */}
        <div className="h-px w-full" />

        <ul className="flex flex-col p-4">
          {Nav_Links.map((link) => {
            if (link.submenu) {
              const isActive = link.submenu.some((sub) =>
                pathname.startsWith(sub.href),
              );
              const isSubmenuOpen = openSubmenu === link.key;
              return (
                <li key={link.key}>
                  <button
                    onClick={() =>
                      setOpenSubmenu(isSubmenuOpen ? null : link.key)
                    }
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-[13.5px] transition-all duration-150 ${
                      isActive
                        ? "text-blue-600 bg-blue-600/10 font-bold"
                        : "text-black/90 hover:text-blue-600 font-semibold hover:bg-blue-600/10"
                    }`}
                  >
                    {link.label}
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${isSubmenuOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {isSubmenuOpen && (
                    <ul className="mt-1 ml-4 flex flex-col gap-0.5">
                      {link.submenu.map((sub) => (
                        <li key={sub.href}>
                          <Link
                            href={sub.href}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-[12.5px] transition-all duration-150 ${
                              pathname.startsWith(sub.href)
                                ? "text-blue-600 bg-blue-600/10 font-bold"
                                : "text-black/90 hover:text-blue-600 font-semibold hover:bg-blue-600/10"
                            }`}
                          >
                            {sub.label}
                            {pathname.startsWith(sub.href) && (
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            }

            const href = link.href!;
            const isActive = pathname.startsWith(href);
            return (
              <li key={link.key}>
                <Link
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-[13.5px] transition-all duration-150 ${
                    isActive
                      ? "text-blue-600 bg-blue-600/10 font-bold"
                      : "text-black/90 hover:text-blue-600 font-semibold hover:bg-blue-600/10"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </header>
  );
};

export default Navbar;

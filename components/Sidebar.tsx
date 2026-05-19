"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  TbMenu,
  TbX,
  TbChevronDown,
  TbLayoutDashboard,
  TbBuilding,
  TbCalendarEvent,
  TbUsers,
  TbChartBar,
  TbSettings,
  TbLogout,
} from "react-icons/tb";
import Image from "next/image";

type SubItem = { label: string; href: string };
type NavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
  submenu?: SubItem[];
};
type NavSection = { title: string; items: NavItem[] };

const nav: NavSection[] = [
  {
    title: "MAIN",
    items: [{ label: "Overview", href: "/dashboard", icon: TbLayoutDashboard }],
  },
  {
    title: "MANAGEMENT",
    items: [
      {
        label: "Listings",
        href: "/dashboard/listings",
        icon: TbBuilding,
        submenu: [
          { label: "All Listings", href: "/dashboard/listings/all" },
          { label: "Add Listing", href: "/dashboard/listings/add" },
          { label: "Edit Listing", href: "/dashboard/listings/edit" },
        ],
      },
      { label: "Bookings", href: "/dashboard/bookings", icon: TbCalendarEvent },
      { label: "Users", href: "/dashboard/users", icon: TbUsers },
    ],
  },
  {
    title: "ANALYTICS",
    items: [{ label: "Reports", href: "/dashboard/reports", icon: TbChartBar }],
  },
  {
    title: "ACCOUNT",
    items: [
      { label: "Settings", href: "/dashboard/settings", icon: TbSettings },
      { label: "Logout", href: "/logout", icon: TbLogout },
    ],
  },
];

interface SessionUser { name: string; email: string; picture: string }

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen]   = useState(false);
  const [user, setUser]   = useState<SessionUser | null>(null);

  useEffect(() => {
    setUser({
      name:    localStorage.getItem("dl_user_name")    ?? "Admin",
      email:   localStorage.getItem("dl_user_email")   ?? "",
      picture: localStorage.getItem("dl_user_picture") ?? "",
    });
  }, []);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="lg:hidden fixed top-6 left-6 z-50 bg-white text-blue-600 p-3 rounded-xl shadow-md"
        onClick={() => setOpen(true)}
      >
        <TbMenu size={22} />
      </button>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-dvh w-72 bg-gray-900 text-white z-50 flex flex-col
          transform transition-transform duration-300 lg:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/favicon.ico"
              alt="DC"
              width={40}
              height={20}
              className="object-contain"
            />
            <div>
              <h1 className="text-sm 2xl:text-base font-extrabold uppercase">
                D-Link Estate
              </h1>
              <p className="text-[11px] text-gray-500">
                D-Link Colombo (Pvt) Ltd.
              </p>
            </div>
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="lg:hidden text-gray-500 hover:text-white transition p-1"
          >
            <TbX size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-6 space-y-5">
          {nav.map((section) => (
            <div key={section.title}>
              <p className="text-[9px] font-bold text-gray-600 px-3 mb-1.5 tracking-widest uppercase">
                {section.title}
              </p>
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  const subActive = item.submenu?.some((s) => isActive(s.href));

                  return (
                    <li key={item.href}>
                      {item.submenu ? (
                        <details className="group" open={!!subActive}>
                          <summary
                            className={`flex items-center justify-between cursor-pointer px-3 py-2.5 rounded-xl text-sm transition select-none ${
                              active || subActive
                                ? "bg-blue-600 text-white"
                                : "text-gray-400 hover:bg-white/5 hover:text-white"
                            }`}
                          >
                            <span className="flex items-center gap-3">
                              <Icon size={17} />
                              <span className="font-semibold text-xs">
                                {item.label}
                              </span>
                            </span>
                            <TbChevronDown
                              size={14}
                              className="opacity-60 group-open:rotate-180 transition-transform"
                            />
                          </summary>

                          <ul className="mt-0.5 pl-8 space-y-0.5">
                            {item.submenu.map((sub) => (
                              <li key={sub.href}>
                                <Link
                                  href={sub.href}
                                  onClick={() => setOpen(false)}
                                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] transition ${
                                    isActive(sub.href)
                                      ? "text-blue-400 font-bold"
                                      : "text-gray-500 hover:text-white"
                                  }`}
                                >
                                  <span className="w-1 h-1 rounded-full bg-current opacity-60" />
                                  {sub.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </details>
                      ) : (
                        <Link
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                            active
                              ? "bg-blue-600 text-white"
                              : "text-gray-400 hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          <Icon size={17} />
                          {item.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* User profile footer */}
        <div className="px-3 py-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/5">
            {user?.picture ? (
              <Image
                src={user.picture}
                alt={user.name}
                width={32}
                height={32}
                className="w-8 h-8 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-extrabold shrink-0">
                {user?.name?.[0]?.toUpperCase() ?? "A"}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">{user?.name ?? "Admin"}</p>
              <p className="text-[10px] text-gray-500 truncate">{user?.email ?? ""}</p>
            </div>
            <Link
              href="/logout"
              className="text-gray-600 hover:text-red-400 transition shrink-0"
              title="Sign out"
            >
              <TbLogout size={15} />
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}

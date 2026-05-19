export const Side_Links = [
  { key: "overview",  label: "Overview",  href: "/dashboard" },

  {
    key: "listings",
    label: "Listings",
    href: "/dashboard/listings",
    submenu: [
      { label: "All Listings", href: "/dashboard/listings/all" },
      { label: "Add Listing",  href: "/dashboard/listings/add" },
      { label: "Edit Listing", href: "/dashboard/listings/edit" },
    ],
  },

  { key: "bookings", label: "Bookings", href: "/dashboard/bookings" },
  { key: "users",    label: "Users",    href: "/dashboard/users" },
  { key: "reports",  label: "Reports",  href: "/dashboard/reports" },
  { key: "settings", label: "Settings", href: "/dashboard/settings" },
  { key: "logout",   label: "Logout",   href: "/logout" },
];

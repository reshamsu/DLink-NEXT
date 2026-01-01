export const Side_Links = [
  { key: "overview", label: "Overview", href: "/dashboard" },

  {
    key: "listings",
    label: "Listings",
    href: "/dashboard/listings",
    submenu: [
      { label: "All Listings", href: "/dashboard/listings/all" },
      { label: "Add Listings", href: "/dashboard/listings/add" },
    ],
  },

  {
    key: "bookings",
    label: "Bookings",
    href: "/dashboard/bookings",
  },

  {
    key: "users",
    label: "Users",
    href: "/dashboard/users",
  },

  {
    key: "logout",
    label: "Logout",
    href: "/logout",
  },
];

export const Nav_Links = [
  { href: "/", key: "home", label: "Home" },
  {
    key: "property",
    label: "Find Property",
    submenu: [
      { href: "/property/apartments", label: "Apartments" },
      { href: "/property/homes", label: "Homes" },
      { href: "/property/lands", label: "Lands" },
      { href: "/property/villas", label: "Villas" },
    ],
  },
  // { href: "/apartments", key: "apartments", label: "Apartments" },
  // { href: "/homes", key: "homes", label: "Homes" },
  { href: "/service", key: "services", label: "Services" },
  { href: "/about", key: "about", label: "About" },
  { href: "/contact", key: "contact", label: "Contact" },
];

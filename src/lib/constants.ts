export const SITE = {
  name: "Total Solutions",
  tagline: "Let's print the brilliant life.",
  description:
    "Total Solutions is a one-stop printing & branding company offering offset printing, digital/flex/vinyl printing, packaging, promotional items, and finishing — all in-house since 2016.",
  email: "totalsolutionsnoida@gmail.com",
  phones: ["+91-9958628702", "+91-9773629446"],
  landline: "", // placeholder
  whatsapp: "+919958628702",
  established: 2016,
  proprietor: "Meenakshi Kashyap",
  addresses: {
    registered: {
      label: "Registered Address",
      line1: "A-175, GD Colony, Mayur Vihar",
      line2: "Phase-III, Delhi – 110096",
    },
    office: {
      label: "Office Address",
      line1: "C-398, Sector 10",
      line2: "Noida – 201301, UP",
    },
  },
  social: {
    facebook: "",
    instagram: "",
    linkedin: "",
    twitter: "",
  },
};

// Admin password should be managed via Supabase Auth, not hardcoded
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";

export const COLORS = {
  primary: "#1FA352",
  accent: "#FF6B1A",
  base: "#FFFFFF",
};

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Services", href: "/services" },
  { label: "Gallery", href: "/gallery" },
  { label: "About", href: "/about" },
  { label: "Reviews", href: "/reviews" },
  { label: "Contact", href: "/contact" },
];

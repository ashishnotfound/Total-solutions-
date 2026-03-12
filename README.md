# Total Solutions — Printing & Branding Website

> **"Let's print the brilliant life."**

A modern, premium website with an admin dashboard for Total Solutions — a full-service printing and branding company based in Noida, Delhi NCR.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
http://localhost:3000
```

## 📂 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Homepage
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Global styles & design tokens
│   ├── services/page.tsx     # Services page
│   ├── products/
│   │   ├── page.tsx          # Products landing (3 categories)
│   │   ├── [slug]/page.tsx   # Product detail page
│   │   └── category/[slug]/page.tsx  # Category products grid
│   ├── about/page.tsx        # About Us page
│   ├── gallery/page.tsx      # Gallery with masonry grid & lightbox
│   ├── reviews/page.tsx      # Customer reviews with submission
│   ├── contact/page.tsx      # Contact / Get a Quote form
│   └── admin/
│       ├── layout.tsx        # Admin layout with auth
│       ├── page.tsx          # Dashboard
│       ├── products/page.tsx # Products CRUD
│       ├── categories/page.tsx # Categories management
│       ├── reviews/page.tsx  # Reviews moderation
│       ├── gallery/page.tsx  # Gallery management
│       ├── quotes/page.tsx   # Quote requests
│       └── settings/page.tsx # Site settings
├── components/
│   ├── Navbar.tsx            # Responsive navbar
│   ├── Footer.tsx            # Full footer
│   └── ProductCard.tsx       # Reusable product card
├── data/
│   ├── products.json         # All products (46 items)
│   ├── categories.json       # 3 product categories
│   ├── reviews.json          # Sample approved reviews
│   ├── gallery.json          # Gallery entries
│   └── quotes.json           # Quote requests
└── lib/
    ├── constants.ts          # Site config, company info
    └── data.ts               # Data access layer
```

## 🎨 Design System

| Token        | Value    |
| ------------ | -------- |
| Primary      | `#1FA352` (Green)  |
| Accent       | `#FF6B1A` (Orange) |
| Base         | `#FFFFFF` (White)  |
| Font         | Inter    |
| Border Radius| 8–24px   |

## 🔐 Admin Panel

Access the admin panel at `/admin`.

- **Default password:** `admin123` (change in `src/lib/constants.ts`)
- Session-based auth (stored in `sessionStorage`)

### Admin Modules

| Module      | Description                              |
| ----------- | ---------------------------------------- |
| Dashboard   | Stats overview + quick actions           |
| Products    | Search, filter, add/edit/delete products |
| Categories  | Manage 3 product categories              |
| Reviews     | Moderate reviews (approve/reject)        |
| Gallery     | Upload and manage gallery media          |
| Quotes      | Track quote status (New → Closed)        |
| Settings    | Logo, contact info, colors               |

## 📧 Email Submissions

All Contact and Quote submissions are configured to email:
**totalsolutionsnoida@gmail.com**

Currently uses `mailto:` links. Add a backend email API (SendGrid, Resend, etc.) for production.

## 🔮 Future Backend Integration

The codebase is prepared for Supabase integration:
- All data currently loaded from local JSON files
- Data access functions in `src/lib/data.ts` can be swapped to Supabase queries
- Look for `// TODO: Connect to Supabase` comments throughout the code

## 🛠 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS + Custom CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Font:** Inter (Google Fonts)
- **Language:** TypeScript

## 📱 Responsive

Fully responsive across desktop, tablet, and mobile devices.

---

**Proprietor:** Meenakshi Kashyap  
**Established:** 2016  
**Office:** C-398, Sector 10, Noida – 201301, UP  
**Registered:** A-175, GD Colony, Mayur Vihar Phase-III, Delhi – 110096

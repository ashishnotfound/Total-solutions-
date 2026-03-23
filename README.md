# Total Solutions — Printing & Branding Website

> **"Let's print the brilliant life."**

A modern, premium marketing site with a full-featured admin dashboard for **Total Solutions** — a full-service printing & branding company based in Noida, Delhi NCR.

---

## 🚀 Quick Start (Local Development)

### 1) Install dependencies

```bash
npm install
```

### 2) Run the dev server

```bash
npm run dev
```

Open your browser at `http://localhost:3000`.

### 3) Build & Preview

```bash
npm run build
npm run start
```

---

## ✅ What’s Included

### 🌐 Public Site
- Landing page with hero, services, and featured products
- Full product catalog with category filtering
- Gallery with masonry grid + lightbox
- Customer review listing + submission form
- Contact & Quote request forms

### 🛠 Admin Dashboard
- Secure admin login (session-based)
- Products CRUD (create, read, update, delete)
- Category management
- Review moderation (approve/reject)
- Gallery upload + management
- Quote request tracking (New → Closed)
- Site settings (logo, contact info, colors)

### 🧩 Data Layer (Pluggable)
- Currently backed by local JSON files under `src/data/`
- Data access via `src/lib/data.ts` (designed to swap in Supabase, Firebase, or any API)

---

## 🗂 Project Structure

```
src/
├── app/                     # Next.js App Router pages + routes
│   ├── admin/               # Admin dashboard pages
│   ├── api/                 # API route stubs (Supabase-ready)
│   ├── products/            # Products catalog & details
│   ├── gallery/             # Gallery pages + components
│   ├── reviews/             # Reviews listing + form
│   ├── contact/             # Contact / quote form
│   ├── auth/                # Login page
│   └── layout.tsx           # Root layout & metadata
├── components/              # Shared UI components
├── context/                 # React contexts (settings, auth)
├── data/                    # Seed data (JSON for local mode)
├── lib/                     # Helpers + data access layer
│   ├── constants.ts         # Site config + defaults
│   └── data.ts              # Data loader (JSON / Supabase)
└── public/                  # Static assets (images, icons)
```

---

## 🔐 Admin Panel (Local Access)

### Default credentials
- **Username:** `admin`
- **Password:** `admin123` (change in `src/lib/constants.ts`)

### Access
Navigate to: `http://localhost:3000/admin`

> 🔧 The admin session is stored in `sessionStorage`. For production, swap this for a proper auth provider (Supabase Auth, NextAuth, etc.).

---

## 🔄 Data & Backend Integration

This project is designed to be easily wired up to a real backend:

### Local JSON (default)
- Data files live in `src/data/` (products, categories, reviews, gallery, quotes)
- The app reads these via `src/lib/data.ts`

### Supabase (planned)
- `src/lib/supabase/*` contains sample Supabase client helpers
- Search for `// TODO: Connect to Supabase` to find integration points

### Email Submission
Current implementation uses `mailto:` links for contact/quote messages.
For production, replace with an API (SendGrid, Resend, SMTP) or serverless function.

---

## 🧰 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + custom CSS
- **Animation:** Framer Motion
- **Icons:** Lucide React

---

## ✅ Deployment

This project is ready for Vercel, Netlify, or any Next.js-compatible host.

### Deploy to Vercel (recommended)
1. Connect repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: (default)

---

## 🎯 Customization

### Update company info
Edit `src/lib/constants.ts` to update:
- company name
- contact details
- brand colors

### Replace seed data
Update JSON files in `src/data/` or hook in a real CMS / database.

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch
3. Open a pull request

---

## 📄 License

This repository has no license specified (add one if you intend to open source it).

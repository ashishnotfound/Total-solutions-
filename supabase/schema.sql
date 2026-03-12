-- ============================================
-- TOTAL SOLUTIONS — Supabase Database Schema
-- ============================================
-- Run this SQL in your Supabase SQL Editor:
--   https://app.supabase.com → Project → SQL Editor
-- ============================================

-- =====================
-- 1. PROFILES TABLE (for Auth)
-- =====================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- 2. CATEGORIES TABLE
-- =====================
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  image TEXT,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- 3. PRODUCTS TABLE
-- =====================
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  short_description TEXT,
  description TEXT,
  specifications JSONB DEFAULT '[]',
  materials TEXT[] DEFAULT '{}',
  image TEXT,
  gallery TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT FALSE,
  price NUMERIC(10,2) DEFAULT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- 4. REVIEWS TABLE
-- =====================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  company TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  text TEXT NOT NULL,
  photo TEXT,
  video TEXT,
  audio TEXT,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- 5. GALLERY TABLE
-- =====================
CREATE TABLE IF NOT EXISTS gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  type TEXT CHECK (type IN ('image', 'video')) DEFAULT 'image',
  src TEXT NOT NULL,
  thumbnail TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- 6. QUOTES TABLE
-- =====================
CREATE TABLE IF NOT EXISTS quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  company TEXT,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  product TEXT,
  quantity TEXT,
  artwork_url TEXT,
  delivery_address TEXT,
  timeline TEXT,
  message TEXT,
  status TEXT CHECK (status IN ('new', 'contacted', 'quoted', 'closed')) DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- 7. ORDERS TABLE
-- =====================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT REFERENCES products(id),
  product_name TEXT NOT NULL,
  quantity TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  timeline TEXT NOT NULL,
  specifications TEXT,
  additional_notes TEXT,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  user_phone TEXT NOT NULL,
  status TEXT CHECK (status IN ('pending', 'contacted', 'confirmed', 'rejected')) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- 8. QUERIES TABLE
-- =====================
CREATE TABLE IF NOT EXISTS queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT REFERENCES products(id),
  product_name TEXT,
  message TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  user_phone TEXT NOT NULL,
  status TEXT CHECK (status IN ('pending', 'contacted', 'resolved', 'rejected')) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- 9. SETTINGS TABLE
-- =====================
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- INDEXES
-- =====================
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);
CREATE INDEX IF NOT EXISTS idx_gallery_category ON gallery(category);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_queries_status ON queries(status);

-- =====================
-- AUTH TRIGGER: Sync Users to Profiles
-- =====================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    CASE 
      WHEN NEW.email = 'totalsolutionsnoida@gmail.com' THEN 'admin' 
      ELSE 'user' 
    END
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-create trigger safely
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================
-- ROW LEVEL SECURITY (RLS)
-- =====================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ policies
DROP POLICY IF EXISTS "Public read categories" ON categories;
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read products" ON products;
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read approved reviews" ON reviews;
CREATE POLICY "Public read approved reviews" ON reviews FOR SELECT USING (status = 'approved');

DROP POLICY IF EXISTS "Public read gallery" ON gallery;
CREATE POLICY "Public read gallery" ON gallery FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read settings" ON settings;
CREATE POLICY "Public read settings" ON settings FOR SELECT USING (true);

-- PUBLIC INSERT policies
DROP POLICY IF EXISTS "Public insert reviews" ON reviews;
CREATE POLICY "Public insert reviews" ON reviews FOR INSERT WITH CHECK (status = 'pending');

DROP POLICY IF EXISTS "Public insert quotes" ON quotes;
CREATE POLICY "Public insert quotes" ON quotes FOR INSERT WITH CHECK (status = 'new');

DROP POLICY IF EXISTS "Public insert orders" ON orders;
CREATE POLICY "Public insert orders" ON orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public insert queries" ON queries;
CREATE POLICY "Public insert queries" ON queries FOR INSERT WITH CHECK (true);

-- ADMIN policies (Simplified)
DROP POLICY IF EXISTS "Admin full access profiles" ON profiles;
CREATE POLICY "Admin full access profiles" ON profiles FOR ALL USING (auth.jwt() ->> 'email' = 'totalsolutionsnoida@gmail.com');

DROP POLICY IF EXISTS "Admin full access categories" ON categories;
CREATE POLICY "Admin full access categories" ON categories FOR ALL USING (auth.jwt() ->> 'email' = 'totalsolutionsnoida@gmail.com');

DROP POLICY IF EXISTS "Admin full access products" ON products;
CREATE POLICY "Admin full access products" ON products FOR ALL USING (auth.jwt() ->> 'email' = 'totalsolutionsnoida@gmail.com');

DROP POLICY IF EXISTS "Admin full access reviews" ON reviews;
CREATE POLICY "Admin full access reviews" ON reviews FOR ALL USING (auth.jwt() ->> 'email' = 'totalsolutionsnoida@gmail.com');

DROP POLICY IF EXISTS "Admin full access gallery" ON gallery;
CREATE POLICY "Admin full access gallery" ON gallery FOR ALL USING (auth.jwt() ->> 'email' = 'totalsolutionsnoida@gmail.com');

DROP POLICY IF EXISTS "Admin full access quotes" ON quotes;
CREATE POLICY "Admin full access quotes" ON quotes FOR ALL USING (auth.jwt() ->> 'email' = 'totalsolutionsnoida@gmail.com');

DROP POLICY IF EXISTS "Admin full access orders" ON orders;
CREATE POLICY "Admin full access orders" ON orders FOR ALL USING (auth.jwt() ->> 'email' = 'totalsolutionsnoida@gmail.com');

DROP POLICY IF EXISTS "Admin full access queries" ON queries;
CREATE POLICY "Admin full access queries" ON queries FOR ALL USING (auth.jwt() ->> 'email' = 'totalsolutionsnoida@gmail.com');

DROP POLICY IF EXISTS "Admin full access settings" ON settings;
CREATE POLICY "Admin full access settings" ON settings FOR ALL USING (auth.jwt() ->> 'email' = 'totalsolutionsnoida@gmail.com');

-- =====================
-- UPDATED_AT TRIGGERS
-- =====================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Products
DROP TRIGGER IF EXISTS trg_products_updated_at ON products;
CREATE TRIGGER trg_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Reviews
DROP TRIGGER IF EXISTS trg_reviews_updated_at ON reviews;
CREATE TRIGGER trg_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Quotes
DROP TRIGGER IF EXISTS trg_quotes_updated_at ON quotes;
CREATE TRIGGER trg_quotes_updated_at BEFORE UPDATE ON quotes FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Orders
DROP TRIGGER IF EXISTS trg_orders_updated_at ON orders;
CREATE TRIGGER trg_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Queries
DROP TRIGGER IF EXISTS trg_queries_updated_at ON queries;
CREATE TRIGGER trg_queries_updated_at BEFORE UPDATE ON queries FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Settings
DROP TRIGGER IF EXISTS trg_settings_updated_at ON settings;
CREATE TRIGGER trg_settings_updated_at BEFORE UPDATE ON settings FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Profiles
DROP TRIGGER IF EXISTS trg_profiles_updated_at ON profiles;
CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =====================
-- SEED DATA
-- =====================
INSERT INTO categories (id, slug, name, description, sort_order) VALUES
  ('flex-vinyl-digital', 'flex-vinyl-digital', 'Flex / Vinyl / Digital', 'Large-format prints and banners.', 1),
  ('printing-items', 'printing-items', 'Printing Items', 'Offset and digital corporate printing.', 2),
  ('promotional-items', 'promotional-items', 'Promotional Items', 'Custom branded merchandise.', 3)
ON CONFLICT (id) DO NOTHING;

INSERT INTO settings (key, value) VALUES
  ('company_name', '"Total Solutions"'),
  ('tagline', '"Let''s print the brilliant life."'),
  ('email', '"totalsolutionsnoida@gmail.com"'),
  ('primary_color', '"#1FA352"'),
  ('accent_color', '"#FF6B1A"')
ON CONFLICT (key) DO NOTHING;

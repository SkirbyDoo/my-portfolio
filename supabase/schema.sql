-- ============================================================
-- CLIENT WEBSITE TEMPLATE — Supabase Schema
-- Run this entire file in the Supabase SQL Editor once.
-- ============================================================

-- Site content table (stores all editable content as JSON)
CREATE TABLE IF NOT EXISTS site_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section TEXT NOT NULL UNIQUE,
  content JSONB NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Content history for undo functionality
CREATE TABLE IF NOT EXISTS content_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section TEXT NOT NULL,
  content JSONB NOT NULL,
  saved_at TIMESTAMP DEFAULT NOW()
);

-- Site settings (colors, fonts, SEO, etc.)
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public can read all content
CREATE POLICY "Public read site_content"
  ON site_content FOR SELECT USING (true);

CREATE POLICY "Public read site_settings"
  ON site_settings FOR SELECT USING (true);

-- Only authenticated admin can write to main content
CREATE POLICY "Admin write site_content"
  ON site_content FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin write content_history"
  ON content_history FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin write site_settings"
  ON site_settings FOR ALL USING (auth.role() = 'authenticated');

-- Anonymous clients can write to the review_* namespace only
-- (the app password-gates access; this just lets saves through)
CREATE POLICY "Anon insert review content"
  ON site_content FOR INSERT
  WITH CHECK (section LIKE 'review_%');

CREATE POLICY "Anon update review content"
  ON site_content FOR UPDATE
  USING (section LIKE 'review_%')
  WITH CHECK (section LIKE 'review_%');

CREATE POLICY "Anon insert review history"
  ON content_history FOR INSERT
  WITH CHECK (section LIKE 'review_%');

-- ============================================================
-- Default Content Seed Data
-- ============================================================

INSERT INTO site_content (section, content) VALUES

('navigation', '{
  "logo": "YourBrand",
  "links": [
    {"label": "About", "href": "#about"},
    {"label": "Services", "href": "#services"},
    {"label": "Team", "href": "#team"},
    {"label": "Testimonials", "href": "#testimonials"},
    {"label": "Contact", "href": "#contact"}
  ],
  "ctaLabel": "Get In Touch",
  "ctaHref": "#contact"
}'),

('hero', '{
  "headline": "We Help Businesses Grow Online",
  "subheadline": "Professional websites and digital solutions built to convert visitors into customers.",
  "ctaLabel": "Get Started Today",
  "ctaHref": "#contact",
  "secondaryLabel": "See Our Work",
  "secondaryHref": "#services",
  "backgroundImage": "",
  "visible": true
}'),

('about', '{
  "badge": "About Us",
  "headline": "Built on Trust, Driven by Results",
  "body": "We are a team of passionate professionals dedicated to delivering exceptional results for our clients. With years of experience across multiple industries, we bring expertise and creativity to every project.",
  "image": "",
  "stats": [
    {"value": "150+", "label": "Happy Clients"},
    {"value": "12", "label": "Years Experience"},
    {"value": "98%", "label": "Satisfaction Rate"}
  ],
  "visible": true
}'),

('services', '{
  "badge": "What We Do",
  "headline": "Services Designed to Grow Your Business",
  "subheadline": "From strategy to execution, we provide everything you need to succeed online.",
  "items": [
    {
      "id": "1",
      "icon": "Zap",
      "title": "Fast Delivery",
      "description": "We work efficiently to get your project live quickly without sacrificing quality."
    },
    {
      "id": "2",
      "icon": "Shield",
      "title": "Secure & Reliable",
      "description": "Your website is built on rock-solid infrastructure with security baked in from day one."
    },
    {
      "id": "3",
      "icon": "TrendingUp",
      "title": "Built to Convert",
      "description": "Every design decision is made with your conversion goals in mind — more leads, more sales."
    },
    {
      "id": "4",
      "icon": "Headphones",
      "title": "Ongoing Support",
      "description": "We don''t disappear after launch. You have access to support whenever you need it."
    },
    {
      "id": "5",
      "icon": "Smartphone",
      "title": "Mobile First",
      "description": "Your site looks stunning and performs perfectly on every device, every screen size."
    },
    {
      "id": "6",
      "icon": "BarChart",
      "title": "Data Driven",
      "description": "We use real analytics and user data to make decisions that improve your results."
    }
  ],
  "visible": true
}'),

('team', '{
  "badge": "Meet the Team",
  "headline": "The People Behind Your Success",
  "subheadline": "A dedicated team of experts committed to delivering exceptional results.",
  "members": [
    {
      "id": "1",
      "name": "Alex Johnson",
      "title": "Founder & CEO",
      "bio": "10+ years building digital products for businesses of all sizes.",
      "image": ""
    },
    {
      "id": "2",
      "name": "Sarah Chen",
      "title": "Lead Designer",
      "bio": "Award-winning designer with a passion for clean, conversion-focused UI.",
      "image": ""
    },
    {
      "id": "3",
      "name": "Marcus Williams",
      "title": "Head of Development",
      "bio": "Full-stack engineer specializing in fast, scalable web applications.",
      "image": ""
    }
  ],
  "visible": true
}'),

('testimonials', '{
  "badge": "Client Love",
  "headline": "Don''t Just Take Our Word For It",
  "items": [
    {
      "id": "1",
      "quote": "Working with this team transformed our online presence. Our leads tripled within 60 days of launch.",
      "name": "Jennifer Park",
      "company": "Park & Associates",
      "image": ""
    },
    {
      "id": "2",
      "quote": "The admin panel is so easy to use. I update our site myself every week — no tech skills needed!",
      "name": "David Torres",
      "company": "Torres Realty Group",
      "image": ""
    },
    {
      "id": "3",
      "quote": "Professional, fast, and the results speak for themselves. Best investment we made this year.",
      "name": "Michelle Lee",
      "company": "Bloom Wellness Studio",
      "image": ""
    }
  ],
  "visible": true
}'),

('contact', '{
  "badge": "Get In Touch",
  "headline": "Ready to Start Your Project?",
  "subheadline": "Fill out the form below and we''ll get back to you within one business day.",
  "phone": "+1 (555) 000-0000",
  "email": "hello@yourbrand.com",
  "address": "123 Main Street, Suite 100\nYour City, ST 00000",
  "visible": true
}'),

('footer', '{
  "logo": "YourBrand",
  "tagline": "Building the web, one client at a time.",
  "socialLinks": [
    {"platform": "Twitter", "href": "#"},
    {"platform": "LinkedIn", "href": "#"},
    {"platform": "Instagram", "href": "#"}
  ],
  "columns": [
    {
      "heading": "Company",
      "links": [
        {"label": "About", "href": "#about"},
        {"label": "Services", "href": "#services"},
        {"label": "Team", "href": "#team"}
      ]
    },
    {
      "heading": "Connect",
      "links": [
        {"label": "Contact Us", "href": "#contact"},
        {"label": "LinkedIn", "href": "#"},
        {"label": "Twitter", "href": "#"}
      ]
    }
  ],
  "copyright": "© 2025 YourBrand. All rights reserved."
}'),

('site_structure', '{
  "homeOrder": ["hero", "about", "services", "team", "testimonials", "contact"],
  "sitePageSections": []
}')

ON CONFLICT (section) DO NOTHING;

-- Default site settings
INSERT INTO site_settings (key, value) VALUES
  ('site_name', 'YourBrand'),
  ('favicon', ''),
  ('primary_color', '#1a1a1a'),
  ('secondary_color', '#ffffff'),
  ('accent_color', '#0066ff'),
  ('bg_color', '#ffffff'),
  ('text_color', '#1a1a1a'),
  ('text_muted_color', '#666666'),
  ('font_heading', 'Playfair Display'),
  ('font_body', 'Inter'),
  ('border_radius', '8px'),
  ('seo_title', 'YourBrand — Professional Web Solutions'),
  ('seo_description', 'We build professional websites that grow your business.'),
  ('google_analytics_id', ''),
  ('custom_domain', '')
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- Storage bucket (run separately in Supabase dashboard OR via CLI)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('site-images', 'site-images', true);
-- ============================================================

# Your Website — Owner's Guide

Welcome! This guide explains everything you need to know to manage your website yourself. No technical knowledge required. If something isn't covered here, see the support links at the bottom.

---

## Table of Contents

1. [Logging Into the Admin Panel](#1-logging-into-the-admin-panel)
2. [Editing Your Website Content](#2-editing-your-website-content)
3. [Adding and Removing Team Members](#3-adding-and-removing-team-members)
4. [Adding and Removing Services](#4-adding-and-removing-services)
5. [Adding and Removing Testimonials](#5-adding-and-removing-testimonials)
6. [Changing Images](#6-changing-images)
7. [Undoing a Change](#7-undoing-a-change)
8. [Hiding or Showing Sections](#8-hiding-or-showing-sections)
9. [Changing Colors and Fonts](#9-changing-colors-and-fonts)
10. [Resetting Your Admin Password](#10-resetting-your-admin-password)
11. [Getting Help with Hosting](#11-getting-help-with-hosting)
12. [What NOT to Touch](#12-what-not-to-touch)
13. [Glossary](#13-glossary)

---

## 1. Logging Into the Admin Panel

1. Go to your website address and add `/admin` to the end.
   - Example: `www.yourdomain.com/admin`
2. Enter the email address and password you were given.
3. Click **Sign In**.

You will stay logged in until you manually sign out. If you're ever logged out automatically, just sign in again with the same email and password.

**Forgot your password?** See [Section 10](#10-resetting-your-admin-password).

---

## 2. Editing Your Website Content

Once logged in, you'll see the **Admin Panel** with a list of sections on the left side:

- **Hero Banner** — the big top section with your main message
- **About** — your company story and stats
- **Services** — the cards showing what you offer
- **Team** — your team members
- **Testimonials** — client quotes
- **Contact** — your phone, email, and address
- **Navigation** — the menu at the top of every page
- **Site Settings** — colors, fonts, and SEO

To edit a section:
1. Click on the section name in the left sidebar.
2. Make your changes in the text fields on the right.
3. Click the **Save Changes** button.
4. A green message will confirm your changes were saved.

**Your changes go live immediately** — visitors will see them the next time they load the page.

---

## 3. Adding and Removing Team Members

1. In the Admin Panel, click **Team** in the left sidebar.
2. You'll see a list of your current team members.

**To add a new member:**
- Click the **+ Add Member** button.
- Fill in their name, job title, and a short bio.
- Upload their photo (see [Section 6](#6-changing-images) for photo tips).
- Click **Save Changes**.

**To remove a member:**
- Click the trash icon (🗑) next to their name.
- Click **Save Changes**.

---

## 4. Adding and Removing Services

1. In the Admin Panel, click **Services** in the left sidebar.
2. You'll see your current service cards.

**To add a service:**
- Click **+ Add Service**.
- Choose an icon from the dropdown list.
- Enter a title and description.
- Click **Save Changes**.

**To remove a service:**
- Click the trash icon next to the service.
- Click **Save Changes**.

---

## 5. Adding and Removing Testimonials

1. In the Admin Panel, click **Testimonials** in the left sidebar.

**To add a testimonial:**
- Click **+ Add Testimonial**.
- Type in the quote exactly as the client said it.
- Enter the client's name and company.
- Optionally upload their photo.
- Click **Save Changes**.

**To remove a testimonial:**
- Click the trash icon next to it.
- Click **Save Changes**.

---

## 6. Changing Images

To change any image on your website:

1. Go to the section that contains the image (e.g., **Hero Banner** for the background image).
2. Find the image upload area — it shows either the current image or an upload button.
3. Click the image or the upload button.
4. Select a photo from your computer.
5. The image will upload automatically.
6. Click **Save Changes**.

**Image tips:**
- **Hero background:** Use a wide, landscape photo — at least 1920 × 1080 pixels.
- **Team photos:** Square photos work best — at least 400 × 400 pixels.
- **File size:** Keep images under 5MB for fast loading.
- **Format:** JPG or PNG work fine. Avoid HEIC (iPhone format) — convert first if needed.

To **remove** an image, click the X button in the top-right corner of the image preview, then Save.

---

## 7. Undoing a Change

Made a mistake? No problem — every section has an **Undo Last Save** button.

1. Go to the section where you made the change.
2. Click **Undo Last Save** (next to the Save button).
3. Your previous version will be restored immediately.

**Note:** Undo only goes back one save at a time. If you save twice, undo will restore the version before your most recent save.

---

## 8. Hiding or Showing Sections

Each section has a **"Show on website"** toggle at the top right of its editor.

- **Checked (on)** = the section is visible to visitors.
- **Unchecked (off)** = the section is hidden from visitors (but not deleted).

This is useful if you're updating a section and want to hide it temporarily, or if you simply don't need a section (e.g., you don't have a team yet).

After toggling, click **Save Changes**.

---

## 9. Changing Colors and Fonts

1. In the Admin Panel, click **Site Settings** in the left sidebar.
2. Under **Colors**, you can click the colored squares to pick a new color, or type a hex code directly (e.g., `#FF5733`).
3. Under **Fonts**, choose from the dropdown menus.
4. Click **Save Settings**.
5. Reload your website to see the new colors and fonts applied.

---

## 10. Resetting Your Admin Password

1. Go to `www.yourdomain.com/admin`.
2. On the login page, contact your website administrator — password resets must be done from the Supabase dashboard (your backend account).

**If you manage your own Supabase account:**
1. Log in at [supabase.com](https://supabase.com).
2. Go to your project → **Authentication** → **Users**.
3. Find your email address and click the menu → **Send password reset email**.
4. Check your email and follow the link.

---

## 11. Getting Help with Hosting

**For website hosting issues (site is down, custom domain problems):**
- Netlify Help Center: https://docs.netlify.com
- Netlify Support: https://www.netlify.com/support/

**For database/login issues (can't access admin, content not saving):**
- Supabase Documentation: https://supabase.com/docs
- Supabase Support: https://supabase.com/support

**For general website questions:** Contact your web designer.

---

## 12. What NOT to Touch

Please do **not** change the following — doing so could break your website:

- **Environment variables** in Netlify (the `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` values).
- **The database directly** — always use the Admin Panel to edit content, not the Supabase dashboard's table editor.
- **Row Level Security policies** in Supabase — these keep your site secure.
- **The GitHub repository code** — unless your developer has specifically instructed you to.

If you're unsure about something, it's always safe to ask before making changes.

---

## 13. Glossary

**Netlify** — The service that hosts your website and makes it available on the internet. Think of it as the landlord for your website's address.

**Supabase** — The service that stores all of your website's content (text, images, settings). Think of it as a filing cabinet that lives on the internet.

**Admin Panel** — The password-protected area at `/admin` where you manage your website content.

**CMS (Content Management System)** — A fancy term for the admin panel — software that lets you update website content without writing code.

**Domain** — Your website address (e.g., `www.yourbrand.com`).

**Hosting** — The service that keeps your website running and accessible to visitors 24/7.

**Environment Variables** — Secret configuration values that connect your website to Supabase. They are set in Netlify and should never be shared publicly.

**Hex Code** — A 6-character code that represents a color (e.g., `#FF5733` is orange). You can find hex codes for any color at [coolors.co](https://coolors.co).

**Favicon** — The small icon that appears in the browser tab next to your page title.

---

*This website was built with React, Tailwind CSS, Supabase, and Netlify. For technical questions, contact your web developer.*

// Shared slug helper — turns a business name into a URL-safe slug.
// Used by the Redesigns index, detail page, and dashboard editor so they all
// agree on the same /redesigns/<slug> URLs.
export function slugify(str) {
  return String(str || '')
    .toLowerCase()
    .trim()
    .replace(/['’]/g, '')        // drop apostrophes
    .replace(/[^a-z0-9]+/g, '-') // non-alphanumerics → hyphen
    .replace(/^-+|-+$/g, '')     // trim leading/trailing hyphens
}

// The effective slug for a redesign item: an explicit slug wins, else derive
// it from the name. Keeps lookups stable even if a slug was never set.
export function redesignSlug(item) {
  return (item?.slug && slugify(item.slug)) || slugify(item?.name)
}

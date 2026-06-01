// ⚠️  CORE DASHBOARD FILE — do not edit in client project folders.
// Any changes made here WILL BE OVERWRITTEN the next time update-dashboard.js runs.
// To make dashboard improvements:
//   1. Edit this file in: client-website-template/
//   2. Run: node update-dashboard.js /path/to/client-project
// ─────────────────────────────────────────────────────────────────────────────
import { createContext, useContext } from 'react'

// Provides a namespace prefix for all useContent calls.
// Default '' = admin/live content.
// 'review'   = client review copy (stored under review_* keys).
export const ContentNamespaceContext = createContext('')

export function useContentNamespace() {
  return useContext(ContentNamespaceContext)
}

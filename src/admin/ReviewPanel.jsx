// ⚠️  CORE DASHBOARD FILE — do not edit in client project folders.
// Any changes made here WILL BE OVERWRITTEN the next time update-dashboard.js runs.
// To make dashboard improvements:
//   1. Edit this file in: client-website-template/
//   2. Run: node update-dashboard.js /path/to/client-project
// ─────────────────────────────────────────────────────────────────────────────
import { ContentNamespaceContext } from '../contexts/ContentNamespaceContext'
import AdminPanel from './AdminPanel'

// Wraps AdminPanel in the "review" content namespace so every editor reads
// and writes to review_* storage keys, completely separate from the admin copy.
export default function ReviewPanel({ onExit }) {
  return (
    <ContentNamespaceContext.Provider value="review_draft">
      <AdminPanel reviewMode onExit={onExit} />
    </ContentNamespaceContext.Provider>
  )
}

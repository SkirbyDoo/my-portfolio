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

import { createContext, useContext } from 'react'

// Provides a namespace prefix for all useContent calls.
// Default '' = admin/live content.
// 'review'   = client review copy (stored under review_* keys).
export const ContentNamespaceContext = createContext('')

export function useContentNamespace() {
  return useContext(ContentNamespaceContext)
}

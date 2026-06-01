// ⚠️  CORE DASHBOARD FILE — do not edit in client project folders.
// Any changes made here WILL BE OVERWRITTEN the next time update-dashboard.js runs.
// To make dashboard improvements:
//   1. Edit this file in: client-website-template/
//   2. Run: node update-dashboard.js /path/to/client-project
// ─────────────────────────────────────────────────────────────────────────────
import { useContent } from '../hooks/useContent'
import { PAGE_VIEWS } from '../client/clientConfig'
import Navbar from '../components/ui/Navbar'
import Footer from '../components/sections/Footer'

export default function Home() {
  // { global: true } bypasses the 'published' namespace so Home always reads the
  // same 'site_structure' key that AdminPanel writes to — no published_ indirection.
  const { content: structure } = useContent('site_structure', { global: true })
  // Fall back to the full list if DB record doesn't exist yet
  const homeOrder = structure?.homeOrder ?? Object.keys(PAGE_VIEWS)

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        {homeOrder.map(id => {
          const Component = PAGE_VIEWS[id]
          return Component ? <Component key={id} /> : null
        })}
      </main>
      <Footer />
    </div>
  )
}

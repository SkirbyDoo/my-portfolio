import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import ErrorBoundary, { reloadOnce } from './components/ErrorBoundary.jsx'
import './index.css'

// When a dynamically-imported chunk fails to load (e.g. a tab open across a
// deploy requests an asset whose hash has changed), Vite fires this event.
// Reload once to pull the current version instead of showing a blank screen.
window.addEventListener('vite:preloadError', () => { reloadOnce() })

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: { fontFamily: 'Inter, sans-serif', fontSize: '14px' },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>,
)

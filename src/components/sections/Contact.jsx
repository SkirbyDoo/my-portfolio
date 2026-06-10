import { useState } from 'react'
import { BlockRenderer } from '../BlockRenderer'
import { useContent } from '../../hooks/useContent'
import { Mail, MapPin, Send } from 'lucide-react'
import toast from 'react-hot-toast'

// Web3Forms access key — get a free one at https://web3forms.com (enter your
// email → copy the key). Submissions are emailed to that address. Safe to
// expose publicly: the key only routes mail to your registered email.
const WEB3FORMS_ACCESS_KEY = '6e697d4f-4668-4910-9ec7-a2e43ae3eff3'

export default function Contact() {
  const { content } = useContent('contact')
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [hp, setHp] = useState('') // honeypot — bots fill this, humans don't
  const [sending, setSending] = useState(false)

  if (!content || content.visible === false) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (hp) return // bot caught by honeypot — silently drop
    if (!WEB3FORMS_ACCESS_KEY || WEB3FORMS_ACCESS_KEY === 'YOUR_WEB3FORMS_KEY') {
      toast.error(content.email ? `Form isn't set up yet — please email ${content.email}` : 'Form not set up yet.')
      return
    }
    setSending(true)
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `New inquiry from ${form.name} — issavibecoding.com`,
          from_name: 'issavibecoding.com',
          name: form.name,
          email: form.email,
          message: form.message,
        }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success("Message sent! I'll be in touch soon.")
        setForm({ name: '', email: '', message: '' })
      } else {
        toast.error(content.email ? `Couldn't send — please email ${content.email}` : "Couldn't send. Please try again.")
      }
    } catch {
      toast.error(content.email ? `Couldn't send — please email ${content.email}` : "Couldn't send. Please try again.")
    } finally {
      setSending(false)
    }
  }

  return (
    <section id="contact" className="py-20 lg:py-32 bg-[var(--color-primary)] text-white">
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* Left — info */}
          <div>
            {content.badge && (
              <span className="inline-block text-sm font-semibold text-[var(--color-accent)] uppercase tracking-widest mb-4">
                {content.badge}
              </span>
            )}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tighter mb-4 leading-[1.05]">{content.headline}</h2>
            {content.subheadline && (
              <p className="text-white/70 text-lg mb-8">{content.subheadline}</p>
            )}

            <div className="space-y-4 mb-10">
              {content.email && (
                <a
                  href={`mailto:${content.email}`}
                  className="flex items-center gap-4 text-white/80 hover:text-white transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <Mail size={18} />
                  </div>
                  <span>{content.email}</span>
                </a>
              )}
              {content.address && (
                <div className="flex items-start gap-4 text-white/80">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin size={18} />
                  </div>
                  <span className="whitespace-pre-line">{content.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right — contact form */}
          <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur rounded-2xl p-8 space-y-5">
            {/* Honeypot — hidden from humans; bots fill it and get dropped */}
            <input
              type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true"
              value={hp} onChange={e => setHp(e.target.value)}
              className="hidden" style={{ display: 'none' }}
            />
            <div>
              <label className="block text-sm font-medium mb-1.5 text-white/80">Your Name</label>
              <input
                type="text" required
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[var(--color-accent)] transition-colors"
                placeholder="Jane Smith"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-white/80">Email Address</label>
              <input
                type="email" required
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[var(--color-accent)] transition-colors"
                placeholder="jane@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-white/80">Message</label>
              <textarea
                required rows={4}
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[var(--color-accent)] transition-colors resize-none"
                placeholder="Tell me about your project, timeline, or anything else…"
              />
            </div>
            <button
              type="submit"
              disabled={sending}
              className="w-full flex items-center justify-center gap-2 bg-[var(--color-accent)] hover:opacity-90 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-opacity"
            >
              <Send size={15} />
              {sending ? 'Sending…' : 'Send Message'}
            </button>
          </form>

        </div>
      </div>

        {/* Additional content blocks from dashboard */}
        {content.blocks?.length > 0 && (
          <div className="mt-8">
            <BlockRenderer blocks={content.blocks} />
          </div>
        )}
    </section>
  )
}

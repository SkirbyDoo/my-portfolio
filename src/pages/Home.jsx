import Navbar from '../components/ui/Navbar'
import Hero from '../components/sections/Hero'
import Services from '../components/sections/Services'
import Pricing from '../components/sections/Pricing'
import Portfolio from '../components/sections/Portfolio'
import About from '../components/sections/About'
import Testimonials from '../components/sections/Testimonials'
import Contact from '../components/sections/Contact'
import Footer from '../components/sections/Footer'

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Pricing />
        <Portfolio />
        <About />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

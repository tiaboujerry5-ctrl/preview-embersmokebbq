
import { useRef, useState, useEffect } from 'react'
import { cn } from './lib/utils'
import { motion, AnimatePresence, useInView, useScroll, useTransform } from 'framer-motion'
import * as Accordion from '@radix-ui/react-accordion'
import * as Tooltip from '@radix-ui/react-tooltip'
import {
  ArrowRight, Phone, Mail, MapPin, ChevronDown, Menu, X, Star,
  Flame, Smartphone, ShoppingBag, Clock, Shield, ChevronLeft, ChevronRight
} from 'lucide-react'
import { cva } from 'class-variance-authority'

// ─── Utility ─────────────────────────────────────────────────────────────────

function FadeUp({ children, delay = 0, className }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ─── Button ───────────────────────────────────────────────────────────────────

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-full font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
  {
    variants: {
      variant: {
        primary: 'bg-[#f97316] text-[#fafaf9] hover:bg-[#b91c1c]',
        ghost: 'border border-[#fafaf9] text-[#fafaf9] hover:bg-[#fafaf9]/10',
        dark: 'bg-[#1c1917] text-[#fafaf9] hover:bg-[#b91c1c]',
        outline: 'border border-[#f97316] text-[#f97316] hover:bg-[#f97316] hover:text-[#fafaf9]',
      },
      size: {
        sm: 'h-9 px-4 text-sm',
        default: 'h-11 px-6 text-base',
        lg: 'h-13 px-8 text-lg',
      },
    },
    defaultVariants: { variant: 'primary', size: 'default' },
  }
)

function Button({ className, variant, size, children, onClick, href, ...props }) {
  const cls = cn(buttonVariants({ variant, size }), className)
  if (href) {
    return (
      <motion.a
        href={href}
        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        className={cls}
        {...props}
      >
        {children}
      </motion.a>
    )
  }
  return (
    <motion.button
      whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={cls}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.button>
  )
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000)
    return () => clearTimeout(t)
  }, [onClose])
  return (
    <motion.div
      className={cn(
        'fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl px-5 py-4 shadow-2xl',
        type === 'success' ? 'bg-[#1c1917] text-[#fafaf9]' : 'bg-[#b91c1c] text-[#fafaf9]'
      )}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
    >
      <span className="text-sm font-semibold">{message}</span>
      <button onClick={onClose} className="ml-1 opacity-70 hover:opacity-100 min-w-[44px] min-h-[44px] flex items-center justify-center">
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  )
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Menu', href: '#menu' },
  { label: 'Order Online', href: '#order' },
  { label: 'Contact', href: '#contact' },
]

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <>
      <motion.nav
        className={cn(
          'fixed top-0 z-50 w-full transition-all duration-300',
          scrolled
            ? 'border-b border-[#fafaf9]/10 bg-[#1c1917]/90 backdrop-blur-xl'
            : 'bg-[#1c1917]'
        )}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f97316]">
              <Flame className="h-5 w-5 text-[#fafaf9]" />
            </div>
            <span className="text-[#fafaf9] font-bold text-lg tracking-tight leading-tight">
              Ember <span className="text-[#f97316]">&amp;</span> Smoke
            </span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="text-[#fafaf9]/80 hover:text-[#f97316] text-sm font-medium transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Button variant="primary" size="sm" href="#order">
              Order Now
            </Button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-[#fafaf9] min-w-[44px] min-h-[44px] flex items-center justify-center"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-[#1c1917]/95 backdrop-blur-xl"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.nav
              className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            >
              <button
                className="absolute top-5 right-5 text-[#fafaf9] min-w-[44px] min-h-[44px] flex items-center justify-center"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="text-3xl font-bold text-[#fafaf9] hover:text-[#f97316] transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.08 }}
              >
                <Button variant="primary" size="lg" href="#order" onClick={() => setMenuOpen(false)}>
                  Order Now
                </Button>
              </motion.div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 600], [0, -120])

  return (
    <section id="home" className="relative min-h-[100dvh] flex items-center overflow-hidden bg-[#1c1917]">
      {/* Parallax background */}
      <motion.div style={{ y }} className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=1200&q=80"
          alt="Smoky BBQ grill"
          className="h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1c1917]/60 via-[#1c1917]/40 to-[#1c1917]" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-8 pt-32 pb-24">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#f97316]/40 bg-[#f97316]/10 px-4 py-1.5 text-sm font-medium text-[#f97316]"
          >
            <Flame className="h-4 w-4" />
            Slow-smoked. Never rushed.
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-7xl font-black text-[#fafaf9] leading-[1.05] tracking-tight mb-6"
          >
            Smoky BBQ,{' '}
            <span className="text-[#f97316]">Bold Flavors,</span>
            <br />Ready for You
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-lg md:text-xl text-[#fafaf9]/70 mb-10 max-w-xl leading-relaxed"
          >
            Authentic pit-smoked barbecue, crafted daily with care. Order ahead online or roll up for fresh-off-the-grill pickup — your call.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button variant="primary" size="lg" href="#order">
              Order Now <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="ghost" size="lg" href="#menu">
              View Menu
            </Button>
          </motion.div>

          {/* Trust strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-12 flex flex-wrap items-center gap-6"
          >
            {[
              { icon: <Shield className="h-4 w-4 text-[#f97316]" />, text: 'Secured by Square' },
              { icon: <Clock className="h-4 w-4 text-[#f97316]" />, text: 'Ready in 20 min' },
              { icon: <Star className="h-4 w-4 text-[#f97316]" />, text: '4.9 ★ on Google' },
            ].map((t, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-[#fafaf9]/60">
                {t.icon}
                <span>{t.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#fafaf9] to-transparent z-10" />
    </section>
  )
}

// ─── Services ────────────────────────────────────────────────────────────────

const services = [
  {
    icon: <Flame className="h-7 w-7 text-[#f97316]" />,
    title: 'Pit-Smoked BBQ',
    description: 'Low and slow is our philosophy. Every cut of meat is smoked for hours over real wood — bold, tender, unforgettable.',
  },
  {
    icon: <Smartphone className="h-7 w-7 text-[#f97316]" />,
    title: 'Online Ordering',
    description: 'Skip the wait. Place your order in seconds via our secure Square checkout — pay your way, pick up on your schedule.',
  },
  {
    icon: <ShoppingBag className="h-7 w-7 text-[#f97316]" />,
    title: 'Quick Takeout',
    description: 'Hot, packaged, and waiting. We have your order ready when you arrive — no guessing, no delays, just great BBQ.',
  },
]

function ServiceCard({ icon, title, description, delay }) {
  return (
    <FadeUp delay={delay}>
      <motion.div
        whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.10)' }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="rounded-2xl border border-[#e7e5e4] bg-[#fafaf9] p-8 h-full"
      >
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f97316]/10">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-[#1c1917] mb-3">{title}</h3>
        <p className="text-[#1c1917]/60 leading-relaxed">{description}</p>
      </motion.div>
    </FadeUp>
  )
}

function Services() {
  return (
    <section id="services" className="bg-[#fafaf9] py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <FadeUp>
          <div className="text-center mb-14">
            <span className="text-sm font-semibold uppercase tracking-widest text-[#f97316]">Why Ember &amp; Smoke</span>
            <h2 className="mt-3 text-4xl md:text-5xl font-black text-[#1c1917] leading-tight">
              BBQ The Way It's Meant to Be
            </h2>
          </div>
        </FadeUp>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <ServiceCard key={i} {...s} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Menu ─────────────────────────────────────────────────────────────────────

const menuItems = [
  {
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80',
    name: 'Smoked Brisket Platter',
    description: 'Texas-style beef brisket smoked 14 hours, served with house pickles, onions & two sides.',
    price: '$22.95',
  },
  {
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=800&q=80',
    name: 'St. Louis Ribs Rack',
    description: 'Fall-off-the-bone pork ribs glazed with our signature ember sauce — full or half rack.',
    price: '$28.95',
  },
  {
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80',
    name: 'Pulled Pork Sandwich',
    description: 'Slow-smoked pulled pork piled high on a brioche bun, topped with tangy slaw.',
    price: '$14.95',
  },
  {
    image: 'https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?w=800&q=80',
    name: 'Smoked Chicken Thighs',
    description: 'Juicy bone-in chicken thighs, rubbed with our secret 12-spice blend and pit-smoked to perfection.',
    price: '$16.95',
  },
  {
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
    name: 'BBQ Combo Box',
    description: 'A bit of everything — brisket, ribs, pulled pork, with cornbread and two sides. Perfect for sharing.',
    price: '$39.95',
  },
  {
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
    name: 'Smoked Mac & Cheese',
    description: 'Creamy three-cheese macaroni finished in the smoker — the ultimate BBQ side dish.',
    price: '$8.95',
  },
]

function MenuItemCard({ image, name, description, price, delay }) {
  return (
    <FadeUp delay={delay}>
      <motion.div
        whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.10)' }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="rounded-2xl border border-[#e7e5e4] bg-[#fafaf9] overflow-hidden flex flex-col h-full"
      >
        <div className="h-52 overflow-hidden">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
        <div className="p-6 flex flex-col flex-1">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="text-lg font-bold text-[#1c1917] leading-snug">{name}</h3>
            <span className="shrink-0 rounded-full bg-[#f97316]/10 px-3 py-1 text-sm font-bold text-[#f97316]">{price}</span>
          </div>
          <p className="text-[#1c1917]/60 text-sm leading-relaxed flex-1">{description}</p>
          <div className="mt-5">
            <Button variant="outline" size="sm" href="#order" className="w-full">
              Add to Order
            </Button>
          </div>
        </div>
      </motion.div>
    </FadeUp>
  )
}

function MenuSection() {
  return (
    <section id="menu" className="bg-[#1c1917] py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <FadeUp>
          <div className="text-center mb-14">
            <span className="text-sm font-semibold uppercase tracking-widest text-[#f97316]">Fresh Daily</span>
            <h2 className="mt-3 text-4xl md:text-5xl font-black text-[#fafaf9] leading-tight">Our Menu</h2>
            <p className="mt-4 text-[#fafaf9]/50 max-w-xl mx-auto leading-relaxed">
              Everything is made from scratch — smoked in-house, seasoned with care, and served the way BBQ deserves.
            </p>
          </div>
        </FadeUp>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item, i) => (
            <MenuItemCard key={i} {...item} delay={i * 0.08} />
          ))}
        </div>
        <FadeUp delay={0.3}>
          <div className="mt-12 text-center">
            <Button variant="primary" size="lg" href="#order">
              Order the Full Menu <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

// ─── Order Online ─────────────────────────────────────────────────────────────

const paymentMethods = [
  { name: 'Apple Pay', label: 'AP' },
  { name: 'Google Pay', label: 'GP' },
  { name: 'Visa', label: 'VI' },
  { name: 'Mastercard', label: 'MC' },
  { name: 'Amex', label: 'AX' },
  { name: 'Discover', label: 'DC' },
  { name: 'JCB', label: 'JCB' },
  { name: 'Interac', label: 'IN' },
]

function OrderOnline() {
  return (
    <section id="order" className="bg-[#fafaf9] py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <FadeUp>
            <div>
              <span className="text-sm font-semibold uppercase tracking-widest text-[#f97316]">No Line Needed</span>
              <h2 className="mt-3 text-4xl md:text-5xl font-black text-[#1c1917] leading-tight mb-6">
                Order in a Few Clicks
              </h2>
              <p className="text-[#1c1917]/60 text-lg leading-relaxed mb-8">
                Browse the full menu, customize your order, and pay securely — all in under 2 minutes. Your BBQ will be hot and waiting when you arrive.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  'Choose your meats, sides & extras',
                  'Checkout securely via Square',
                  'Get an SMS when it\'s ready',
                  'Roll in and pick it up — done',
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f97316] text-[#fafaf9] text-sm font-bold">
                      {i + 1}
                    </div>
                    <span className="text-[#1c1917] font-medium">{step}</span>
                  </div>
                ))}
              </div>

              <Button variant="primary" size="lg" href="https://squareup.com" target="_blank" rel="noopener noreferrer">
                Start Your Order <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </FadeUp>

          <FadeUp delay={0.15}>
            <div className="rounded-3xl border border-[#e7e5e4] bg-white p-10 shadow-xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f97316]">
                  <Flame className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="font-bold text-[#1c1917]">Ember &amp; Smoke BBQ</div>
                  <div className="text-sm text-[#1c1917]/50">Secure Online Ordering</div>
                </div>
              </div>

              <div className="rounded-2xl bg-[#fafaf9] border border-[#e7e5e4] p-6 mb-6 text-center">
                <ShoppingBag className="h-10 w-10 text-[#f97316] mx-auto mb-3" />
                <p className="font-semibold text-[#1c1917] mb-1">Ready to Order?</p>
                <p className="text-sm text-[#1c1917]/50 mb-5">Tap below to open our live menu and checkout securely.</p>
                <Button variant="primary" className="w-full" href="https://squareup.com" target="_blank" rel="noopener noreferrer">
                  Open Full Menu
                </Button>
              </div>

              {/* Payment icons */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="h-4 w-4 text-[#f97316]" />
                  <span className="text-xs font-semibold text-[#1c1917]/60 uppercase tracking-widest">Secured by Square</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {paymentMethods.map(pm => (
                    <Tooltip.Provider key={pm.name}>
                      <Tooltip.Root>
                        <Tooltip.Trigger asChild>
                          <div className="flex h-9 min-w-[48px] items-center justify-center rounded-lg border border-[#e7e5e4] bg-[#fafaf9] px-2 text-xs font-bold text-[#1c1917]/70 cursor-default select-none">
                            {pm.label}
                          </div>
                        </Tooltip.Trigger>
                        <Tooltip.Content className="rounded-lg bg-[#1c1917] px-3 py-1.5 text-xs text-[#fafaf9] shadow-md">
                          {pm.name}
                          <Tooltip.Arrow className="fill-[#1c1917]" />
                        </Tooltip.Content>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  ))}
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  )
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

const testimonials = [
  {
    avatar: 'https://mdceqvjsrzkvnrigaili.supabase.co/storage/v1/object/public/site-assets/EmberSmokeBBQ/227165408561883024.cc/1',
    name: 'Marc-André T.',
    quote: 'Hands down the best brisket I\'ve ever had outside of Texas. The smoke ring is perfect, the crust is incredible. This place is a hidden gem.',
    stars: 5,
  },
  {
    avatar: 'https://mdceqvjsrzkvnrigaili.supabase.co/storage/v1/object/public/site-assets/EmberSmokeBBQ/8420327462743809811.cc/1',
    name: 'Sophie L.',
    quote: 'Ordered online for the first time and it was seamless. My pulled pork sandwich was hot and ready exactly when they said. Will order every week.',
    stars: 5,
  },
  {
    avatar: 'https://mdceqvjsrzkvnrigaili.supabase.co/storage/v1/object/public/site-assets/EmberSmokeBBQ/7236466096178962668.cc/1',
    name: 'Daniel R.',
    quote: 'The ribs are fall-off-the-bone perfect. The sides are homemade and generous. Online ordering makes it so easy to skip the line. Absolute 10/10.',
    stars: 5,
  },
]

function TestimonialCard({ avatar, name, quote, stars }) {
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 16px 32px rgba(0,0,0,0.08)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="rounded-2xl border border-[#e7e5e4] bg-[#fafaf9] p-8 flex flex-col gap-4 h-full"
    >
      <div className="flex gap-1">
        {Array.from({ length: stars }).map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-[#f97316] text-[#f97316]" />
        ))}
      </div>
      <p className="text-[#1c1917]/70 leading-relaxed italic flex-1">"{quote}"</p>
      <div className="flex items-center gap-3 pt-2 border-t border-[#e7e5e4]">
        <img src={avatar} alt={name} className="h-10 w-10 rounded-full object-cover" />
        <div>
          <div className="font-semibold text-[#1c1917] text-sm">{name}</div>
          <div className="text-xs text-[#1c1917]/40">Verified Guest</div>
        </div>
      </div>
    </motion.div>
  )
}

function Testimonials() {
  const [current, setCurrent] = useState(0)
  const total = testimonials.length

  const prev = () => setCurrent(c => (c - 1 + total) % total)
  const next = () => setCurrent(c => (c + 1) % total)

  return (
    <section id="testimonials" className="bg-[#1c1917] py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <FadeUp>
          <div className="text-center mb-14">
            <span className="text-sm font-semibold uppercase tracking-widest text-[#f97316]">Guest Reviews</span>
            <h2 className="mt-3 text-4xl md:text-5xl font-black text-[#fafaf9] leading-tight">
              What Our Guests Are Saying
            </h2>
          </div>
        </FadeUp>

        {/* Desktop: 3 columns */}
        <div className="hidden md:grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <FadeUp key={i} delay={i * 0.1}>
              <TestimonialCard {...t} />
            </FadeUp>
          ))}
        </div>

        {/* Mobile: carousel */}
        <div className="md:hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35 }}
            >
              <TestimonialCard {...testimonials[current]} />
            </motion.div>
          </AnimatePresence>
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={prev}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#fafaf9]/20 text-[#fafaf9] hover:bg-[#fafaf9]/10 transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={cn('h-2 rounded-full transition-all', i === current ? 'w-6 bg-[#f97316]' : 'w-2 bg-[#fafaf9]/30')}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#fafaf9]/20 text-[#fafaf9] hover:bg-[#fafaf9]/10 transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── CTA Banner ───────────────────────────────────────────────────────────────

function CTABanner() {
  return (
    <section className="bg-[#b91c1c] py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-8 text-center">
        <FadeUp>
          <div className="flex justify-center mb-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#fafaf9]/10">
              <Flame className="h-8 w-8 text-[#fafaf9]" />
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-[#fafaf9] mb-4 leading-tight">
            Ready for Real BBQ?
          </h2>
          <p className="text-[#fafaf9]/70 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Order online or stop by — we're fired up and ready. Life is too short for bad barbecue.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="lg" href="#order" className="bg-[#f97316] hover:bg-[#1c1917]">
              Order Now <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="ghost" size="lg" href="#contact">
              Find Us
            </Button>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

// ─── Contact ──────────────────────────────────────────────────────────────────

const hours = [
  { day: 'Monday – Tuesday', time: 'Closed' },
  { day: 'Wednesday – Thursday', time: '11:00 AM – 8:00 PM' },
  { day: 'Friday – Saturday', time: '11:00 AM – 9:00 PM' },
  { day: 'Sunday', time: '11:00 AM – 7:00 PM' },
]

function Contact() {
  return (
    <section id="contact" className="bg-[#fafaf9] py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <FadeUp>
          <div className="text-center mb-14">
            <span className="text-sm font-semibold uppercase tracking-widest text-[#f97316]">Come Visit</span>
            <h2 className="mt-3 text-4xl md:text-5xl font-black text-[#1c1917] leading-tight">Find Us</h2>
          </div>
        </FadeUp>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <FadeUp>
            <div className="space-y-8">
              {/* Restaurant name */}
              <div>
                <h3 className="text-2xl font-black text-[#1c1917] mb-1">Ember &amp; Smoke BBQ</h3>
                <p className="text-[#1c1917]/50 text-sm">Authentic Pit-Smoked Barbecue</p>
              </div>

              {/* Info cards */}
              <div className="space-y-4">
                {[
                  { icon: <MapPin className="h-5 w-5 text-[#f97316]" />, label: 'Address', value: '347 Rue des Érables, Sherbrooke, QC J1H 2P4' },
                  { icon: <Phone className="h-5 w-5 text-[#f97316]" />, label: 'Phone', value: '(819) 555-0174' },
                  { icon: <Mail className="h-5 w-5 text-[#f97316]" />, label: 'Email', value: 'hello@emberandsmoke.ca' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 rounded-2xl border border-[#e7e5e4] bg-white p-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f97316]/10">
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-widest text-[#1c1917]/40 mb-0.5">{item.label}</div>
                      <div className="font-semibold text-[#1c1917]">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Hours */}
              <div className="rounded-2xl border border-[#e7e5e4] bg-white p-6">
                <div className="flex items-center gap-2 mb-5">
                  <Clock className="h-5 w-5 text-[#f97316]" />
                  <span className="font-bold text-[#1c1917]">Hours of Operation</span>
                </div>
                <div className="space-y-3">
                  {hours.map((h, i) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                      <span className="text-[#1c1917]/60">{h.day}</span>
                      <span className={cn('font-semibold', h.time === 'Closed' ? 'text-[#b91c1c]' : 'text-[#1c1917]')}>
                        {h.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeUp>

          {/* Map */}
          <FadeUp delay={0.15}>
            <div className="rounded-3xl overflow-hidden border border-[#e7e5e4] shadow-lg h-[480px]">
              <iframe
                title="Ember & Smoke BBQ Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d44831.46219437376!2d-71.93988868369!3d45.40390999999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4cb7b690d52fe677%3A0x76e2f1c1a7b4f57!2sSherbrooke%2C%20QC!5e0!3m2!1sen!2sca!4v1680000000000"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="bg-[#1c1917] border-t border-[#fafaf9]/10">
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f97316]">
                <Flame className="h-5 w-5 text-[#fafaf9]" />
              </div>
              <span className="text-[#fafaf9] font-bold text-lg">Ember <span className="text-[#f97316]">&amp;</span> Smoke</span>
            </div>
            <p className="text-[#fafaf9]/40 text-sm leading-relaxed max-w-xs">
              Slow-smoked, bold-flavored barbecue made with passion and served with pride in Sherbrooke, QC.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-[#fafaf9]/40 mb-5">Navigation</div>
            <div className="space-y-3">
              {navLinks.map(link => (
                <a key={link.href} href={link.href} className="block text-sm text-[#fafaf9]/60 hover:text-[#f97316] transition-colors">
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Payments */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-[#fafaf9]/40 mb-5">We Accept</div>
            <div className="flex flex-wrap gap-2">
              {paymentMethods.map(pm => (
                <div key={pm.name} className="flex h-8 min-w-[44px] items-center justify-center rounded-lg border border-[#fafaf9]/10 bg-[#fafaf9]/5 px-2 text-xs font-bold text-[#fafaf9]/50">
                  {pm.label}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-4">
              <Shield className="h-4 w-4 text-[#f97316]" />
              <span className="text-xs text-[#fafaf9]/40">Secured by Square</span>
            </div>
          </div>
        </div>

        <div className="border-t border-[#fafaf9]/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#fafaf9]/30">© {new Date().getFullYear()} Ember &amp; Smoke BBQ. All rights reserved.</p>
          <div className="flex items-center gap-2 text-sm text-[#fafaf9]/30">
            <Flame className="h-4 w-4 text-[#f97316]" />
            <span>Fired up in Sherbrooke, QC</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [toast, setToast] = useState(null)

  return (
    <div className="min-h-[100dvh] bg-[#fafaf9] text-[#1c1917] antialiased">
      <Navbar />
      <Hero />
      <Services />
      <MenuSection />
      <OrderOnline />
      <Testimonials />
      <CTABanner />
      <Contact />
      <Footer />

      <AnimatePresence>
        {toast && (
          <Toast
            key="toast"
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

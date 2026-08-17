import { Link } from 'react-router-dom'
import {
  ShoppingBag,
  Sparkles,
  MessageCircle,
  Instagram,
  Music2,
  Radio,
  Images,
  CalendarHeart,
  MapPin,
  Facebook,
  ArrowUpRight,
} from 'lucide-react'
import { getBioLinks, type BioLink, type LinkIcon } from '@/data/links'
import { SeoHead } from '@/components/SeoHead'
import { CreatorCredit } from '@/components/CreatorCredit'
import { ThemeToggle } from '@/components/ThemeToggle'

/**
 * Bio-link page for social profiles, Instagram above all.
 *
 * Replaces a third-party Linktree: same job, but on our own domain, with our
 * branding, no external tracking on our audience, and the event card driven by
 * the same config the rest of the site uses.
 *
 * Deliberately standalone — no navbar, no footer, no sections. It is opened
 * from a phone, mid-scroll, and its only job is to get the tap to the right
 * destination fast.
 */

const ICONS: Record<LinkIcon, typeof ShoppingBag> = {
  shop: ShoppingBag,
  club: Sparkles,
  whatsapp: MessageCircle,
  instagram: Instagram,
  tiktok: Music2,
  facebook: Facebook,
  radio: Radio,
  gallery: Images,
  event: CalendarHeart,
  location: MapPin,
}

export default function Links() {
  const links = getBioLinks()
  const featured = links.filter((l) => l.highlight)
  const rest = links.filter((l) => !l.highlight)

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <SeoHead
        title="Links | GeekPop & Toys"
        description="Todos os links da GeekPop & Toys: loja online, clube com 15% de desconto, WhatsApp, rádio e redes sociais."
        path="/links"
      />

      {/* Two soft blobs instead of a busy background: they carry the brand
          colours without competing with the cards for attention. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -left-24 h-72 w-72 rounded-full bg-primary/25 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-20 h-80 w-80 rounded-full bg-accent/20 blur-3xl"
      />

      {/* Fixed rather than in the flow: the page is a single column and a toggle
          inline above the logo would be the first thing the eye lands on. */}
      <ThemeToggle className="fixed right-4 top-4 z-10 bg-card/80 backdrop-blur" />

      <main className="relative mx-auto flex min-h-screen w-full max-w-md flex-col px-5 py-10">
        <header className="animate-fade-up text-center opacity-0" style={{ animationDelay: '0ms' }}>
          <img
            src="/logo.jpg"
            alt="GeekPop & Toys"
            width={96}
            height={96}
            className="mx-auto h-24 w-24 rounded-2xl object-cover shadow-lg ring-2 ring-primary/30"
          />
          <h1 className="mt-4 font-heading text-2xl font-bold tracking-tight">
            GeekPop &amp; Toys
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            K-pop, colecionáveis e cultura pop · Copacabana, RJ
          </p>
        </header>

        <div className="mt-8 space-y-3">
          {featured.map((link, i) => (
            <LinkCard key={link.id} link={link} delayMs={80 + i * 70} featured />
          ))}
          {rest.map((link, i) => (
            <LinkCard
              key={link.id}
              link={link}
              delayMs={80 + (featured.length + i) * 70}
            />
          ))}
        </div>

        <footer className="mt-auto pt-10 text-center text-xs text-muted-foreground">
          <Link to="/" className="underline underline-offset-2 hover:text-foreground">
            geeketoys.com.br
          </Link>
          <span className="mx-2">·</span>
          <Link to="/privacidade" className="underline underline-offset-2 hover:text-foreground">
            Privacidade
          </Link>
          <CreatorCredit className="mt-3" />
        </footer>
      </main>
    </div>
  )
}

interface LinkCardProps {
  link: BioLink
  delayMs: number
  featured?: boolean
}

function LinkCard({ link, delayMs, featured = false }: LinkCardProps) {
  const Icon = ICONS[link.icon]

  const content = (
    <>
      <span
        className={
          featured
            ? 'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground'
            : 'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary'
        }
      >
        <Icon className={featured ? 'h-5 w-5' : 'h-4 w-4'} aria-hidden />
      </span>

      <span className="min-w-0 flex-1 text-left">
        <span className={featured ? 'block font-semibold' : 'block text-sm font-medium'}>
          {link.label}
        </span>
        {link.description && (
          <span className="mt-0.5 block text-xs text-muted-foreground">
            {link.description}
          </span>
        )}
      </span>

      <ArrowUpRight
        aria-hidden
        className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />
    </>
  )

  // `opacity-0` plus a delayed `forwards` animation is what staggers the entry
  // without pulling in an animation library.
  const className = [
    'group flex w-full items-center gap-3 rounded-2xl border p-4 opacity-0 animate-fade-up',
    'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
    featured
      ? 'border-primary/40 bg-card shadow-md hover:border-primary'
      : 'border-border bg-card/70 hover:border-primary/50',
  ].join(' ')

  if (link.internal) {
    return (
      <Link to={link.href} className={className} style={{ animationDelay: `${delayMs}ms` }}>
        {content}
      </Link>
    )
  }

  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      style={{ animationDelay: `${delayMs}ms` }}
    >
      {content}
    </a>
  )
}

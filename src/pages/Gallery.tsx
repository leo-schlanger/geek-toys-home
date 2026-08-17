import { useState, useEffect, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Images, X, ChevronLeft, ChevronRight } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { SeoHead } from '@/components/SeoHead'
import Footer from '@/components/Footer'
import {
  fetchGalleryAlbums,
  fetchGalleryAlbum,
  type GalleryAlbum,
  type GalleryPhoto,
} from '@/lib/shop-api'

function formatEventDate(iso: string | null): string | null {
  if (!iso) return null
  // Midday keeps the timezone from pulling the date back a day.
  return new Date(`${iso}T12:00`).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

/** The folder list, or one open folder when the route carries a slug. */
const Gallery = () => {
  const { slug } = useParams<{ slug?: string }>()
  return slug ? <AlbumView slug={slug} /> : <AlbumList />
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container pb-16 pt-28 md:pt-32">{children}</main>
      <Footer />
    </div>
  )
}

function AlbumList() {
  const [albums, setAlbums] = useState<GalleryAlbum[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    fetchGalleryAlbums()
      .then((data) => {
        if (active) setAlbums(data)
      })
      .catch(() => {
        if (active) setAlbums([])
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  return (
    <PageShell>
      <SeoHead
        title="Galeria — GeekPop & Toys | Eventos e loja em Copacabana"
        description="Fotos dos eventos de K-pop e da loja física da GeekPop & Toys em Copacabana, Rio de Janeiro."
        path="/galeria"
      />
      <header className="mb-8 text-center">
        <h1 className="font-heading text-3xl font-bold text-foreground md:text-4xl">Galeria</h1>
        <p className="mt-2 text-muted-foreground">
          Nossos eventos e a loja presencial, em fotos.
        </p>
      </header>

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-video animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : albums.length === 0 ? (
        <div className="py-20 text-center">
          <Images className="mx-auto mb-4 h-12 w-12 text-muted-foreground" aria-hidden />
          <p className="font-medium text-muted-foreground">Ainda não há álbuns publicados.</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {albums.map((album) => {
            const date = formatEventDate(album.eventDate)
            return (
              <Link
                key={album.id}
                to={`/galeria/${album.slug}`}
                className="group overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-primary"
              >
                <div className="flex aspect-video items-center justify-center overflow-hidden bg-muted">
                  {album.coverUrl ? (
                    <img
                      src={album.coverUrl}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <Images className="h-8 w-8 text-muted-foreground" aria-hidden />
                  )}
                </div>
                <div className="p-4">
                  <h2 className="font-heading font-semibold text-foreground">{album.name}</h2>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {album.photoCount} foto{album.photoCount === 1 ? '' : 's'}
                    {date && ` · ${date}`}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </PageShell>
  )
}

function AlbumView({ slug }: { slug: string }) {
  const navigate = useNavigate()
  const [album, setAlbum] = useState<GalleryAlbum | null>(null)
  const [loading, setLoading] = useState(true)
  const [lightbox, setLightbox] = useState<number | null>(null)

  useEffect(() => {
    let active = true
    setLoading(true)
    fetchGalleryAlbum(slug)
      .then((data) => {
        if (active) setAlbum(data)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [slug])

  const photos: GalleryPhoto[] = album?.photos ?? []

  const step = useCallback(
    (delta: number) => {
      setLightbox((current) => {
        if (current == null || photos.length === 0) return current
        return (current + delta + photos.length) % photos.length
      })
    },
    [photos.length]
  )

  // Arrows and Esc in the lightbox, as expected of a fullscreen gallery.
  useEffect(() => {
    if (lightbox == null) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setLightbox(null)
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [lightbox, step])

  if (loading) {
    return (
      <PageShell>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      </PageShell>
    )
  }

  if (!album) {
    return (
      <PageShell>
        <div className="py-20 text-center">
          <p className="mb-4 font-medium text-muted-foreground">Álbum não encontrado.</p>
          <button
            type="button"
            onClick={() => navigate('/galeria')}
            className="text-primary underline"
          >
            Voltar para a galeria
          </button>
        </div>
      </PageShell>
    )
  }

  const date = formatEventDate(album.eventDate)

  return (
    <PageShell>
      <SeoHead
        title={`${album.name} — Galeria GeekPop & Toys`}
        description={
          album.description ||
          `Fotos de ${album.name} na GeekPop & Toys, loja de K-pop em Copacabana.`
        }
        path={`/galeria/${album.slug}`}
        image={album.coverUrl ?? undefined}
      />
      <Link
        to="/galeria"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Galeria
      </Link>

      <header className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-foreground md:text-3xl">
          {album.name}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {photos.length} foto{photos.length === 1 ? '' : 's'}
          {date && ` · ${date}`}
        </p>
        {album.description && (
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{album.description}</p>
        )}
      </header>

      {photos.length === 0 ? (
        <p className="py-16 text-center text-muted-foreground">Este álbum ainda está vazio.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {photos.map((photo, index) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => setLightbox(index)}
              className="group aspect-square overflow-hidden rounded-lg border border-border bg-muted"
              aria-label={photo.caption || `Abrir foto ${index + 1}`}
            >
              <img
                src={photo.url}
                alt={photo.caption ?? ''}
                loading="lazy"
                /* No download: the gallery is a showcase, not an archive. */
                onContextMenu={(e) => e.preventDefault()}
                draggable={false}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </button>
          ))}
        </div>
      )}

      {lightbox != null && photos[lightbox] && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
          aria-label={photos[lightbox].caption || 'Foto ampliada'}
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            aria-label="Fechar"
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>

          {photos.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  step(-1)
                }}
                aria-label="Foto anterior"
                className="absolute left-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  step(1)
                }}
                aria-label="Próxima foto"
                className="absolute right-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          <figure className="max-h-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={photos[lightbox].url}
              alt={photos[lightbox].caption ?? ''}
              onContextMenu={(e) => e.preventDefault()}
              draggable={false}
              className="max-h-[85vh] max-w-full rounded-lg object-contain"
            />
            {photos[lightbox].caption && (
              <figcaption className="mt-2 text-center text-sm text-white/80">
                {photos[lightbox].caption}
              </figcaption>
            )}
          </figure>
        </div>
      )}
    </PageShell>
  )
}

export default Gallery

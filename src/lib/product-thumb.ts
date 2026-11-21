/**
 * Product photo thumbnails, the same convention as the shop
 * (clube-geek-toys `src/lib/product-thumb.ts`): the API writes
 * `<photo>.thumb.webp` (shortest side 600 px) next to every uploaded listing
 * photo. Cards ask for it through `srcset`; a photo without one (pasted URL,
 * old upload) falls back to the original in `onError`.
 */
import type { SyntheticEvent } from 'react'

const UPLOADED_PHOTO_RE = /\/uploads\/products\/[^?#]+\.(jpe?g|png|webp)$/i
const THUMB_RE = /\.thumb\.webp$/i

export const PRODUCT_THUMB_WIDTH = 600
/** Nominal width of the original: the panel resizes uploads to at most 2560 px. */
const ORIGINAL_NOMINAL_WIDTH = 1600

export function productThumbUrl(url: string | null | undefined): string | null {
  if (!url || THUMB_RE.test(url) || !UPLOADED_PHOTO_RE.test(url)) return null
  return url.replace(/\.(jpe?g|png|webp)$/i, '.thumb.webp')
}

/** `srcset` for a card photo, or undefined when the photo has no thumbnail. */
export function productCardSrcSet(url: string | null | undefined): string | undefined {
  const thumb = productThumbUrl(url)
  if (!thumb || !url) return undefined
  return `${thumb} ${PRODUCT_THUMB_WIDTH}w, ${url} ${ORIGINAL_NOMINAL_WIDTH}w`
}

/**
 * onError step 1: a missing thumbnail retries with the original alone.
 * Returns false when the original itself failed (caller shows its fallback).
 */
export function retryWithOriginal(e: SyntheticEvent<HTMLImageElement>, original: string): boolean {
  const el = e.currentTarget
  if (!el.srcset && el.getAttribute('src') === original) return false
  el.removeAttribute('srcset')
  el.removeAttribute('sizes')
  el.src = original
  return true
}

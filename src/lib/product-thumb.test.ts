import { describe, it, expect } from 'vitest'
import { productCardSrcSet, productThumbUrl } from './product-thumb'

const API = 'https://api.geeketoys.com.br/uploads/products/a1/b2'

describe('product thumbnails', () => {
  it.each(['jpg', 'jpeg', 'png', 'webp', 'JPG'])('uploaded .%s photo → .thumb.webp', (ext) => {
    expect(productThumbUrl(`${API}.${ext}`)).toBe(`${API}.thumb.webp`)
    expect(productCardSrcSet(`${API}.${ext}`)).toBe(`${API}.thumb.webp 600w, ${API}.${ext} 1600w`)
  })

  it.each([null, undefined, '', `${API}.thumb.webp`, 'https://cdn.example.com/x.jpg', `${API}.gif`, `${API}.jpg?v=2`])(
    'no thumbnail for %s',
    (url) => {
      expect(productThumbUrl(url)).toBeNull()
      expect(productCardSrcSet(url)).toBeUndefined()
    }
  )
})

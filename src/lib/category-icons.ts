import {
  Sparkles,
  Music,
  Gamepad2,
  Shirt,
  Cookie,
  Baby,
  PawPrint,
  Palette,
  BookOpen,
  Home,
  Heart,
  Star,
  Gift,
  Camera,
  Cat,
  Zap,
  type LucideIcon,
} from 'lucide-react'

/**
 * Ícone por categoria, espelhando `clube-geek-toys/src/lib/category-icons.ts`.
 *
 * O banco guarda só a chave (escolhida na aba **Categorias** do admin) e o
 * componente mora aqui. Antes desta tabela existir, esta seção desenhava uma
 * nota musical fixa em **toda** categoria vinda da API — o que era literalmente
 * a mesma arte repetida catorze vezes.
 */
const BY_KEY: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  music: Music,
  star: Star,
  gamepad: Gamepad2,
  cat: Cat,
  zap: Zap,
  shirt: Shirt,
  heart: Heart,
  cookie: Cookie,
  baby: Baby,
  paw: PawPrint,
  palette: Palette,
  book: BookOpen,
  home: Home,
  gift: Gift,
  camera: Camera,
}

/**
 * Palpite pelo nome, para categoria que ainda não tem ícone escolhido.
 * A migration 030 preencheu as existentes; isto cobre as criadas depois.
 */
export function guessCategoryIcon(name: string): LucideIcon {
  const n = name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()

  const rules: [RegExp, LucideIcon][] = [
    [/k-?pop/, Star],
    [/photocard|foto/, Camera],
    [/music|musica/, Music],
    [/pokemon/, Zap],
    [/anime|mang/, Cat],
    [/beleza|maquia/, Heart],
    [/moda|vestuario|roupa|camiseta/, Shirt],
    [/jogo|game/, Gamepad2],
    [/comida|food|doce/, Cookie],
    [/bebe/, Baby],
    [/pet|animal/, PawPrint],
    [/decora/, Palette],
    [/papelaria|caderno/, BookOpen],
    [/acessorio/, Sparkles],
    [/brinquedo/, Gift],
    [/casa|eletro/, Home],
  ]
  for (const [pattern, Icon] of rules) {
    if (pattern.test(n)) return Icon
  }
  return Sparkles
}

/** Ícone da categoria: o escolhido no admin, senão o palpite pelo nome. */
export function categoryIcon(key: string | null | undefined, name: string): LucideIcon {
  return (key && BY_KEY[key]) || guessCategoryIcon(name)
}

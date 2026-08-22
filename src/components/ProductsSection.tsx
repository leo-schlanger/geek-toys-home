import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Gamepad2,
  Baby,
  Smartphone,
  Shirt,
  Music,
  Dice5,
  ImageOff,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";
import { categoryIcon } from "@/lib/category-icons";
import {
  SHOP_URL,
  categoryUrl,
  fetchCategories,
  fetchProducts,
  formatBRL,
  isOnSale,
  productUrl,
  type ShopProduct,
} from "@/lib/shop-api";

/** Categorias visuais (atalhos) — complementam as da API. */
const FALLBACK_CATEGORIES = [
  { icon: Gamepad2, title: "Colecionáveis & Action Figures", slug: null as string | null },
  { icon: Music, title: "K-POP & Photocards", slug: "musica" },
  { icon: Baby, title: "Brinquedos", slug: null },
  { icon: Shirt, title: "Camisetas Geek", slug: null },
  { icon: Smartphone, title: "Eletrodomésticos", slug: null },
  { icon: Dice5, title: "Jogos & Diversão", slug: null },
];

function ProductTile({ product }: { product: ShopProduct }) {
  const image = product.images?.[0] ?? null;
  const onSale = isOnSale(product);
  const outOfStock = product.stock <= 0;

  return (
    <a
      href={productUrl(product.slug)}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm hover-glow-primary transition-all"
    >
      <div className="relative aspect-square bg-secondary/60 overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              const fb = e.currentTarget.nextElementSibling as HTMLElement | null;
              if (fb) fb.classList.remove("hidden");
            }}
          />
        ) : null}
        <div
          className={`flex h-full w-full flex-col items-center justify-center gap-1.5 text-muted-foreground ${
            image ? "hidden absolute inset-0 bg-secondary/60" : ""
          }`}
        >
          <ImageOff className="h-10 w-10 opacity-50" />
          <span className="text-[10px] font-semibold uppercase tracking-wide">Sem foto</span>
        </div>
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {product.featured && (
            <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase text-primary-foreground">
              Destaque
            </span>
          )}
          {onSale && (
            <span className="rounded-full bg-destructive px-2 py-0.5 text-[10px] font-bold uppercase text-destructive-foreground">
              Promo
            </span>
          )}
        </div>
        {outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70">
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold">
              Esgotado
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3 md:p-4">
        {product.categoryName && (
          <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
            {product.categoryName}
          </span>
        )}
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <div className="mt-auto flex items-baseline gap-2 pt-1">
          <span className="text-base font-bold text-foreground">
            {formatBRL(product.price)}
          </span>
          {onSale && product.compareAtPrice != null && (
            <span className="text-xs text-muted-foreground line-through">
              {formatBRL(product.compareAtPrice)}
            </span>
          )}
        </div>
        <span className="mt-2 inline-flex items-center justify-center gap-1 rounded-lg bg-primary/10 py-2 text-xs font-bold text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          Comprar agora
          <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </a>
  );
}

const ProductsSection = () => {
  const ref = useRef<HTMLElement>(null);

  const productsQuery = useQuery({
    queryKey: ["home-products"],
    queryFn: () => fetchProducts({ limit: 12 }),
    staleTime: 60_000,
  });

  const categoriesQuery = useQuery({
    queryKey: ["home-categories"],
    queryFn: fetchCategories,
    staleTime: 120_000,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      },
      { threshold: 0.08 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const products = productsQuery.data?.products ?? [];
  const apiCategories = (categoriesQuery.data ?? []).filter(
    (c) => c.active && c.slug !== "checkup"
  );

  return (
    <section
      id="produtos"
      ref={ref}
      className="section-fade-in py-16 md:py-24 scroll-mt-28"
    >
      <div className="container">
        <div className="text-center mb-8 md:mb-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-bold uppercase tracking-wide mb-3">
            <ShoppingBag className="h-3.5 w-3.5" />
            Loja online
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
            Confira nossos produtos
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Entre e já veja o catálogo. Membros do Clube têm{" "}
            <strong className="text-foreground">15% de desconto</strong> no
            checkout.
          </p>
        </div>

        {/* Categorias — API + atalhos */}
        <div className="mb-10">
          <h3 className="font-heading text-lg md:text-xl font-bold text-foreground mb-4 text-center md:text-left">
            Categorias
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {apiCategories.length > 0
              ? apiCategories.map((cat) => {
                  // O ícone vem da categoria (aba Categorias do admin). Isto já
                  // desenhou uma nota musical fixa em todas — mesma arte
                  // catorze vezes, sem relação com o que a categoria vende.
                  const Icon = categoryIcon(cat.icon, cat.name);
                  return (
                    <a
                      key={cat.id}
                      href={categoryUrl(cat.slug)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-card border border-border rounded-xl p-4 md:p-5 text-center shadow-sm hover-glow-primary transition-all group block"
                    >
                      <Icon
                        size={32}
                        className="mx-auto mb-2 text-primary group-hover:text-accent transition-colors"
                      />
                      <h4 className="font-heading font-semibold text-sm text-foreground">
                        {cat.name}
                      </h4>
                    </a>
                  );
                })
              : FALLBACK_CATEGORIES.map(({ icon: Icon, title, slug }) => (
                  <a
                    key={title}
                    href={slug ? categoryUrl(slug) : SHOP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-card border border-border rounded-xl p-4 md:p-5 text-center shadow-sm hover-glow-primary transition-all group block"
                  >
                    <Icon
                      size={32}
                      className="mx-auto mb-2 text-primary group-hover:text-accent transition-colors"
                    />
                    <h4 className="font-heading font-semibold text-xs md:text-sm text-foreground">
                      {title}
                    </h4>
                  </a>
                ))}
            {/* Atalho “ver tudo” sempre */}
            <a
              href={SHOP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary/10 border border-primary/30 rounded-xl p-4 md:p-5 text-center shadow-sm hover:bg-primary/15 transition-all group flex flex-col items-center justify-center"
            >
              <ShoppingBag
                size={32}
                className="mb-2 text-primary"
              />
              <h4 className="font-heading font-semibold text-xs md:text-sm text-primary">
                Ver loja completa
              </h4>
            </a>
          </div>
        </div>

        {/* Grade de produtos (estilo iBox — “acabou de chegar”) */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-5">
            <div>
              <h3 className="font-heading text-xl md:text-2xl font-bold text-foreground">
                Acabou de chegar!
              </h3>
              {/* Não repete "novidades": o título já diz isso. O subtítulo
                  serve para informar o que o título não cobre. */}
              <p className="text-sm text-muted-foreground">
                Os últimos itens que entraram no catálogo
              </p>
            </div>
            <a
              href={SHOP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              Ver todos <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          {productsQuery.isLoading && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[3/4] rounded-xl bg-secondary/60 animate-pulse"
                />
              ))}
            </div>
          )}

          {productsQuery.isError && (
            <div className="rounded-xl border border-border bg-card p-8 text-center">
              <p className="text-muted-foreground mb-4">
                Não foi possível carregar os produtos agora.
              </p>
              <a
                href={SHOP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 font-bold hover:brightness-110 transition-all"
              >
                Abrir loja online
              </a>
            </div>
          )}

          {!productsQuery.isLoading && !productsQuery.isError && products.length === 0 && (
            <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center">
              <p className="text-muted-foreground mb-4">
                Em breve novos produtos por aqui.
              </p>
              <a
                href={SHOP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-semibold hover:underline"
              >
                Ir para a loja
              </a>
            </div>
          )}

          {products.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
              {products.map((p) => (
                <ProductTile key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>

        <div className="mt-10 text-center">
          <a
            href={SHOP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-8 py-3.5 font-bold hover:brightness-110 transition-all shadow-lg shadow-primary/20"
          >
            <ShoppingBag size={20} />
            Comprar na loja online
          </a>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;

import { useState, useEffect, useRef } from "react";
import { Search, SlidersHorizontal, X, Loader2, ArrowUpDown, ArrowUp, ArrowDown, ChevronDown, ChevronUp } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { productsApi } from "@/lib/api";

interface Product {
  id: string;
  name: string;
  flavor: string;
  price: number;
  originalPrice?: number | null;
  image: string;
  isNew: boolean;
  isBestSeller: boolean;
  isFeatured?: boolean;
  category: string;
  stock: number;
  flavors?: string[];
}

type PriceSortType = "default" | "highest" | "lowest";

const Produtos = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [priceSort, setPriceSort] = useState<PriceSortType>("default");
  const [showFilters, setShowFilters] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [highlightedProduct, setHighlightedProduct] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const productRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, selectedCategory, priceSort]);

  // Handle URL product parameter
  useEffect(() => {
    const produtoId = searchParams.get("produto");
    if (produtoId && !isLoading && products.length > 0) {
      setHighlightedProduct(produtoId);
      // Scroll to product after a short delay
      setTimeout(() => {
        const productElement = productRefs.current[produtoId];
        if (productElement) {
          productElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 300);
      // Remove highlight after animation
      setTimeout(() => {
        setHighlightedProduct(null);
      }, 3000);
    }
  }, [searchParams, isLoading, products]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const params: { search?: string; category?: string } = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedCategory !== "Todos") params.category = selectedCategory;

      const data = await productsApi.getAll(params);

      // Apply price sorting while keeping featured products on top
      let sortedProducts = [...data.products];

      if (priceSort !== "default") {
        // Separate featured and non-featured products
        const featured = sortedProducts.filter(p => p.isFeatured);
        const nonFeatured = sortedProducts.filter(p => !p.isFeatured);

        // Sort non-featured products by price
        nonFeatured.sort((a, b) => {
          if (priceSort === "highest") {
            return b.price - a.price; // Highest first
          } else {
            return a.price - b.price; // Lowest first
          }
        });

        // Combine: featured first, then sorted non-featured
        sortedProducts = [...featured, ...nonFeatured];
      }

      setProducts(sortedProducts);
      setCategories(["Todos", ...data.categories]);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-28 pb-16">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              <span className="text-foreground">Nosso </span>
              <span className="text-gradient">Catálogo</span>
            </h1>
            <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore nossa coleção completa de pods premium com sabores exclusivos.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col gap-4 mb-8">
            {/* Search Bar and Price Sort */}
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar por nome ou sabor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 bg-muted/50 border-border/50 focus:border-primary"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Desktop Price Sort */}
              <div className="hidden lg:flex items-center gap-2">
                <Button
                  variant={priceSort === "default" ? "default" : "glass"}
                  size="sm"
                  onClick={() => setPriceSort("default")}
                  className="transition-all whitespace-nowrap"
                  title="Ordenação padrão"
                >
                  <ArrowUpDown className="w-4 h-4 mr-1" />
                  Padrão
                </Button>
                <Button
                  variant={priceSort === "highest" ? "default" : "glass"}
                  size="sm"
                  onClick={() => setPriceSort("highest")}
                  className="transition-all whitespace-nowrap"
                  title="Do maior para o menor preço"
                >
                  <ArrowDown className="w-4 h-4 mr-1" />
                  Maior
                </Button>
                <Button
                  variant={priceSort === "lowest" ? "default" : "glass"}
                  size="sm"
                  onClick={() => setPriceSort("lowest")}
                  className="transition-all whitespace-nowrap"
                  title="Do menor para o maior preço"
                >
                  <ArrowUp className="w-4 h-4 mr-1" />
                  Menor
                </Button>
              </div>

              {/* Mobile Filter Toggle */}
              <Button
                variant="outline"
                className="lg:hidden"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="w-5 h-5 mr-2" />
                Filtros
              </Button>
            </div>

            {/* Desktop Category Filters - Collapsible */}
            <div className="hidden lg:block">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCategories(!showCategories)}
                className="mb-2 text-muted-foreground hover:text-foreground"
              >
                {showCategories ? (
                  <ChevronUp className="w-4 h-4 mr-2" />
                ) : (
                  <ChevronDown className="w-4 h-4 mr-2" />
                )}
                {showCategories ? "Ocultar" : "Mostrar"} Categorias ({categories.length})
              </Button>

              {showCategories && (
                <div className="flex flex-wrap gap-2 animate-slide-up">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "glass"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className="transition-all"
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="lg:hidden flex flex-col gap-4 mb-8 animate-slide-up">
              {/* Category Filters */}
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Categorias</p>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "glass"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Price Sort Filters */}
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Ordenar por Preço</p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={priceSort === "default" ? "default" : "glass"}
                    size="sm"
                    onClick={() => setPriceSort("default")}
                    title="Ordenação padrão"
                  >
                    <ArrowUpDown className="w-4 h-4 mr-1" />
                    Padrão
                  </Button>
                  <Button
                    variant={priceSort === "highest" ? "default" : "glass"}
                    size="sm"
                    onClick={() => setPriceSort("highest")}
                    title="Maior valor"
                  >
                    <ArrowDown className="w-4 h-4 mr-1" />
                    Maior Valor
                  </Button>
                  <Button
                    variant={priceSort === "lowest" ? "default" : "glass"}
                    size="sm"
                    onClick={() => setPriceSort("lowest")}
                    title="Menor valor"
                  >
                    <ArrowUp className="w-4 h-4 mr-1" />
                    Menor Valor
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Results Count */}
          <div className="mb-6">
            <p className="font-body text-muted-foreground">
              {products.length} {products.length === 1 ? "produto encontrado" : "produtos encontrados"}
            </p>
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <div
                  key={product.id}
                  ref={(el) => (productRefs.current[product.id] = el)}
                  className={`animate-scale-in ${highlightedProduct === product.id ? 'ring-4 ring-primary ring-offset-4 ring-offset-background rounded-xl animate-pulse' : ''}`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <ProductCard {...product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full glass flex items-center justify-center">
                <Search className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-2">
                Nenhum produto encontrado
              </h3>
              <p className="font-body text-muted-foreground mb-6">
                Tente ajustar sua busca ou filtros.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("Todos");
                  setPriceSort("default");
                }}
              >
                Limpar Filtros
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Produtos;

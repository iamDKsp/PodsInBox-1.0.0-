import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const allProducts = [
  {
    id: 1,
    name: "Neon Blast",
    flavor: "Menta Gelada + Melancia",
    price: 89.90,
    originalPrice: 119.90,
    image: "https://images.unsplash.com/photo-1560913210-46c2f2944c6f?w=400&h=400&fit=crop",
    isNew: true,
    isBestSeller: false,
    category: "Frutado",
  },
  {
    id: 2,
    name: "Cyber Grape",
    flavor: "Uva Roxa Premium",
    price: 79.90,
    image: "https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=400&h=400&fit=crop",
    isNew: false,
    isBestSeller: true,
    category: "Frutado",
  },
  {
    id: 3,
    name: "Electric Blue",
    flavor: "Blueberry Ice",
    price: 94.90,
    image: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=400&h=400&fit=crop",
    isNew: true,
    isBestSeller: false,
    category: "Gelado",
  },
  {
    id: 4,
    name: "Tropical Storm",
    flavor: "Manga + Maracujá",
    price: 84.90,
    originalPrice: 99.90,
    image: "https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=400&h=400&fit=crop",
    isNew: false,
    isBestSeller: true,
    category: "Tropical",
  },
  {
    id: 5,
    name: "Arctic Mint",
    flavor: "Menta Polar",
    price: 74.90,
    image: "https://images.unsplash.com/photo-1495476479092-6ece1898a101?w=400&h=400&fit=crop",
    isNew: false,
    isBestSeller: false,
    category: "Gelado",
  },
  {
    id: 6,
    name: "Cherry Nova",
    flavor: "Cereja Espacial",
    price: 89.90,
    image: "https://images.unsplash.com/photo-1528821128474-27f963b062bf?w=400&h=400&fit=crop",
    isNew: true,
    isBestSeller: false,
    category: "Frutado",
  },
  {
    id: 7,
    name: "Citrus Surge",
    flavor: "Limão + Laranja",
    price: 69.90,
    originalPrice: 84.90,
    image: "https://images.unsplash.com/photo-1490885578174-acda8905c2c6?w=400&h=400&fit=crop",
    isNew: false,
    isBestSeller: false,
    category: "Cítrico",
  },
  {
    id: 8,
    name: "Velvet Tobacco",
    flavor: "Tabaco Suave",
    price: 99.90,
    image: "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=400&h=400&fit=crop",
    isNew: false,
    isBestSeller: true,
    category: "Clássico",
  },
];

const categories = ["Todos", "Frutado", "Gelado", "Tropical", "Cítrico", "Clássico"];

const Produtos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = allProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.flavor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Todos" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
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

            {/* Mobile Filter Toggle */}
            <Button
              variant="outline"
              className="lg:hidden"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="w-5 h-5 mr-2" />
              Filtros
            </Button>

            {/* Desktop Categories */}
            <div className="hidden lg:flex items-center gap-2">
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
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="lg:hidden flex flex-wrap gap-2 mb-8 animate-slide-up">
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
          )}

          {/* Results Count */}
          <div className="mb-6">
            <p className="font-body text-muted-foreground">
              {filteredProducts.length} {filteredProducts.length === 1 ? "produto encontrado" : "produtos encontrados"}
            </p>
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-scale-in"
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

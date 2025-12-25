import { ArrowRight, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { productsApi } from "@/lib/api";

interface Product {
  id: string;
  name: string;
  flavor: string;
  price: number;
  originalPrice?: number | null;
  image: string;
  isNew?: boolean;
  isBestSeller?: boolean;
  isFeatured?: boolean;
  flavors?: string[];
}

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productsApi.getAll();
        // Filter only featured products
        const featuredProducts = response.products.filter((p: Product) => p.isFeatured);
        setProducts(featuredProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <section className="py-24 relative overflow-hidden" id="produtos">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent" />
      <div className="absolute top-1/2 right-0 w-72 h-72 bg-yellow-500/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-yellow-600/10 rounded-full blur-[120px]" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="font-display text-sm uppercase tracking-[0.3em] text-yellow-500 mb-4 block flex items-center justify-center gap-2">
            <Crown className="w-4 h-4" />
            Modelos Premium
            <Crown className="w-4 h-4" />
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            <span className="text-foreground">Produtos em </span>
            <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">Destaque</span>
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
            Selecionamos os pods + vendidos com sabores exclusivos e design inovadores para você.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-80 rounded-xl bg-muted/20 animate-pulse" />
            ))
          ) : (
            products.map((product, index) => (
              <div
                key={product.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <FeaturedProductCard {...product} />
              </div>
            ))
          )}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link to="/produtos">
            <Button variant="outline" size="lg" className="group border-primary/50 hover:border-primary hover:bg-primary/10 text-primary">
              Ver Todos os Produtos
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

// Special Featured Product Card with Golden Styling
const FeaturedProductCard = ({
  id,
  name,
  flavor,
  price,
  image,
  isNew,
  isBestSeller,
  flavors = [],
}: Product) => {
  return (
    <div className="group relative rounded-xl overflow-hidden transition-all duration-500 hover:scale-[1.02] ring-2 ring-yellow-500/50 hover:ring-yellow-500 shadow-[0_0_25px_rgba(234,179,8,0.2)] hover:shadow-[0_0_40px_rgba(234,179,8,0.4)]">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-card/90 to-yellow-600/5 backdrop-blur-sm" />

      {/* Crown Badge */}
      <div className="absolute top-0 right-0 z-30">
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 px-3 py-1 rounded-bl-lg flex items-center gap-1">
          <Crown className="w-4 h-4 text-black" />
          <span className="text-xs font-bold text-black uppercase">Destaque</span>
        </div>
      </div>

      {/* Badges */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        {isNew && (
          <span className="px-3 py-1 text-xs font-display font-bold uppercase bg-yellow-500 text-black rounded-full">
            Novo
          </span>
        )}
        {isBestSeller && (
          <span className="px-3 py-1 text-xs font-display font-bold uppercase bg-yellow-600 text-black rounded-full">
            Mais Vendido
          </span>
        )}
      </div>

      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-card/80 z-10" />
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-yellow-500/20 to-yellow-600/10">
            <div className="text-center">
              <div className="text-3xl font-display font-bold text-yellow-500">
                {name.split(' ')[0]}
              </div>
              <div className="text-xs text-yellow-500/70 mt-1">
                {name.split(' ').slice(1).join(' ')}
              </div>
            </div>
          </div>
        )}
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="relative p-5 z-10">
        <div className="mb-3">
          <h3 className="font-display text-lg font-bold text-yellow-500 transition-colors">
            {name}
          </h3>
          <p className="font-body text-sm text-muted-foreground">
            {flavors.length > 1 ? `${flavors.length} sabores disponíveis` : flavor}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-display text-2xl font-bold text-yellow-500">
            R$ {price.toFixed(2)}
          </span>

          <Link to={`/produtos?produto=${id}`}>
            <button className="p-3 rounded-full bg-yellow-500 hover:bg-yellow-600 text-black transition-all shadow-[0_0_15px_rgba(234,179,8,0.5)] hover:shadow-[0_0_25px_rgba(234,179,8,0.7)]">
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>

      {/* Bottom Golden Line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-600" />
    </div>
  );
};

export default FeaturedProducts;

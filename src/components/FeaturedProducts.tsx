import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "./ProductCard";
import { Link } from "react-router-dom";

const products = [
  {
    id: 1,
    name: "Neon Blast",
    flavor: "Menta Gelada + Melancia",
    price: 89.90,
    originalPrice: 119.90,
    image: "https://images.unsplash.com/photo-1560913210-46c2f2944c6f?w=400&h=400&fit=crop",
    isNew: true,
    isBestSeller: false,
  },
  {
    id: 2,
    name: "Cyber Grape",
    flavor: "Uva Roxa Premium",
    price: 79.90,
    image: "https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=400&h=400&fit=crop",
    isNew: false,
    isBestSeller: true,
  },
  {
    id: 3,
    name: "Electric Blue",
    flavor: "Blueberry Ice",
    price: 94.90,
    image: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=400&h=400&fit=crop",
    isNew: true,
    isBestSeller: false,
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
  },
];

const FeaturedProducts = () => {
  return (
    <section className="py-24 relative overflow-hidden" id="produtos">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="absolute top-1/2 right-0 w-72 h-72 bg-accent/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-[120px]" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="font-display text-sm uppercase tracking-[0.3em] text-primary mb-4 block">
            Coleção Premium
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            <span className="text-foreground">Produtos em </span>
            <span className="text-gradient">Destaque</span>
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
            Selecionamos os melhores pods com sabores exclusivos e design futurista para você.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ProductCard {...product} />
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link to="/produtos">
            <Button variant="outline" size="lg" className="group">
              Ver Todos os Produtos
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;

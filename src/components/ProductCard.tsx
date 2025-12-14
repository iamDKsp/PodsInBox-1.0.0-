import { ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  id: number;
  name: string;
  flavor: string;
  price: number;
  originalPrice?: number;
  image: string;
  isNew?: boolean;
  isBestSeller?: boolean;
}

const ProductCard = ({
  name,
  flavor,
  price,
  originalPrice,
  image,
  isNew,
  isBestSeller,
}: ProductCardProps) => {
  return (
    <div className="group relative gradient-border rounded-xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:neon-box">
      {/* Background */}
      <div className="absolute inset-0 bg-card/80 backdrop-blur-sm" />
      
      {/* Badges */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        {isNew && (
          <span className="px-3 py-1 text-xs font-display font-bold uppercase bg-neon-green text-background rounded-full">
            Novo
          </span>
        )}
        {isBestSeller && (
          <span className="px-3 py-1 text-xs font-display font-bold uppercase bg-accent text-accent-foreground rounded-full">
            Mais Vendido
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button className="absolute top-4 right-4 z-20 p-2 rounded-full glass opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-accent/20 hover:text-accent">
        <Heart className="w-5 h-5" />
      </button>

      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-card/80 z-10" />
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Glow Effect on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="relative p-5 z-10">
        <div className="mb-3">
          <h3 className="font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors">
            {name}
          </h3>
          <p className="font-body text-sm text-muted-foreground">{flavor}</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-2xl font-bold text-primary">
              R$ {price.toFixed(2)}
            </span>
            {originalPrice && (
              <span className="font-body text-sm text-muted-foreground line-through">
                R$ {originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          
          <Button variant="secondary" size="icon" className="rounded-full">
            <ShoppingCart className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Bottom Neon Line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
};

export default ProductCard;

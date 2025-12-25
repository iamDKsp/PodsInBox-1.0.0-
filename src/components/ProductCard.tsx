import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { ShoppingCart, Heart, Crown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import FlavorSelector from "./FlavorSelector";

interface ProductCardProps {
  id: string | number;
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

const ProductCard = ({
  id,
  name,
  flavor,
  price,
  originalPrice,
  image,
  isNew,
  isBestSeller,
  isFeatured,
  flavors = [],
}: ProductCardProps) => {
  const { addItem } = useCart();
  const [showFlavorSelector, setShowFlavorSelector] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);

  const handleAddToCart = () => {
    if (flavors.length > 1) {
      setShowFlavorSelector(true);
    } else {
      const selectedFlavor = flavors.length === 1 ? flavors[0] : flavor;
      addItem({
        id: id.toString(),
        name,
        flavor: selectedFlavor,
        price,
        image,
      });
    }
  };

  const handleFlavorSelected = (selectedFlavor: string) => {
    addItem({
      id: id.toString(),
      name,
      flavor: selectedFlavor,
      price,
      image,
    });
  };

  const handleImageClick = () => {
    if (image) {
      setShowFullImage(true);
    }
  };

  // Prevent body scroll when fullscreen modal is open
  useEffect(() => {
    if (showFullImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showFullImage]);

  // Featured product gets golden styling
  const cardClasses = isFeatured
    ? "group relative rounded-xl overflow-hidden transition-all duration-500 hover:scale-[1.02] ring-2 ring-yellow-500/70 shadow-[0_0_30px_rgba(234,179,8,0.3)]"
    : "group relative gradient-border rounded-xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:neon-box";

  return (
    <>
      <div className={cardClasses}>
        {/* Background */}
        <div className={`absolute inset-0 ${isFeatured ? 'bg-gradient-to-br from-yellow-500/10 via-card/80 to-yellow-500/5' : 'bg-card/80'} backdrop-blur-sm`} />

        {/* Featured Crown */}
        {isFeatured && (
          <div className="absolute top-0 right-0 z-30">
            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 px-3 py-1 rounded-bl-lg flex items-center gap-1">
              <Crown className="w-4 h-4 text-black" />
              <span className="text-xs font-bold text-black uppercase">Destaque</span>
            </div>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
          {isNew && (
            <span className={`px-3 py-1 text-xs font-display font-bold uppercase ${isFeatured ? 'bg-yellow-500 text-black' : 'bg-neon-green text-background'} rounded-full`}>
              Novo
            </span>
          )}
          {isBestSeller && (
            <span className="px-3 py-1 text-xs font-display font-bold uppercase bg-accent text-accent-foreground rounded-full">
              Mais Vendido
            </span>
          )}
          {flavors.length > 1 && (
            <span className="px-3 py-1 text-xs font-display font-bold uppercase bg-primary/80 text-primary-foreground rounded-full">
              {flavors.length} sabores
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button className="absolute top-4 right-4 z-20 p-2 rounded-full glass opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-accent/20 hover:text-accent">
          <Heart className="w-5 h-5" />
        </button>

        {/* Image Container - Now clickable for fullscreen */}
        <div
          className="relative h-64 overflow-hidden cursor-pointer"
          onClick={handleImageClick}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-card/80 z-10" />
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center ${isFeatured ? 'bg-gradient-to-br from-yellow-500/20 to-yellow-600/10' : 'bg-gradient-to-br from-primary/20 to-secondary/10'}`}>
              <div className="text-center">
                <div className={`text-4xl font-display font-bold ${isFeatured ? 'text-yellow-500' : 'text-primary/60'}`}>
                  {name.split(' ')[0]}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {name.split(' ').slice(1).join(' ')}
                </div>
              </div>
            </div>
          )}
          {/* Glow Effect on Hover */}
          <div className={`absolute inset-0 ${isFeatured ? 'bg-gradient-to-t from-yellow-500/30 to-transparent' : 'bg-gradient-to-t from-primary/20 to-transparent'} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
        </div>

        {/* Content */}
        <div className="relative p-5 z-10">
          <div className="mb-3">
            <h3 className={`font-display text-lg font-bold ${isFeatured ? 'text-yellow-500' : 'text-foreground group-hover:text-primary'} transition-colors`}>
              {name}
            </h3>
            <p className="font-body text-sm text-muted-foreground">
              {flavors.length > 1 ? `${flavors.length} sabores disponíveis` : flavor}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className={`font-display text-2xl font-bold ${isFeatured ? 'text-yellow-500' : 'text-primary'}`}>
                R$ {price.toFixed(2)}
              </span>
              {originalPrice && (
                <span className="font-body text-sm text-muted-foreground line-through">
                  R$ {originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            <Button
              variant={isFeatured ? "default" : "secondary"}
              size="icon"
              className={`rounded-full ${isFeatured ? 'bg-yellow-500 hover:bg-yellow-600 text-black' : ''}`}
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Bottom Neon Line */}
        <div className={`absolute bottom-0 left-0 right-0 h-1 ${isFeatured ? 'bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-600 opacity-100' : 'bg-gradient-to-r from-primary via-accent to-secondary opacity-0 group-hover:opacity-100'} transition-opacity duration-300`} />
      </div>

      {/* Flavor Selector Modal */}
      <FlavorSelector
        isOpen={showFlavorSelector}
        onClose={() => setShowFlavorSelector(false)}
        product={{ id, name, price, image, flavors }}
        onAddToCart={handleFlavorSelected}
      />

      {/* Fullscreen Image Modal - Rendered via portal to ensure true fullscreen */}
      {showFullImage && image && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex flex-col bg-black"
          onClick={() => setShowFullImage(false)}
          style={{ touchAction: 'none' }}
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-4 p-3 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors z-[10000]"
            onClick={(e) => {
              e.stopPropagation();
              setShowFullImage(false);
            }}
          >
            <X className="w-6 h-6" />
          </button>

          {/* Image container - takes full screen */}
          <div className="flex-1 flex items-center justify-center p-4">
            <img
              src={image}
              alt={name}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Product info footer */}
          <div className="p-4 bg-gradient-to-t from-black via-black/90 to-transparent">
            <h3 className="font-display text-xl font-bold text-white">{name}</h3>
            <p className="font-body text-white/80">{flavor}</p>
            <p className="font-display text-2xl font-bold text-primary mt-2">R$ {price.toFixed(2)}</p>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default ProductCard;


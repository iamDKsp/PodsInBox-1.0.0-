import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const CartSidebar = () => {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login necessário",
        description: "Faça login para finalizar o pedido",
        variant: "destructive",
      });
      return;
    }
    // TODO: Implement checkout with backend
    toast({
      title: "Pedido recebido!",
      description: "Seu pedido será processado em breve.",
    });
    clearCart();
    closeCart();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-background/80 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeCart}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-card border-l border-border z-50 transform transition-transform duration-500 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-primary" />
            <h2 className="font-display text-xl font-bold">Carrinho</h2>
          </div>
          <button
            onClick={closeCart}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ maxHeight: "calc(100vh - 280px)" }}>
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <ShoppingBag className="w-16 h-16 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground font-body">Seu carrinho está vazio</p>
              <Link to="/produtos" onClick={closeCart}>
                <Button variant="outline" className="mt-4">
                  Ver produtos
                </Button>
              </Link>
            </div>
          ) : (
            items.map((item, index) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 rounded-xl glass animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-display font-bold text-sm">{item.name}</h3>
                  <p className="text-xs text-muted-foreground">{item.flavor}</p>
                  <p className="text-primary font-bold mt-1">
                    R$ {item.price.toFixed(2)}
                  </p>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center hover:bg-primary/20 transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-display font-bold w-8 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center hover:bg-primary/20 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="ml-auto p-2 text-destructive hover:bg-destructive/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-border bg-card">
            <div className="flex justify-between items-center mb-4">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-display text-2xl font-bold text-gradient">
                R$ {subtotal.toFixed(2)}
              </span>
            </div>
            <Button
              variant="neon"
              className="w-full"
              onClick={handleCheckout}
            >
              Finalizar Pedido
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-2">
              Frete calculado no checkout
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;

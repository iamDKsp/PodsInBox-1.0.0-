import { useState } from "react";
import { X, Minus, Plus, Trash2, ShoppingBag, Loader2, Calendar, Clock, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

const CartSidebar = () => {
  const { items, isOpen, isCheckingOut, closeCart, removeItem, updateQuantity, subtotal, checkout } = useCart();
  const { isAuthenticated, user } = useAuth();

  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    deliveryDate: "",
    deliveryTime: "",
    paymentMethod: "",
  });

  const paymentMethods = [
    { value: "pix", label: "PIX" },
    { value: "dinheiro", label: "Dinheiro" },
    { value: "cartao_credito", label: "Cartão de Crédito" },
    { value: "cartao_debito", label: "Cartão de Débito" },
  ];

  const handleCheckout = async () => {
    if (isAuthenticated && user) {
      // Auto-fill form with user data
      setFormData({
        name: user.name,
        phone: "",
        address: "",
        deliveryDate: "",
        deliveryTime: "",
        paymentMethod: "",
      });
    }
    setShowCheckoutForm(true);
  };

  const handleSubmitOrder = async () => {
    if (!formData.name || !formData.phone) {
      return;
    }

    // Include delivery and payment info in the address field for WhatsApp message
    const deliveryInfo = `${formData.address}\n📅 Entrega: ${formData.deliveryDate} às ${formData.deliveryTime}\n💳 Pagamento: ${paymentMethods.find(p => p.value === formData.paymentMethod)?.label || formData.paymentMethod}`;

    const whatsappLink = await checkout(formData.name, formData.phone, deliveryInfo);

    if (whatsappLink) {
      // Redirect to WhatsApp
      window.open(whatsappLink, "_blank");
      setShowCheckoutForm(false);
      setFormData({ name: "", phone: "", address: "", deliveryDate: "", deliveryTime: "", paymentMethod: "" });
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-background/80 backdrop-blur-sm z-50 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        onClick={closeCart}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-card border-l border-border z-50 transform transition-transform duration-500 ease-out ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-primary" />
            <h2 className="font-display text-xl font-bold">
              {showCheckoutForm ? "Finalizar Pedido" : "Carrinho"}
            </h2>
          </div>
          <button
            onClick={() => {
              if (showCheckoutForm) {
                setShowCheckoutForm(false);
              } else {
                closeCart();
              }
            }}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Checkout Form */}
        {showCheckoutForm ? (
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Seu nome"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(00) 00000-0000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Endereço de entrega</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Rua, número, bairro, cidade"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="deliveryDate" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  Data da entrega *
                </Label>
                <Input
                  id="deliveryDate"
                  type="date"
                  value={formData.deliveryDate}
                  onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="bg-muted/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deliveryTime" className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  Horário *
                </Label>
                <Input
                  id="deliveryTime"
                  type="time"
                  value={formData.deliveryTime}
                  onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
                  className="bg-muted/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentMethod" className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-primary" />
                Forma de pagamento *
              </Label>
              <select
                id="paymentMethod"
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="w-full h-10 px-3 rounded-md border border-border bg-muted/50 text-foreground focus:border-primary focus:outline-none transition-colors"
              >
                <option value="">Selecione...</option>
                {paymentMethods.map((method) => (
                  <option key={method.value} value={method.value}>
                    {method.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-4 border-t border-border">
              <div className="flex justify-between items-center mb-4">
                <span className="text-muted-foreground">Total do pedido</span>
                <span className="font-display text-2xl font-bold text-gradient">
                  R$ {subtotal.toFixed(2)}
                </span>
              </div>

              <Button
                variant="neon"
                className="w-full"
                onClick={handleSubmitOrder}
                disabled={isCheckingOut || !formData.name || !formData.phone || !formData.deliveryDate || !formData.deliveryTime || !formData.paymentMethod}
              >
                {isCheckingOut ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Pagar via WhatsApp
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground mt-2">
                Você será redirecionado para o WhatsApp para combinar o pagamento
              </p>
            </div>
          </div>
        ) : (
          <>
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
                  Pagamento combinado via WhatsApp
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default CartSidebar;

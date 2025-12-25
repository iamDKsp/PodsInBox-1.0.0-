import React, { createContext, useContext, useState, ReactNode } from "react";
import { ordersApi } from "@/lib/api";
import { toast } from "sonner";

export interface CartItem {
  id: string;
  name: string;
  flavor: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  isCheckingOut: boolean;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  checkout: (customerName: string, customerEmail: string, address?: string) => Promise<string | null>;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const addItem = (newItem: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existingItem = prev.find((item) => item.id === newItem.id);
      if (existingItem) {
        return prev.map((item) =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...newItem, quantity: 1 }];
    });
    setIsOpen(true);
    toast.success("Produto adicionado ao carrinho!");
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((prev) => !prev);

  const checkout = async (customerName: string, customerEmail: string, address?: string): Promise<string | null> => {
    if (items.length === 0) {
      toast.error("Carrinho vazio");
      return null;
    }

    setIsCheckingOut(true);
    try {
      const orderData = {
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
        })),
        customerName,
        customerEmail,
        address,
      };

      const { whatsappLink } = await ordersApi.create(orderData);

      clearCart();
      closeCart();
      toast.success("Pedido criado! Redirecionando para WhatsApp...");

      return whatsappLink;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao criar pedido";
      toast.error(message);
      return null;
    } finally {
      setIsCheckingOut(false);
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        isCheckingOut,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        openCart,
        closeCart,
        toggleCart,
        checkout,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

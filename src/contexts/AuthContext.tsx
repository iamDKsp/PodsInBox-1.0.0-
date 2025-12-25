import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { authApi, getAuthToken, setAuthToken, removeAuthToken, ordersApi } from "@/lib/api";
import { toast } from "sonner";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "customer";
  avatar?: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  items: {
    productId: string;
    name: string;
    flavor: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  orders: Order[];
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  fetchOrders: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing token on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = getAuthToken();
      if (token) {
        try {
          const { user } = await authApi.getProfile();
          setUser(user);
        } catch {
          removeAuthToken();
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { user, token } = await authApi.login(email, password);
      setAuthToken(token);
      setUser(user);
      toast.success("Login realizado com sucesso!");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao fazer login";
      toast.error(message);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const { user, token } = await authApi.register(name, email, password);
      setAuthToken(token);
      setUser(user);
      toast.success("Conta criada com sucesso!");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao criar conta";
      toast.error(message);
      throw error;
    }
  };

  const logout = () => {
    removeAuthToken();
    setUser(null);
    setOrders([]);
    toast.success("Logout realizado");
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      const { user: updatedUser } = await authApi.updateProfile(data);
      setUser(updatedUser);
      toast.success("Perfil atualizado!");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao atualizar perfil";
      toast.error(message);
      throw error;
    }
  };

  const fetchOrders = async () => {
    try {
      const { orders } = await ordersApi.getMyOrders();
      setOrders(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        isLoading,
        orders,
        login,
        register,
        logout,
        updateProfile,
        fetchOrders,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

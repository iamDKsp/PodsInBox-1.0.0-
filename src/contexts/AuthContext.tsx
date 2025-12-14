import React, { createContext, useContext, useState, ReactNode } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Order {
  id: string;
  date: string;
  status: "pending" | "processing" | "shipped" | "delivered";
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  orders: Order[];
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock orders for demonstration
const mockOrders: Order[] = [
  {
    id: "ORD-001",
    date: "2024-01-15",
    status: "delivered",
    items: [
      { name: "Neon Grape", quantity: 2, price: 49.9 },
      { name: "Cyber Mint", quantity: 1, price: 54.9 },
    ],
    total: 154.7,
  },
  {
    id: "ORD-002",
    date: "2024-01-20",
    status: "shipped",
    items: [{ name: "Tropical Fusion", quantity: 3, price: 52.9 }],
    total: 158.7,
  },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [orders] = useState<Order[]>(mockOrders);

  const login = async (email: string, password: string) => {
    // TODO: Implement actual authentication with backend
    // Simulating API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Mock successful login
    setUser({
      id: "user-1",
      name: "Usuário Demo",
      email: email,
    });
  };

  const register = async (name: string, email: string, password: string) => {
    // TODO: Implement actual registration with backend
    // Simulating API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Mock successful registration
    setUser({
      id: "user-" + Date.now(),
      name: name,
      email: email,
    });
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (data: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...data });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        orders,
        login,
        register,
        logout,
        updateProfile,
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

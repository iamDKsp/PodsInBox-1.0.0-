import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Package, LogOut, Edit2, Save, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const Profile = () => {
  const { user, orders, logout, updateProfile, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [activeTab, setActiveTab] = useState<"profile" | "orders">("profile");

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-20" />
        <div className="text-center animate-scale-in">
          <User className="w-20 h-20 mx-auto text-muted-foreground/50 mb-4" />
          <h1 className="font-display text-2xl font-bold mb-4">Acesso Restrito</h1>
          <p className="text-muted-foreground mb-6">Faça login para acessar seu perfil.</p>
          <Link to="/login">
            <Button variant="neon">Entrar</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    updateProfile({ name });
    setIsEditing(false);
    toast({
      title: "Perfil atualizado!",
      description: "Suas informações foram salvas.",
    });
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    toast({
      title: "Até logo!",
      description: "Você saiu da sua conta.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-neon-green/20 text-neon-green";
      case "shipped":
        return "bg-secondary/20 text-secondary";
      case "processing":
        return "bg-neon-yellow/20 text-neon-yellow";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "delivered":
        return "Entregue";
      case "shipped":
        return "Enviado";
      case "processing":
        return "Processando";
      default:
        return "Pendente";
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 cyber-grid opacity-20" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[128px]" />

      <div className="container mx-auto max-w-4xl relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-slide-up">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Voltar</span>
          </Link>
          <Button variant="ghost" onClick={handleLogout} className="text-destructive hover:text-destructive">
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-display font-semibold transition-all ${
              activeTab === "profile"
                ? "bg-primary text-primary-foreground neon-box"
                : "glass hover:bg-muted"
            }`}
          >
            <User className="w-5 h-5" />
            Perfil
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-display font-semibold transition-all ${
              activeTab === "orders"
                ? "bg-primary text-primary-foreground neon-box"
                : "glass hover:bg-muted"
            }`}
          >
            <Package className="w-5 h-5" />
            Pedidos
          </button>
        </div>

        {/* Content */}
        {activeTab === "profile" ? (
          <div className="glass rounded-2xl p-8 gradient-border animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-bold">Minhas Informações</h2>
              {isEditing ? (
                <Button variant="neon" size="sm" onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar
                </Button>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Editar
                </Button>
              )}
            </div>

            <div className="flex items-center gap-6 mb-8">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary via-accent to-secondary flex items-center justify-center neon-box">
                <span className="font-display font-bold text-primary-foreground text-4xl">
                  {user?.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                {isEditing ? (
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="font-display text-xl font-bold mb-2 bg-muted/50"
                  />
                ) : (
                  <h3 className="font-display text-xl font-bold mb-1">{user?.name}</h3>
                )}
                <p className="text-muted-foreground">{user?.email}</p>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="p-4 rounded-xl bg-muted/30">
                <label className="text-sm text-muted-foreground">E-mail</label>
                <p className="font-body">{user?.email}</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/30">
                <label className="text-sm text-muted-foreground">Total de Pedidos</label>
                <p className="font-display font-bold text-xl">{orders.length}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-scale-in">
            {orders.length === 0 ? (
              <div className="glass rounded-2xl p-12 text-center">
                <Package className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="font-display text-xl font-bold mb-2">Nenhum pedido</h3>
                <p className="text-muted-foreground mb-4">Você ainda não fez nenhum pedido.</p>
                <Link to="/produtos">
                  <Button variant="neon">Ver Produtos</Button>
                </Link>
              </div>
            ) : (
              orders.map((order, index) => (
                <div
                  key={order.id}
                  className="glass rounded-2xl p-6 gradient-border animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-sm text-muted-foreground">Pedido</span>
                      <h3 className="font-display font-bold">{order.id}</h3>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {item.quantity}x {item.name}
                        </span>
                        <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-border">
                    <span className="text-sm text-muted-foreground">{order.date}</span>
                    <span className="font-display font-bold text-lg text-gradient">
                      R$ {order.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;

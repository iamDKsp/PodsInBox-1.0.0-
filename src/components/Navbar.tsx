import { useState } from "react";
import { Menu, X, ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { totalItems, openCart } = useCart();
  const { isAuthenticated, user } = useAuth();

  const navLinks = [
    { name: "Início", href: "/" },
    { name: "Produtos", href: "/produtos" },
    { name: "Sobre", href: "#sobre" },
    { name: "Contato", href: "#contato" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary via-accent to-secondary flex items-center justify-center neon-box group-hover:animate-pulse-neon transition-all">
              <span className="font-display font-bold text-primary-foreground text-lg">P</span>
            </div>
            <span className="font-display font-bold text-xl tracking-wider">
              <span className="text-gradient">PODS</span>
              <span className="text-foreground"> IN BOX</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              link.href.startsWith("/") ? (
                <Link
                  key={link.name}
                  to={link.href}
                  className="font-body text-lg font-medium text-muted-foreground hover:text-primary transition-colors duration-300 relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-300" />
                </Link>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  className="font-body text-lg font-medium text-muted-foreground hover:text-primary transition-colors duration-300 relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-300" />
                </a>
              )
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative" onClick={openCart}>
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent rounded-full text-xs flex items-center justify-center text-accent-foreground font-bold animate-scale-in">
                  {totalItems}
                </span>
              )}
            </Button>
            {isAuthenticated ? (
              <Link to="/perfil">
                <Button variant="outline" size="sm">
                  <User className="w-4 h-4 mr-2" />
                  {user?.name.split(" ")[0]}
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button variant="outline" size="sm">
                  <User className="w-4 h-4 mr-2" />
                  Entrar
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border/30 animate-slide-up">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                link.href.startsWith("/") ? (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="font-body text-lg font-medium text-muted-foreground hover:text-primary transition-colors px-2 py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                ) : (
                  <a
                    key={link.name}
                    href={link.href}
                    className="font-body text-lg font-medium text-muted-foreground hover:text-primary transition-colors px-2 py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </a>
                )
              ))}
              <div className="flex items-center gap-4 pt-4 border-t border-border/30">
                <Button variant="ghost" size="icon" className="relative" onClick={() => { openCart(); setIsOpen(false); }}>
                  <ShoppingCart className="w-5 h-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent rounded-full text-xs flex items-center justify-center text-accent-foreground font-bold">
                      {totalItems}
                    </span>
                  )}
                </Button>
                {isAuthenticated ? (
                  <Link to="/perfil" className="flex-1" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full">
                      <User className="w-4 h-4 mr-2" />
                      {user?.name.split(" ")[0]}
                    </Button>
                  </Link>
                ) : (
                  <Link to="/login" className="flex-1" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full">
                      <User className="w-4 h-4 mr-2" />
                      Entrar
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

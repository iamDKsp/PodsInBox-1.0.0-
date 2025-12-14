import { ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated Background */}
      <div className="absolute inset-0 cyber-grid opacity-30" />
      
      {/* Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-[128px] animate-pulse-neon" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/30 rounded-full blur-[128px] animate-pulse-neon" style={{ animationDelay: "1s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/20 rounded-full blur-[200px] animate-pulse-neon" style={{ animationDelay: "0.5s" }} />

      {/* Floating Geometric Shapes */}
      <div className="absolute top-20 right-20 w-4 h-4 border-2 border-primary rotate-45 animate-float" />
      <div className="absolute top-40 left-20 w-6 h-6 border-2 border-secondary rounded-full animate-float" style={{ animationDelay: "1s" }} />
      <div className="absolute bottom-40 right-40 w-8 h-8 border-2 border-accent animate-float" style={{ animationDelay: "2s" }} />
      <div className="absolute bottom-20 left-40 w-3 h-3 bg-neon-green rounded-full animate-float" style={{ animationDelay: "1.5s" }} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/30 mb-8 animate-slide-up">
            <Zap className="w-4 h-4 text-neon-yellow" />
            <span className="font-body text-sm text-muted-foreground">Nova coleção disponível</span>
          </div>

          {/* Main Heading */}
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <span className="text-foreground">ELEVE SUA</span>
            <br />
            <span className="text-gradient neon-text">EXPERIÊNCIA</span>
          </h1>

          {/* Subtitle */}
          <p className="font-body text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            Descubra a nova geração de pods premium. Design futurista, sabores exclusivos e tecnologia de ponta em cada tragada.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <Link to="/produtos">
              <Button variant="neon" size="lg" className="group">
                Explorar Produtos
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button variant="hero" size="lg">
              Ver Coleções
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 animate-slide-up" style={{ animationDelay: "0.4s" }}>
            {[
              { value: "50+", label: "Sabores" },
              { value: "10k+", label: "Clientes" },
              { value: "99%", label: "Satisfação" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-display text-3xl md:text-4xl font-bold text-gradient mb-2">
                  {stat.value}
                </div>
                <div className="font-body text-sm text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;

import { ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useParallax } from "@/hooks/useParallax";
import FloatingShape from "./FloatingShape";

const HeroSection = () => {
  const parallax = useParallax(0.08);

  const shapes = [
    { type: "diamond" as const, size: 16, color: "primary", position: { top: "80px", right: "80px" }, delay: 0, speed: 1.5 },
    { type: "circle" as const, size: 24, color: "secondary", position: { top: "160px", left: "80px" }, delay: 1, speed: 1.2 },
    { type: "square" as const, size: 32, color: "accent", position: { bottom: "160px", right: "160px" }, delay: 2, speed: 0.8 },
    { type: "circle" as const, size: 12, color: "neon-green", position: { bottom: "80px", left: "160px" }, delay: 1.5, speed: 2 },
    { type: "diamond" as const, size: 20, color: "secondary", position: { top: "300px", right: "200px" }, delay: 0.5, speed: 1.3 },
    { type: "square" as const, size: 14, color: "primary", position: { bottom: "300px", left: "100px" }, delay: 2.5, speed: 1.8 },
    { type: "circle" as const, size: 18, color: "accent", position: { top: "200px", left: "300px" }, delay: 1.8, speed: 1.1 },
    { type: "diamond" as const, size: 10, color: "neon-green", position: { bottom: "200px", right: "300px" }, delay: 0.8, speed: 2.2 },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20" style={{ perspective: "1000px" }}>
      {/* Animated Background */}
      <div className="absolute inset-0 cyber-grid opacity-30" />
      
      {/* Gradient Orbs with parallax */}
      <div 
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-[128px] animate-pulse-neon" 
        style={{ 
          transform: `translate3d(${parallax.x * 0.3}px, ${parallax.y * 0.3}px, 0)`,
          transition: "transform 0.2s ease-out"
        }}
      />
      <div 
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/30 rounded-full blur-[128px] animate-pulse-neon" 
        style={{ 
          animationDelay: "1s",
          transform: `translate3d(${-parallax.x * 0.4}px, ${parallax.y * 0.4}px, 0)`,
          transition: "transform 0.2s ease-out"
        }} 
      />
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/20 rounded-full blur-[200px] animate-pulse-neon" 
        style={{ 
          animationDelay: "0.5s",
          transform: `translate(-50%, -50%) translate3d(${parallax.x * 0.2}px, ${parallax.y * 0.2}px, 0)`,
          transition: "transform 0.2s ease-out"
        }} 
      />

      {/* Floating Geometric Shapes with 3D parallax */}
      {shapes.map((shape, index) => (
        <FloatingShape
          key={index}
          type={shape.type}
          size={shape.size}
          color={shape.color}
          position={shape.position}
          parallaxOffset={parallax}
          delay={shape.delay}
          speedMultiplier={shape.speed}
        />
      ))}

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

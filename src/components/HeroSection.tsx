import { useState, useEffect } from "react";
import { ArrowRight, Zap, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useParallax } from "@/hooks/useParallax";
import { useCountUp } from "@/hooks/useCountUp";
import FloatingShape from "./FloatingShape";
import RollingText from "./RollingText";

const HeroSection = () => {
  const parallax = useParallax(0.08);

  // Animated counters
  const sabores = useCountUp({ end: 23, duration: 2000, delay: 400, suffix: "+" });
  const clientes = useCountUp({ end: 100, duration: 2500, delay: 600, suffix: "+" });
  const garantia = useCountUp({ end: 100, duration: 2000, delay: 800, suffix: "%" });

  const shapes = [
    { type: "diamond" as const, size: 16, color: "primary", position: { top: "80px", right: "80px" }, delay: 0, speed: 1.5 },
    { type: "circle" as const, size: 24, color: "secondary", position: { top: "160px", left: "80px" }, delay: 1, speed: 1.2 },
    { type: "square" as const, size: 32, color: "accent", position: { bottom: "160px", right: "160px" }, delay: 2, speed: 0.8 },
    { type: "circle" as const, size: 12, color: "neon-green", position: { bottom: "80px", left: "160px" }, delay: 1.5, speed: 2 },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20" style={{ perspective: "1000px" }}>
      {/* Animated Background */}
      <div className="absolute inset-0 cyber-grid opacity-30" />

      {/* Gradient Orbs with parallax */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-[80px] animate-pulse-neon will-change-transform"
        style={{
          transform: `translate3d(${parallax.x * 0.3}px, ${parallax.y * 0.3}px, 0)`,
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/30 rounded-full blur-[80px] animate-pulse-neon will-change-transform"
        style={{
          animationDelay: "1s",
          transform: `translate3d(${-parallax.x * 0.4}px, ${parallax.y * 0.4}px, 0)`,
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/20 rounded-full blur-[120px] animate-pulse-neon will-change-transform"
        style={{
          animationDelay: "0.5s",
          transform: `translate(-50%, -50%) translate3d(${parallax.x * 0.2}px, ${parallax.y * 0.2}px, 0)`,
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
          {/* Badge - Now links to ICE KING featured product */}
          <Link to="/produtos?featured=ICE%20KING%2040K%20SUMMER%20EDITION">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-yellow-500/50 mb-8 animate-slide-up animate-golden-pulse cursor-pointer hover:border-yellow-500 transition-all group">
              <Crown className="w-4 h-4 text-yellow-500 group-hover:animate-pulse" />
              <span className="font-body text-sm text-yellow-500 font-medium">Novo ignite disponível</span>
            </div>
          </Link>

          {/* Main Heading */}
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <span className="text-foreground animate-neon-flicker">RECEBA EM</span>
            <br />
            <div className="h-[1.5em] flex items-center justify-center overflow-visible" style={{ transform: 'scale(1.4)', marginBottom: '-0.1em' }}>
              <RollingText
                texts={["30 MINUTOS", "40 MINUTOS", "60 MINUTOS"]}
                interval={2500}
                className="text-gradient-animated neon-text font-bold-display"
              />
            </div>
            {/* Neon Light Stick */}
            <div className="neon-stick" style={{ marginTop: '0.2em' }} />
          </h1>

          {/* Subtitle */}
          <p className="font-body text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            Descubra a melhor loja virtual de pods em bauru e região, entregas rapidas, promoções e sabores exclusivos.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <a
              href="https://wa.me/5514998364338?text=Quero%20mais%20informações%20sobre%20os%20pods"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button variant="neon" size="lg" className="group w-full">
                MENSAGEM WHATSAPP
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>
            <Link to="/produtos">
              <Button variant="hero" size="lg">
                Ver PODS
              </Button>
            </Link>
          </div>

          {/* Stats with Animated Counters */}
          <div className="grid grid-cols-3 gap-8 mt-16 animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <div className="text-center" ref={sabores.elementRef}>
              <div className="font-display text-3xl md:text-4xl font-bold text-gradient mb-2">
                {sabores.displayValue}
              </div>
              <div className="font-body text-sm text-muted-foreground uppercase tracking-wider">
                Sabores
              </div>
            </div>
            <div className="text-center" ref={clientes.elementRef}>
              <div className="font-display text-3xl md:text-4xl font-bold text-gradient mb-2">
                {clientes.displayValue}
              </div>
              <div className="font-body text-sm text-muted-foreground uppercase tracking-wider">
                Clientes
              </div>
            </div>
            <div className="text-center" ref={garantia.elementRef}>
              <div className="font-display text-3xl md:text-4xl font-bold text-gradient mb-2">
                {garantia.displayValue}
              </div>
              <div className="font-body text-sm text-muted-foreground uppercase tracking-wider">
                Garantido
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;

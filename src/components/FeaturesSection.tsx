import { Truck, Shield, CreditCard, Headphones } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Entrega Rápida",
    description: "Enviamos para todo Brasil em até 24h para capitais.",
    color: "primary",
  },
  {
    icon: Shield,
    title: "Garantia Total",
    description: "30 dias de garantia em todos os produtos.",
    color: "secondary",
  },
  {
    icon: CreditCard,
    title: "Pagamento Seguro",
    description: "Parcelamento em até 12x sem juros.",
    color: "accent",
  },
  {
    icon: Headphones,
    title: "Suporte 24/7",
    description: "Atendimento especializado via chat e WhatsApp.",
    color: "neon-green",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 relative">
      {/* Top Border */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={feature.title}
                className="group glass rounded-xl p-6 text-center hover:border-primary/50 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-${feature.color}/10 text-${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="w-7 h-7" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="font-body text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Border */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </section>
  );
};

export default FeaturesSection;

import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const WHATSAPP_GROUP_LINK = "https://chat.whatsapp.com/H1oYAoVqt988jtAialOyTf";

const NewsletterSection = () => {
  const handleJoinCommunity = () => {
    window.open(WHATSAPP_GROUP_LINK, "_blank");
  };

  return (
    <section className="py-24 relative overflow-hidden" id="contato">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-card/50 to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-green-500/10 rounded-full blur-[150px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          {/* WhatsApp Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 mb-6 shadow-lg shadow-green-500/30 animate-pulse">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>

          {/* Heading */}
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            <span className="text-foreground">Entre na Nossa </span>
            <span className="text-green-500">Comunidade</span>
          </h2>

          <p className="font-body text-lg text-muted-foreground mb-8">
            Junte-se ao nosso grupo no WhatsApp e fique por dentro de promoções exclusivas, lançamentos e novidades em primeira mão!
          </p>

          {/* WhatsApp Button */}
          <Button
            onClick={handleJoinCommunity}
            size="lg"
            className="h-14 px-8 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold text-lg shadow-lg shadow-green-500/30 transition-all hover:scale-105"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Entrar no Grupo
          </Button>

          {/* Note */}
          <p className="font-body text-xs text-muted-foreground mt-6">
            Clique para ser redirecionado ao nosso grupo oficial no WhatsApp.
          </p>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;

import { useState } from "react";
import { createPortal } from "react-dom";
import { X, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FlavorSelectorProps {
    isOpen: boolean;
    onClose: () => void;
    product: {
        id: string | number;
        name: string;
        price: number;
        image: string;
        flavors: string[];
    };
    onAddToCart: (flavor: string) => void;
}

const FlavorSelector = ({ isOpen, onClose, product, onAddToCart }: FlavorSelectorProps) => {
    const [selectedFlavor, setSelectedFlavor] = useState<string | null>(null);

    const handleAdd = () => {
        if (selectedFlavor) {
            onAddToCart(selectedFlavor);
            setSelectedFlavor(null);
            onClose();
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <>
            {/* Overlay */}
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    backdropFilter: 'blur(8px)',
                    zIndex: 9999,
                }}
                onClick={onClose}
            />

            {/* Modal */}
            <div
                style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '100%',
                    maxWidth: '28rem',
                    maxHeight: '90vh',
                    display: 'flex',
                    flexDirection: 'column',
                    zIndex: 10000,
                    margin: '0 auto',
                }}
                className="bg-card border border-border rounded-2xl overflow-hidden shadow-2xl mx-4"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border">
                    <h3 className="font-display text-lg font-bold">Escolha o Sabor</h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Product Info */}
                <div className="p-4 flex items-center gap-4 bg-muted/30">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div>
                        <h4 className="font-display font-bold">{product.name}</h4>
                        <p className="text-primary font-bold">R$ {product.price.toFixed(2)}</p>
                    </div>
                </div>

                {/* Flavors - Scrollable */}
                <div className="p-4 space-y-2 overflow-y-auto flex-1 min-h-0">
                    {product.flavors.map((flavor) => (
                        <button
                            key={flavor}
                            onClick={() => setSelectedFlavor(flavor)}
                            className={`w-full p-3 rounded-xl text-left transition-all ${selectedFlavor === flavor
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted/50 hover:bg-muted"
                                }`}
                        >
                            <span className="font-medium">{flavor}</span>
                        </button>
                    ))}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-border">
                    <Button
                        variant="neon"
                        className="w-full"
                        disabled={!selectedFlavor}
                        onClick={handleAdd}
                    >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Adicionar ao Carrinho
                    </Button>
                </div>
            </div>
        </>,
        document.body
    );
};

export default FlavorSelector;

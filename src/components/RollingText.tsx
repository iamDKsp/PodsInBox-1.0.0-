import { useState, useEffect, useMemo, useRef } from "react";

interface CharacterReelProps {
    currChar: string; // O caracter que deve ser mostrado no final (alvo)
    delay: number;
    className?: string;
    trigger: number;
}

const CharacterReel = ({ currChar, delay, className, trigger }: CharacterReelProps) => {
    // Estado para armazenar o caractere "visível" fixo na tela
    const [displayChar, setDisplayChar] = useState(currChar);
    // Estado para controlar se estamos animando
    const [isSpinning, setIsSpinning] = useState(false);

    // Guardar o caractere antigo para usar na fita de animação
    const [prevChar, setPrevChar] = useState(currChar);

    // Itens da fita: 1 (velho) + 15 (random) + 1 (novo)
    const ITEM_HEIGHT = 1.25;
    const spinChars = useMemo(() => "8523901476ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('').slice(0, 15), []);

    useEffect(() => {
        // Forçar animação sempre que o trigger mudar (quando o texto troca)
        setPrevChar(displayChar);
        setIsSpinning(true);
    }, [trigger]); // Animamos baseado no trigger, não apenas se o char mudou

    const handleAnimationEnd = () => {
        // 2. Quando a animação CSS termina:
        setDisplayChar(currChar); // Atualiza o estático para o novo
        setIsSpinning(false);     // Desliga a fita
    };

    return (
        <div
            className="relative overflow-hidden inline-block align-top"
            style={{
                height: `${ITEM_HEIGHT}em`,
                width: '0.6em',
                margin: '0 -0.08em',
                userSelect: 'none'
            }}
        >
            {/* 1. MODO ESTÁTICO: Mostra apenas o caractere atual (displayChar) */}
            {!isSpinning && (
                <div className={`flex items-center justify-center animate-char-idle ${className}`} style={{ height: `${ITEM_HEIGHT}em` }}>
                    {displayChar}
                </div>
            )}

            {/* 2. MODO ANIMAÇÃO: Mostra a fita rolando */}
            {isSpinning && (
                <div
                    className="flex flex-col items-center absolute left-0 right-0 top-0 animate-reel-slide"
                    style={{ animationDelay: `${delay}s` }}
                    onAnimationEnd={handleAnimationEnd}
                >
                    {/* Antigo (0) */}
                    <div className={`flex items-center justify-center ${className} opacity-60 blur-[1px]`} style={{ height: `${ITEM_HEIGHT}em` }}>
                        {prevChar}
                    </div>

                    {/* Random Chars (1..15) */}
                    {spinChars.map((c, i) => (
                        <div key={i} className={`flex items-center justify-center ${className} blur-[1.5px] opacity-80`} style={{ height: `${ITEM_HEIGHT}em` }}>
                            {c}
                        </div>
                    ))}

                    {/* Novo (16) - Alvo Final */}
                    <div className={`flex items-center justify-center ${className}`} style={{ height: `${ITEM_HEIGHT}em` }}>
                        {currChar}
                    </div>
                </div>
            )}
        </div>
    );
};

interface RollingTextProps {
    texts: string[];
    interval?: number;
    className?: string; // Espera classes como "text-gradient neon-text"
}

const RollingText = ({ texts, interval = 4500, className = "" }: RollingTextProps) => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % texts.length);
        }, interval); // O intervalo controla apenas a troca do texto alvo

        return () => clearInterval(timer);
    }, [texts.length, interval]);

    const currentText = texts[index];

    return (
        <div className="inline-flex items-center justify-center">
            {currentText.split("").map((char, i) => (
                <CharacterReel
                    key={i}
                    currChar={char}
                    delay={i * 0.05}
                    className={className}
                    trigger={index}
                />
            ))}
        </div>
    );
};

export default RollingText;

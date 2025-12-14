import { CSSProperties } from "react";

interface FloatingShapeProps {
  type: "square" | "circle" | "diamond";
  size: number;
  color: string;
  position: { top?: string; bottom?: string; left?: string; right?: string };
  parallaxOffset: { x: number; y: number; rotateX: number; rotateY: number };
  delay?: number;
  speedMultiplier?: number;
}

const FloatingShape = ({
  type,
  size,
  color,
  position,
  parallaxOffset,
  delay = 0,
  speedMultiplier = 1,
}: FloatingShapeProps) => {
  const baseStyles: CSSProperties = {
    ...position,
    width: size,
    height: size,
    animationDelay: `${delay}s`,
    transform: `
      translate3d(${parallaxOffset.x * speedMultiplier}px, ${parallaxOffset.y * speedMultiplier}px, 0)
      rotateX(${parallaxOffset.rotateX * speedMultiplier}deg)
      rotateY(${parallaxOffset.rotateY * speedMultiplier}deg)
      ${type === "diamond" ? "rotate(45deg)" : ""}
    `,
    transition: "transform 0.1s ease-out",
  };

  const shapeClasses = {
    square: "border-2",
    circle: "border-2 rounded-full",
    diamond: "border-2",
  };

  const colorClasses: Record<string, string> = {
    primary: "border-primary",
    secondary: "border-secondary",
    accent: "border-accent",
    "neon-green": "bg-neon-green rounded-full",
  };

  return (
    <div
      className={`absolute animate-float ${shapeClasses[type]} ${colorClasses[color]}`}
      style={baseStyles}
    />
  );
};

export default FloatingShape;

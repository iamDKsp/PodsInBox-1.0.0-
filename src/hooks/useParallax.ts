import { useState, useEffect, useCallback } from "react";

interface ParallaxPosition {
  x: number;
  y: number;
  rotateX: number;
  rotateY: number;
}

export const useParallax = (sensitivity: number = 0.05) => {
  const [position, setPosition] = useState<ParallaxPosition>({
    x: 0,
    y: 0,
    rotateX: 0,
    rotateY: 0,
  });

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;
    
    setPosition({
      x: scrollX * sensitivity,
      y: scrollY * sensitivity,
      rotateX: scrollY * sensitivity * 0.5,
      rotateY: scrollX * sensitivity * 0.5,
    });
  }, [sensitivity]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    const mouseX = (e.clientX - centerX) / centerX;
    const mouseY = (e.clientY - centerY) / centerY;
    
    setPosition(prev => ({
      ...prev,
      rotateX: mouseY * 15,
      rotateY: mouseX * 15,
    }));
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleScroll, handleMouseMove]);

  return position;
};

import { useState, useEffect, useCallback, useRef } from "react";

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

  const lastUpdate = useRef(0);
  const THROTTLE_MS = 50; // Limit updates to 20fps for parallax

  const handleScroll = useCallback(() => {
    const now = Date.now();
    if (now - lastUpdate.current < THROTTLE_MS) return;
    lastUpdate.current = now;

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
    const now = Date.now();
    if (now - lastUpdate.current < THROTTLE_MS) return;
    lastUpdate.current = now;

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
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleScroll, handleMouseMove]);

  return position;
};

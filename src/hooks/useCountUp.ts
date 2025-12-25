import { useState, useEffect, useRef } from "react";

interface UseCountUpOptions {
    end: number;
    duration?: number;
    delay?: number;
    suffix?: string;
    prefix?: string;
}

export const useCountUp = ({ end, duration = 2000, delay = 0, suffix = "", prefix = "" }: UseCountUpOptions) => {
    const [count, setCount] = useState(0);
    const [hasStarted, setHasStarted] = useState(false);
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !hasStarted) {
                    setHasStarted(true);
                }
            },
            { threshold: 0.1 }
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => observer.disconnect();
    }, [hasStarted]);

    useEffect(() => {
        if (!hasStarted) return;

        const timeout = setTimeout(() => {
            const startTime = Date.now();
            const startValue = 0;

            const animate = () => {
                const now = Date.now();
                const progress = Math.min((now - startTime) / duration, 1);

                // Easing function for smooth animation
                const easeOutQuad = (t: number) => t * (2 - t);
                const easedProgress = easeOutQuad(progress);

                const currentValue = Math.floor(startValue + (end - startValue) * easedProgress);
                setCount(currentValue);

                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };

            requestAnimationFrame(animate);
        }, delay);

        return () => clearTimeout(timeout);
    }, [hasStarted, end, duration, delay]);

    const displayValue = `${prefix}${count}${suffix}`;

    return { count, displayValue, elementRef };
};

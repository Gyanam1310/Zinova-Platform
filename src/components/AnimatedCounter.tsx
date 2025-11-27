import { useState, useEffect, useRef } from "react";

interface AnimatedCounterProps {
  target: number;
  suffix?: string;
  duration?: number;
}

const AnimatedCounter = ({ target, suffix = "", duration = 2000 }: AnimatedCounterProps) => {
  const [count, setCount] = useState(0);
  const counterRef = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => {
      if (counterRef.current) {
        observer.unobserve(counterRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let start: number | null = null;
    const increment = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const percentage = Math.min(progress / duration, 1);
      const value = Math.floor(percentage * target);
      
      setCount(value);
      
      if (progress < duration) {
        requestAnimationFrame(increment);
      }
    };
    
    requestAnimationFrame(increment);
  }, [target, duration, isVisible]);

  return (
    <span ref={counterRef} className="text-4xl md:text-5xl font-bold text-accent">
      {count.toLocaleString()}{suffix}
    </span>
  );
};

export default AnimatedCounter;
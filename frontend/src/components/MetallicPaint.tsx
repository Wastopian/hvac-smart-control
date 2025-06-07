import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

interface MetallicPaintProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  metallic?: number;
  roughness?: number;
}

const MetallicPaint: React.FC<MetallicPaintProps> = ({
  children,
  className = '',
  intensity = 0.8,
  metallic = 0.9,
  roughness = 0.1
}) => {
  const paintRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const element = paintRef.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      mouseRef.current = { x, y };
      
      gsap.to(element, {
        duration: 0.3,
        ease: "power2.out",
        '--mouse-x': `${x}%`,
        '--mouse-y': `${y}%`,
        '--intensity': intensity,
        '--metallic': metallic,
        '--roughness': roughness
      });
    };

    const handleMouseLeave = () => {
      gsap.to(element, {
        duration: 0.6,
        ease: "power2.out",
        '--intensity': 0,
      });
    };

    const handleMouseEnter = () => {
      gsap.to(element, {
        duration: 0.3,
        ease: "power2.out",
        '--intensity': intensity,
      });
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);
    element.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
      element.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [intensity, metallic, roughness]);

  return (
    <div
      ref={paintRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        '--mouse-x': '50%',
        '--mouse-y': '50%',
        '--intensity': 0,
        '--metallic': metallic,
        '--roughness': roughness,
      } as React.CSSProperties}
    >
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 mix-blend-overlay"
        style={{
          background: `radial-gradient(
            400px circle at var(--mouse-x) var(--mouse-y),
            rgba(255, 255, 255, calc(var(--intensity) * var(--metallic) * 0.3)),
            rgba(200, 200, 255, calc(var(--intensity) * var(--metallic) * 0.2)) 25%,
            rgba(150, 150, 200, calc(var(--intensity) * var(--metallic) * 0.1)) 50%,
            transparent 70%
          )`,
          opacity: 'var(--intensity)'
        }}
      />
      <div 
        className="absolute inset-0 pointer-events-none mix-blend-soft-light"
        style={{
          background: `linear-gradient(
            45deg,
            rgba(255, 255, 255, 0.1) 0%,
            transparent 20%,
            transparent 80%,
            rgba(255, 255, 255, 0.1) 100%
          )`,
          opacity: 'calc(var(--intensity) * (1 - var(--roughness)))'
        }}
      />
      <div 
        className="absolute inset-0 pointer-events-none mix-blend-screen blur-sm"
        style={{
          background: `radial-gradient(
            300px circle at var(--mouse-x) var(--mouse-y),
            rgba(255, 255, 255, calc(var(--intensity) * 0.4)),
            rgba(255, 255, 255, calc(var(--intensity) * 0.2)) 30%,
            transparent 60%
          )`
        }}
      />
      {children}
    </div>
  );
};

export default MetallicPaint; 
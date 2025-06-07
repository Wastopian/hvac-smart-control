import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface Orb {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
  direction: number;
}

interface FloatingOrbsProps {
  count?: number;
  colors?: string[];
  interactive?: boolean;
}

const FloatingOrbs: React.FC<FloatingOrbsProps> = ({
  count = 8,
  colors = [
    'rgba(59, 130, 246, 0.3)',
    'rgba(147, 51, 234, 0.3)',
    'rgba(236, 72, 153, 0.3)',
    'rgba(34, 197, 94, 0.3)',
  ],
  interactive = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [orbs, setOrbs] = useState<Orb[]>([]);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Generate initial orbs
  useEffect(() => {
    const generateOrbs = () => {
      const newOrbs: Orb[] = [];
      for (let i = 0; i < count; i++) {
        newOrbs.push({
          id: `orb-${i}`,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: Math.random() * 40 + 20,
          color: colors[Math.floor(Math.random() * colors.length)],
          speed: Math.random() * 2 + 0.5,
          direction: Math.random() * Math.PI * 2,
        });
      }
      setOrbs(newOrbs);
    };

    generateOrbs();
    window.addEventListener('resize', generateOrbs);
    return () => window.removeEventListener('resize', generateOrbs);
  }, [count, colors]);

  // Mouse tracking
  useEffect(() => {
    if (!interactive) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [interactive, mouseX, mouseY]);

  // Animation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setOrbs((prevOrbs) =>
        prevOrbs.map((orb) => {
          let newX = orb.x + Math.cos(orb.direction) * orb.speed;
          let newY = orb.y + Math.sin(orb.direction) * orb.speed;
          let newDirection = orb.direction;

          // Bounce off walls
          if (newX <= 0 || newX >= window.innerWidth) {
            newDirection = Math.PI - orb.direction;
            newX = Math.max(0, Math.min(window.innerWidth, newX));
          }
          if (newY <= 0 || newY >= window.innerHeight) {
            newDirection = -orb.direction;
            newY = Math.max(0, Math.min(window.innerHeight, newY));
          }

          return {
            ...orb,
            x: newX,
            y: newY,
            direction: newDirection,
          };
        })
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
    >
      {orbs.map((orb) => (
        <OrbComponent
          key={orb.id}
          orb={orb}
          mouseX={mouseX}
          mouseY={mouseY}
          interactive={interactive}
        />
      ))}
    </div>
  );
};

interface OrbComponentProps {
  orb: Orb;
  mouseX: any;
  mouseY: any;
  interactive: boolean;
}

const OrbComponent: React.FC<OrbComponentProps> = ({
  orb,
  mouseX,
  mouseY,
  interactive,
}) => {
  const x = useSpring(orb.x, { damping: 20, stiffness: 100 });
  const y = useSpring(orb.y, { damping: 20, stiffness: 100 });

  useEffect(() => {
    x.set(orb.x);
    y.set(orb.y);
  }, [orb.x, orb.y, x, y]);

  useEffect(() => {
    if (!interactive) return;

    const unsubscribe = mouseX.on('change', (latest: number) => {
      const currentX = x.get();
      const currentY = y.get();
      const currentMouseY = mouseY.get();
      
      const distance = Math.sqrt(
        Math.pow(latest - currentX, 2) + Math.pow(currentMouseY - currentY, 2)
      );

      if (distance < 100) {
        const repelStrength = (100 - distance) / 100;
        const angle = Math.atan2(currentY - currentMouseY, currentX - latest);
        const repelX = currentX + Math.cos(angle) * repelStrength * 20;
        const repelY = currentY + Math.sin(angle) * repelStrength * 20;
        
        x.set(repelX);
        y.set(repelY);
      }
    });

    return unsubscribe;
  }, [interactive, mouseX, mouseY, x, y]);

  return (
    <motion.div
      className="absolute rounded-full filter blur-sm"
      style={{
        x,
        y,
        width: orb.size,
        height: orb.size,
        background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
        transform: 'translate(-50%, -50%)',
      }}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.6, 0.8, 0.6],
      }}
      transition={{
        duration: 3 + Math.random() * 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
};

export default FloatingOrbs; 
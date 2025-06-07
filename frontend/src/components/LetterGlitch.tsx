import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface LetterGlitchProps {
  text: string;
  className?: string;
  glitchChars?: string;
  duration?: number;
  delay?: number;
  intensity?: number;
}

const LetterGlitch: React.FC<LetterGlitchProps> = ({
  text,
  className = '',
  glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?',
  duration = 0.05,
  delay = 0.02,
  intensity = 0.3
}) => {
  const [displayText, setDisplayText] = useState(text);
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const glitchText = () => {
    const chars = text.split('');
    const glitched = chars.map(char => {
      if (Math.random() < intensity && char !== ' ') {
        return glitchChars[Math.floor(Math.random() * glitchChars.length)];
      }
      return char;
    });
    setDisplayText(glitched.join(''));
  };

  const startGlitch = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    intervalRef.current = setInterval(() => {
      glitchText();
      setTimeout(() => {
        setDisplayText(text);
      }, duration * 1000);
    }, delay * 1000);
  };

  const stopGlitch = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setDisplayText(text);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseEnter = () => startGlitch();
    const handleMouseLeave = () => stopGlitch();

    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      stopGlitch();
    };
  }, [text, duration, delay, intensity]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative inline-block cursor-pointer ${className}`}
    >
      <span className="relative z-10 transition-all duration-75">
        {displayText}
      </span>
      <span 
        className="absolute top-0 left-0 text-red-500 opacity-60 z-0"
        style={{
          transform: 'translate(-1px, -1px)',
          filter: 'blur(0.5px)',
          mixBlendMode: 'multiply'
        }}
      >
        {displayText}
      </span>
      <span 
        className="absolute top-0 left-0 text-blue-500 opacity-60 z-0"
        style={{
          transform: 'translate(1px, 1px)',
          filter: 'blur(0.5px)',
          mixBlendMode: 'screen'
        }}
      >
        {displayText}
      </span>
    </div>
  );
};

export default LetterGlitch; 
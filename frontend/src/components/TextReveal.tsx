import React from 'react';
import { motion } from 'framer-motion';

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  glowColor?: string;
}

const TextReveal: React.FC<TextRevealProps> = ({
  text,
  className = '',
  delay = 0,
  duration = 0.05,
  glowColor = 'rgba(59, 130, 246, 0.5)',
}) => {
  const letters = text.split('');

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay,
        staggerChildren: duration,
      },
    },
  };

  const letterVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      rotateX: -90,
      filter: 'blur(10px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.6,
        ease: [0.215, 0.61, 0.355, 1],
      },
    },
  };

  const glowVariants = {
    hidden: {
      textShadow: 'none',
    },
    visible: {
      textShadow: [
        'none',
        `0 0 10px ${glowColor}`,
        `0 0 20px ${glowColor}`,
        `0 0 10px ${glowColor}`,
        'none',
      ],
      transition: {
        duration: 2,
        delay: letters.length * duration + 0.5,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <motion.div
      className={`inline-block ${className}`}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          className="inline-block"
          variants={letterVariants}
          style={{ perspective: '1000px' }}
        >
          <motion.span
            className="inline-block"
            variants={glowVariants}
          >
            {letter === ' ' ? '\u00A0' : letter}
          </motion.span>
        </motion.span>
      ))}
    </motion.div>
  );
};

export default TextReveal; 
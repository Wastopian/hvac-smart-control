// Utility for merging classes
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

// Temperature to color mapping
export function getTemperatureColor(temp: number): string {
  if (temp < 16) return 'from-cold-600 to-cold-400';
  if (temp < 20) return 'from-cold-500 to-cold-300';
  if (temp < 24) return 'from-primary-500 to-primary-300';
  if (temp < 28) return 'from-warm-500 to-warm-300';
  return 'from-hot-500 to-hot-300';
}

// Comfort score to color
export function getComfortColor(score: number): string {
  if (score >= 90) return 'text-comfort-excellent';
  if (score >= 75) return 'text-comfort-good';
  if (score >= 60) return 'text-comfort-moderate';
  if (score >= 40) return 'text-comfort-poor';
  return 'text-comfort-critical';
}

// Generate random position for floating elements
export function getRandomPosition() {
  return {
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2,
  };
}

// Temperature-based glow intensity
export function getGlowIntensity(temp: number, target: number): number {
  const diff = Math.abs(temp - target);
  return Math.max(0.3, 1 - diff / 10);
}

// Calculate airflow direction
export function getAirflowDirection(fromRoom: string, toRoom: string): string {
  // Simple hash-based direction for consistent flow
  const hash = fromRoom.charCodeAt(0) + toRoom.charCodeAt(0);
  const angle = (hash % 360);
  return `rotate(${angle}deg)`;
}

// Generate SVG path for airflow
export function generateAirflowPath(
  startX: number, 
  startY: number, 
  endX: number, 
  endY: number
): string {
  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2;
  const offset = 20;
  
  return `M ${startX} ${startY} Q ${midX + offset} ${midY - offset} ${endX} ${endY}`;
}

// Create particle system configuration
export function generateParticles(count: number = 20) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    ...getRandomPosition(),
    size: Math.random() * 4 + 1,
    speed: Math.random() * 2 + 1,
    opacity: Math.random() * 0.5 + 0.3,
  }));
}

// Animate value changes
export function createValueAnimator(
  startValue: number,
  endValue: number,
  duration: number = 1000
) {
  return new Promise<number>((resolve) => {
    const startTime = Date.now();
    const difference = endValue - startValue;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (difference * easeOutCubic);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        resolve(endValue);
      }
    };
    
    animate();
  });
}

// Device status to animation
export function getDeviceAnimation(status: string): string {
  switch (status) {
    case 'online':
      return 'animate-pulse-slow';
    case 'offline':
      return 'animate-none opacity-50';
    case 'warning':
      return 'animate-glow';
    case 'error':
      return 'animate-pulse text-red-500';
    default:
      return 'animate-breathe';
  }
}

// Room type to visual style
export function getRoomStyle(roomType: string = 'default') {
  const styles = {
    living: 'from-blue-100 to-blue-200 dark:from-blue-900/20 dark:to-blue-800/20',
    bedroom: 'from-purple-100 to-purple-200 dark:from-purple-900/20 dark:to-purple-800/20',
    kitchen: 'from-orange-100 to-orange-200 dark:from-orange-900/20 dark:to-orange-800/20',
    bathroom: 'from-cyan-100 to-cyan-200 dark:from-cyan-900/20 dark:to-cyan-800/20',
    office: 'from-green-100 to-green-200 dark:from-green-900/20 dark:to-green-800/20',
    default: 'from-gray-100 to-gray-200 dark:from-gray-900/20 dark:to-gray-800/20',
  };
  
  return styles[roomType as keyof typeof styles] || styles.default;
}

// Create morphing blob shape
export function createBlobPath(variance: number = 10): string {
  const points = 8;
  const angleStep = (Math.PI * 2) / points;
  let path = '';
  
  for (let i = 0; i <= points; i++) {
    const angle = i * angleStep;
    const radius = 50 + Math.sin(angle * 3) * variance;
    const x = 50 + Math.cos(angle) * radius;
    const y = 50 + Math.sin(angle) * radius;
    
    if (i === 0) {
      path += `M ${x} ${y}`;
    } else {
      path += ` L ${x} ${y}`;
    }
  }
  
  return path + ' Z';
} 
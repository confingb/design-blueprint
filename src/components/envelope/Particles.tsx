import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface ParticlesProps {
  primaryColor: string;
  count?: number;
}

export const Particles = ({ primaryColor, count = 30 }: ParticlesProps) => {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 2 + Math.random() * 2,
      size: 4 + Math.random() * 8,
      type: Math.random() > 0.5 ? 'circle' : 'petal',
    }));
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute"
          initial={{
            x: `${particle.x}vw`,
            y: '50vh',
            opacity: 0,
            scale: 0,
            rotate: 0,
          }}
          animate={{
            y: [null, '20vh', '-20vh'],
            opacity: [0, 1, 0],
            scale: [0, 1, 0.5],
            rotate: [0, 180, 360],
            x: `${particle.x + (Math.random() - 0.5) * 20}vw`,
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            ease: 'easeOut',
          }}
        >
          {particle.type === 'circle' ? (
            <div
              className="rounded-full"
              style={{
                width: particle.size,
                height: particle.size,
                backgroundColor: primaryColor,
                opacity: 0.6,
                boxShadow: `0 0 ${particle.size}px ${primaryColor}`,
              }}
            />
          ) : (
            <svg
              width={particle.size * 2}
              height={particle.size * 2}
              viewBox="0 0 20 20"
            >
              <path
                d="M10 0C10 0 15 5 15 10C15 15 10 20 10 20C10 20 5 15 5 10C5 5 10 0 10 0Z"
                fill={primaryColor}
                opacity={0.5}
              />
            </svg>
          )}
        </motion.div>
      ))}

      {/* Golden sparkles */}
      {Array.from({ length: 15 }, (_, i) => (
        <motion.div
          key={`sparkle-${i}`}
          className="absolute w-1 h-1 rounded-full bg-amber-300"
          initial={{
            x: `${Math.random() * 100}vw`,
            y: '50vh',
            opacity: 0,
          }}
          animate={{
            y: [null, `${20 + Math.random() * 30}vh`],
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: 1.5 + Math.random(),
            delay: Math.random() * 0.8,
            ease: 'easeOut',
          }}
          style={{
            boxShadow: '0 0 6px #fbbf24, 0 0 12px #fbbf24',
          }}
        />
      ))}
    </div>
  );
};

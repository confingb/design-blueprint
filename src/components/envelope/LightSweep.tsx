import { motion } from 'framer-motion';

interface LightSweepProps {
  isActive: boolean;
  primaryColor: string;
}

export const LightSweep = ({ isActive, primaryColor }: LightSweepProps) => {
  if (!isActive) return null;

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Main light sweep */}
      <motion.div
        className="absolute w-[200%] h-full"
        style={{
          background: `linear-gradient(
            90deg,
            transparent 0%,
            transparent 30%,
            ${primaryColor}15 45%,
            ${primaryColor}30 50%,
            ${primaryColor}15 55%,
            transparent 70%,
            transparent 100%
          )`,
        }}
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{
          duration: 1.5,
          ease: 'easeInOut',
          delay: 0.2,
        }}
      />

      {/* Secondary sparkle layer */}
      <motion.div
        className="absolute w-full h-full"
        style={{
          background: `radial-gradient(
            circle at 50% 50%,
            ${primaryColor}20 0%,
            transparent 40%
          )`,
        }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ 
          opacity: [0, 1, 0],
          scale: [0.5, 1.5, 2],
        }}
        transition={{
          duration: 1.2,
          ease: 'easeOut',
          delay: 0.5,
        }}
      />
    </motion.div>
  );
};

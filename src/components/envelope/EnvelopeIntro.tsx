import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WaxSeal } from './WaxSeal';
import { Particles } from './Particles';
import { cn } from '@/lib/utils';

interface EnvelopeIntroProps {
  brideInitial: string;
  groomInitial: string;
  primaryColor: string;
  audioUrl?: string;
  onComplete: () => void;
}

export const EnvelopeIntro = ({
  brideInitial,
  groomInitial,
  primaryColor,
  audioUrl,
  onComplete,
}: EnvelopeIntroProps) => {
  const [isOpening, setIsOpening] = useState(false);
  const [sealBroken, setSealBroken] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleClick = () => {
    if (isOpening) return;

    // Start music if available
    if (audioUrl && audioRef.current) {
      audioRef.current.play().catch(console.error);
    }

    setIsOpening(true);
    setSealBroken(true);
    setShowParticles(true);

    // Complete animation after delay
    setTimeout(() => {
      onComplete();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-amber-50 to-amber-100 overflow-hidden">
      {/* Paper texture overlay */}
      <div 
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Audio element */}
      {audioUrl && <audio ref={audioRef} src={audioUrl} loop />}

      {/* Particles */}
      <AnimatePresence>
        {showParticles && <Particles primaryColor={primaryColor} />}
      </AnimatePresence>

      {/* Envelope container with 3D perspective */}
      <motion.div
        className="relative cursor-pointer"
        style={{ perspective: '1000px' }}
        onClick={handleClick}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        {/* Envelope body */}
        <motion.div
          className="relative w-[340px] h-[220px] md:w-[420px] md:h-[280px]"
          animate={isOpening ? { 
            y: 100,
            opacity: 0,
            scale: 0.8,
          } : {}}
          transition={{ duration: 1.2, delay: 0.8, ease: 'easeInOut' }}
        >
          {/* Back of envelope */}
          <div 
            className={cn(
              "absolute inset-0 rounded-sm",
              "bg-gradient-to-b from-amber-100 to-amber-200",
              "shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)]"
            )}
            style={{
              boxShadow: '0 20px 60px -15px rgba(0,0,0,0.3), inset 0 0 30px rgba(255,255,255,0.3)',
            }}
          />

          {/* Inner card visible when flap opens */}
          <motion.div
            className="absolute inset-2 bg-white rounded-sm flex items-center justify-center"
            style={{
              boxShadow: 'inset 0 0 20px rgba(0,0,0,0.05)',
            }}
            initial={{ opacity: 0 }}
            animate={isOpening ? { opacity: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <motion.p 
              className="text-xl md:text-2xl font-serif text-amber-800 text-center px-4"
              style={{ fontFamily: 'Playfair Display, serif' }}
              initial={{ opacity: 0, y: 10 }}
              animate={isOpening ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              Davetlisiniz
            </motion.p>
          </motion.div>

          {/* Bottom flap (front face of envelope) */}
          <div 
            className={cn(
              "absolute inset-0 rounded-sm",
              "bg-gradient-to-b from-amber-50 to-amber-100"
            )}
            style={{
              clipPath: 'polygon(0 40%, 50% 70%, 100% 40%, 100% 100%, 0 100%)',
              boxShadow: 'inset 0 -20px 30px rgba(0,0,0,0.05)',
            }}
          />

          {/* Left side fold line */}
          <div 
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, transparent 49.5%, rgba(0,0,0,0.03) 50%, transparent 50.5%)',
            }}
          />

          {/* Right side fold line */}
          <div 
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            style={{
              background: 'linear-gradient(-135deg, transparent 49.5%, rgba(0,0,0,0.03) 50%, transparent 50.5%)',
            }}
          />

          {/* Top flap with 3D rotation */}
          <motion.div
            className="absolute top-0 left-0 w-full"
            style={{
              height: '50%',
              transformOrigin: 'top center',
              transformStyle: 'preserve-3d',
            }}
            animate={isOpening ? { rotateX: 180 } : { rotateX: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          >
            {/* Front of flap (visible when closed) */}
            <div
              className={cn(
                "absolute inset-0",
                "bg-gradient-to-b from-amber-200 to-amber-100"
              )}
              style={{
                clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                backfaceVisibility: 'hidden',
                boxShadow: 'inset 0 -10px 20px rgba(0,0,0,0.05)',
              }}
            />

            {/* Back of flap (visible when open) */}
            <div
              className={cn(
                "absolute inset-0",
                "bg-gradient-to-t from-amber-50 to-amber-100"
              )}
              style={{
                clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                transform: 'rotateX(180deg)',
                backfaceVisibility: 'hidden',
              }}
            />

            {/* Wax seal */}
            <motion.div
              className="absolute left-1/2 -translate-x-1/2"
              style={{ bottom: '-20px' }}
              animate={sealBroken ? { 
                scale: [1, 1.2, 0],
                rotate: [0, 15, -15, 0],
                opacity: [1, 1, 0],
              } : {}}
              transition={{ duration: 0.5 }}
            >
              <WaxSeal
                brideInitial={brideInitial}
                groomInitial={groomInitial}
                primaryColor={primaryColor}
                size={60}
              />
            </motion.div>
          </motion.div>

          {/* Decorative border */}
          <div 
            className="absolute inset-0 border-2 border-amber-300/30 rounded-sm pointer-events-none"
          />
        </motion.div>

        {/* Click hint */}
        <AnimatePresence>
          {!isOpening && (
            <motion.p
              className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-amber-700/70 text-sm whitespace-nowrap"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              Açmak için tıklayın
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

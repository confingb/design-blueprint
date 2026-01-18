import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WaxSeal } from './WaxSeal';
import { Particles } from './Particles';
import { LightSweep } from './LightSweep';
import { useEnvelopeSounds } from '@/hooks/useEnvelopeSounds';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface EnvelopeIntroProps {
  brideInitial: string;
  groomInitial: string;
  primaryColor: string;
  audioUrl?: string;
  onComplete: () => void;
  canSkip?: boolean;
}

// Convert hex to HSL for theme-aware colors
const hexToHSL = (hex: string): { h: number; s: number; l: number } => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
};

// Generate theme-aware envelope colors
const getEnvelopeColors = (primaryColor: string) => {
  const hsl = hexToHSL(primaryColor);
  
  // Use primary hue but adjust for envelope tones
  const envelopeHue = hsl.h;
  
  return {
    gradientFrom: `hsl(${envelopeHue}, ${Math.min(hsl.s * 0.3, 30)}%, 95%)`,
    gradientTo: `hsl(${envelopeHue}, ${Math.min(hsl.s * 0.4, 35)}%, 88%)`,
    flapFrom: `hsl(${envelopeHue}, ${Math.min(hsl.s * 0.5, 40)}%, 85%)`,
    flapTo: `hsl(${envelopeHue}, ${Math.min(hsl.s * 0.3, 30)}%, 92%)`,
    shadow: `hsla(${envelopeHue}, ${Math.min(hsl.s * 0.5, 40)}%, 30%, 0.3)`,
    textColor: `hsl(${envelopeHue}, ${Math.min(hsl.s * 0.6, 50)}%, 25%)`,
    border: `hsla(${envelopeHue}, ${Math.min(hsl.s * 0.4, 35)}%, 70%, 0.4)`,
  };
};

export const EnvelopeIntro = ({
  brideInitial,
  groomInitial,
  primaryColor,
  audioUrl,
  onComplete,
  canSkip = false,
}: EnvelopeIntroProps) => {
  const [isOpening, setIsOpening] = useState(false);
  const [sealBroken, setSealBroken] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [showLightSweep, setShowLightSweep] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const { preloadSounds, playPaperSound, playWaxSound, triggerHaptic } = useEnvelopeSounds();
  
  const envelopeColors = getEnvelopeColors(primaryColor);

  // Preload sounds on mount
  useEffect(() => {
    preloadSounds();
  }, [preloadSounds]);

  const handleClick = () => {
    if (isOpening) return;

    // Play wax breaking sound and trigger haptic
    playWaxSound();
    triggerHaptic('heavy');

    // Start music if available
    if (audioUrl && audioRef.current) {
      audioRef.current.play().catch(console.error);
    }

    setIsOpening(true);
    setSealBroken(true);
    
    // Light sweep effect
    setTimeout(() => {
      setShowLightSweep(true);
      playPaperSound();
      triggerHaptic('medium');
    }, 300);
    
    // Particles after flap opens
    setTimeout(() => {
      setShowParticles(true);
      triggerHaptic('light');
    }, 600);

    // Complete animation after delay
    setTimeout(() => {
      onComplete();
    }, 2500);
  };

  const handleSkip = (e: React.MouseEvent) => {
    e.stopPropagation();
    onComplete();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{
        background: `linear-gradient(to bottom, ${envelopeColors.gradientFrom}, ${envelopeColors.gradientTo})`,
      }}
    >
      {/* Paper texture overlay */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Skip button */}
      <AnimatePresence>
        {canSkip && !isOpening && (
          <motion.button
            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/20 hover:bg-white/40 transition-colors"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleSkip}
            aria-label="Animasyonu atla"
          >
            <X className="w-5 h-5" style={{ color: envelopeColors.textColor }} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Audio element */}
      {audioUrl && <audio ref={audioRef} src={audioUrl} loop />}

      {/* Light sweep effect */}
      <AnimatePresence>
        {showLightSweep && <LightSweep isActive={showLightSweep} primaryColor={primaryColor} />}
      </AnimatePresence>

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
            className="absolute inset-0 rounded-sm"
            style={{
              background: `linear-gradient(to bottom, ${envelopeColors.gradientFrom}, ${envelopeColors.gradientTo})`,
              boxShadow: `0 20px 60px -15px ${envelopeColors.shadow}, inset 0 0 30px rgba(255,255,255,0.3)`,
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
              className="text-xl md:text-2xl font-serif text-center px-4"
              style={{ 
                fontFamily: 'Playfair Display, serif',
                color: envelopeColors.textColor,
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={isOpening ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              Davetlisiniz
            </motion.p>
          </motion.div>

          {/* Bottom flap (front face of envelope) */}
          <div 
            className="absolute inset-0 rounded-sm"
            style={{
              background: `linear-gradient(to bottom, ${envelopeColors.gradientFrom}, ${envelopeColors.flapTo})`,
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
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to bottom, ${envelopeColors.flapFrom}, ${envelopeColors.flapTo})`,
                clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                backfaceVisibility: 'hidden',
                boxShadow: 'inset 0 -10px 20px rgba(0,0,0,0.05)',
              }}
            />

            {/* Back of flap (visible when open) */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to top, ${envelopeColors.gradientFrom}, ${envelopeColors.flapTo})`,
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
            className="absolute inset-0 rounded-sm pointer-events-none"
            style={{
              border: `2px solid ${envelopeColors.border}`,
            }}
          />
        </motion.div>

        {/* Click hint */}
        <AnimatePresence>
          {!isOpening && (
            <motion.p
              className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-sm whitespace-nowrap"
              style={{ color: `${envelopeColors.textColor}99` }}
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

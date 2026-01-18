import { cn } from '@/lib/utils';

interface WaxSealProps {
  brideInitial: string;
  groomInitial: string;
  primaryColor: string;
  size?: number;
  className?: string;
}

export const WaxSeal = ({
  brideInitial,
  groomInitial,
  primaryColor,
  size = 80,
  className,
}: WaxSealProps) => {
  // Convert hex to rgba for gradients
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const darkerColor = `color-mix(in srgb, ${primaryColor} 70%, black)`;
  const lighterColor = `color-mix(in srgb, ${primaryColor} 80%, white)`;

  return (
    <div
      className={cn(
        "relative rounded-full flex items-center justify-center",
        "shadow-[0_4px_15px_rgba(0,0,0,0.3)]",
        className
      )}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 30% 30%, ${lighterColor}, ${primaryColor} 50%, ${darkerColor})`,
        boxShadow: `
          0 4px 15px rgba(0,0,0,0.3),
          inset 0 2px 4px ${hexToRgba(primaryColor, 0.5)},
          inset 0 -2px 4px rgba(0,0,0,0.2)
        `,
      }}
    >
      {/* Wax texture overlay */}
      <div 
        className="absolute inset-0 rounded-full opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Irregular edge effect */}
      <svg 
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
      >
        <defs>
          <filter id="waxEdge">
            <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" />
          </filter>
        </defs>
        <circle 
          cx="50" 
          cy="50" 
          r="48" 
          fill="none" 
          stroke={primaryColor} 
          strokeWidth="4"
          filter="url(#waxEdge)"
          opacity="0.3"
        />
      </svg>

      {/* Inner decorative ring */}
      <div 
        className="absolute rounded-full border-2"
        style={{
          width: size * 0.75,
          height: size * 0.75,
          borderColor: hexToRgba('#ffffff', 0.2),
        }}
      />

      {/* Initials */}
      <div 
        className="relative z-10 text-white font-serif tracking-wider"
        style={{
          fontSize: size * 0.28,
          textShadow: '0 1px 2px rgba(0,0,0,0.3)',
          fontFamily: 'Playfair Display, serif',
        }}
      >
        <span>{brideInitial}</span>
        <span className="mx-0.5 opacity-60">&</span>
        <span>{groomInitial}</span>
      </div>

      {/* Highlight */}
      <div 
        className="absolute rounded-full bg-white/20 blur-sm"
        style={{
          width: size * 0.2,
          height: size * 0.1,
          top: size * 0.15,
          left: size * 0.2,
          transform: 'rotate(-30deg)',
        }}
      />
    </div>
  );
};

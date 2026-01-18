import { ThemeTokens, BackgroundStyle, FontPreset } from '@/types/invite';

// Background color mappings
export const backgroundColors: Record<BackgroundStyle, { bg: string; text: string; muted: string }> = {
  ivory: {
    bg: 'hsl(45, 50%, 96%)',
    text: 'hsl(30, 30%, 20%)',
    muted: 'hsl(30, 20%, 50%)',
  },
  white: {
    bg: 'hsl(0, 0%, 100%)',
    text: 'hsl(0, 0%, 10%)',
    muted: 'hsl(0, 0%, 45%)',
  },
  blush: {
    bg: 'hsl(350, 30%, 95%)',
    text: 'hsl(350, 20%, 25%)',
    muted: 'hsl(350, 15%, 50%)',
  },
  dark: {
    bg: 'hsl(0, 0%, 8%)',
    text: 'hsl(0, 0%, 95%)',
    muted: 'hsl(0, 0%, 60%)',
  },
};

// Font family mappings
export const fontFamilies: Record<FontPreset, { heading: string; body: string }> = {
  serif: {
    heading: '"Playfair Display", Georgia, serif',
    body: '"Cormorant Garamond", Georgia, serif',
  },
  modern: {
    heading: '"Montserrat", system-ui, sans-serif',
    body: '"Open Sans", system-ui, sans-serif',
  },
  handwritten: {
    heading: '"Great Vibes", cursive',
    body: '"Lora", Georgia, serif',
  },
};

// Generate CSS variables from theme tokens
export const generateThemeStyles = (tokens: ThemeTokens): React.CSSProperties => {
  const bgStyle = backgroundColors[tokens.background];
  const fontStyle = fontFamilies[tokens.fontPreset];

  return {
    '--invite-primary': tokens.primaryColor,
    '--invite-bg': bgStyle.bg,
    '--invite-text': bgStyle.text,
    '--invite-muted': bgStyle.muted,
    '--invite-font-heading': fontStyle.heading,
    '--invite-font-body': fontStyle.body,
  } as React.CSSProperties;
};

// Generate Tailwind-compatible classes
export const getThemeClasses = (tokens: ThemeTokens) => {
  const bgClasses: Record<BackgroundStyle, string> = {
    ivory: 'bg-amber-50',
    white: 'bg-white',
    blush: 'bg-pink-50',
    dark: 'bg-zinc-900 text-white',
  };

  return {
    background: bgClasses[tokens.background],
    isDark: tokens.background === 'dark',
  };
};

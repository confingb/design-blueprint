import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { InviteData } from '@/types/invite';
import { generateThemeStyles, getThemeClasses } from '@/lib/theme';
import { cn } from '@/lib/utils';

interface BaseTemplateProps {
  invite: InviteData;
  children: ReactNode;
  className?: string;
}

export const BaseTemplate = ({ invite, children, className }: BaseTemplateProps) => {
  const themeStyles = generateThemeStyles(invite.themeTokens);
  const themeClasses = getThemeClasses(invite.themeTokens);

  return (
    <motion.div
      className={cn(
        'min-h-screen w-full',
        themeClasses.background,
        className
      )}
      style={themeStyles}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {children}
    </motion.div>
  );
};

// Shared section components for templates
export const InviteSection = ({ 
  children, 
  className 
}: { 
  children: ReactNode; 
  className?: string;
}) => (
  <motion.section
    className={cn('py-12 md:py-16 px-4 md:px-8', className)}
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{ duration: 0.6 }}
  >
    {children}
  </motion.section>
);

export const SectionTitle = ({ 
  children, 
  className 
}: { 
  children: ReactNode; 
  className?: string;
}) => (
  <h2
    className={cn(
      'text-2xl md:text-3xl text-center mb-8',
      className
    )}
    style={{ 
      fontFamily: 'var(--invite-font-heading)',
      color: 'var(--invite-text)',
    }}
  >
    {children}
  </h2>
);

export const Divider = ({ className }: { className?: string }) => (
  <div 
    className={cn('w-16 h-px mx-auto my-8', className)}
    style={{ backgroundColor: 'var(--invite-primary)' }}
  />
);

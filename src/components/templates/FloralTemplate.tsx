import { motion } from 'framer-motion';
import { MapPin, Clock, Calendar, Heart } from 'lucide-react';
import { InviteData } from '@/types/invite';
import { BaseTemplate, InviteSection, SectionTitle } from './BaseTemplate';
import { RSVPForm } from '@/components/rsvp/RSVPForm';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface FloralTemplateProps {
  invite: InviteData;
  showRSVP?: boolean;
}

export const FloralTemplate = ({ invite, showRSVP = true }: FloralTemplateProps) => {
  const eventDate = new Date(invite.eventDate);
  const formattedDate = format(eventDate, 'd MMMM yyyy', { locale: tr });

  return (
    <BaseTemplate invite={invite} className="overflow-x-hidden relative">
      {/* Decorative floral corners */}
      <div className="fixed top-0 left-0 w-48 h-48 opacity-20 pointer-events-none">
        <svg viewBox="0 0 200 200" className="w-full h-full" style={{ color: 'var(--invite-primary)' }}>
          <path
            d="M0,0 Q50,30 30,80 Q10,130 50,150 M0,0 Q30,50 80,30 Q130,10 150,50"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
          <circle cx="20" cy="20" r="8" fill="currentColor" opacity="0.5" />
          <circle cx="40" cy="50" r="5" fill="currentColor" opacity="0.3" />
          <circle cx="50" cy="30" r="6" fill="currentColor" opacity="0.4" />
        </svg>
      </div>
      <div className="fixed top-0 right-0 w-48 h-48 opacity-20 pointer-events-none transform scale-x-[-1]">
        <svg viewBox="0 0 200 200" className="w-full h-full" style={{ color: 'var(--invite-primary)' }}>
          <path
            d="M0,0 Q50,30 30,80 Q10,130 50,150 M0,0 Q30,50 80,30 Q130,10 150,50"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
          <circle cx="20" cy="20" r="8" fill="currentColor" opacity="0.5" />
          <circle cx="40" cy="50" r="5" fill="currentColor" opacity="0.3" />
        </svg>
      </div>

      {/* Hero Section */}
      <InviteSection className="min-h-screen flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {/* Decorative flower */}
          <motion.div
            className="mb-8"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <svg width="60" height="60" viewBox="0 0 60 60" style={{ color: 'var(--invite-primary)' }}>
              {[0, 60, 120, 180, 240, 300].map((angle) => (
                <ellipse
                  key={angle}
                  cx="30"
                  cy="30"
                  rx="12"
                  ry="20"
                  fill="currentColor"
                  opacity="0.3"
                  transform={`rotate(${angle} 30 30)`}
                />
              ))}
              <circle cx="30" cy="30" r="8" fill="currentColor" />
            </svg>
          </motion.div>

          <h1
            className="text-5xl md:text-7xl lg:text-8xl mb-4"
            style={{ fontFamily: 'var(--invite-font-heading)', color: 'var(--invite-text)' }}
          >
            {invite.brideName}
          </h1>
          
          <div className="flex items-center justify-center gap-4 my-4">
            <div className="w-12 h-px" style={{ backgroundColor: 'var(--invite-primary)' }} />
            <Heart className="w-5 h-5" style={{ color: 'var(--invite-primary)' }} fill="currentColor" />
            <div className="w-12 h-px" style={{ backgroundColor: 'var(--invite-primary)' }} />
          </div>
          
          <h1
            className="text-5xl md:text-7xl lg:text-8xl"
            style={{ fontFamily: 'var(--invite-font-heading)', color: 'var(--invite-text)' }}
          >
            {invite.groomName}
          </h1>

          <p
            className="mt-8 text-sm tracking-widest uppercase"
            style={{ color: 'var(--invite-muted)', fontFamily: 'var(--invite-font-body)' }}
          >
            Evleniyoruz
          </p>

          <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-6" style={{ fontFamily: 'var(--invite-font-body)' }}>
            <div className="flex items-center gap-2" style={{ color: 'var(--invite-text)' }}>
              <Calendar className="w-4 h-4" style={{ color: 'var(--invite-primary)' }} />
              <span>{formattedDate}</span>
            </div>
            <div className="hidden md:block w-1 h-1 rounded-full" style={{ backgroundColor: 'var(--invite-primary)' }} />
            <div className="flex items-center gap-2" style={{ color: 'var(--invite-text)' }}>
              <Clock className="w-4 h-4" style={{ color: 'var(--invite-primary)' }} />
              <span>{invite.eventTime}</span>
            </div>
          </div>
        </motion.div>
      </InviteSection>

      {/* Story */}
      {invite.storyText && (
        <InviteSection className="max-w-2xl mx-auto text-center relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-16 h-32 opacity-10">
            <svg viewBox="0 0 50 100" style={{ color: 'var(--invite-primary)' }}>
              <path d="M25,0 Q40,25 25,50 Q10,75 25,100" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          <p
            className="text-lg md:text-xl leading-relaxed italic"
            style={{ fontFamily: 'var(--invite-font-body)', color: 'var(--invite-text)' }}
          >
            {invite.storyText}
          </p>
        </InviteSection>
      )}

      {/* Venue */}
      <InviteSection className="text-center">
        <SectionTitle>Mekan</SectionTitle>
        <div className="max-w-xl mx-auto">
          <h3
            className="text-2xl md:text-3xl mb-4"
            style={{ fontFamily: 'var(--invite-font-heading)', color: 'var(--invite-text)' }}
          >
            {invite.venueName}
          </h3>
          <p
            className="mb-8"
            style={{ fontFamily: 'var(--invite-font-body)', color: 'var(--invite-muted)' }}
          >
            {invite.venueAddress}
          </p>
          {invite.mapUrl && (
            <a
              href={invite.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full transition-opacity hover:opacity-80"
              style={{ 
                backgroundColor: 'var(--invite-primary)', 
                color: 'white',
                fontFamily: 'var(--invite-font-body)',
              }}
            >
              <MapPin className="w-4 h-4" />
              Yol Tarifi
            </a>
          )}
        </div>
      </InviteSection>

      {/* Schedule */}
      {invite.scheduleItems.length > 0 && (
        <InviteSection className="text-center">
          <SectionTitle>Program</SectionTitle>
          <div className="max-w-md mx-auto space-y-6">
            {invite.scheduleItems.map((item, index) => (
              <motion.div
                key={index}
                className="p-6 rounded-2xl"
                style={{ backgroundColor: 'rgba(255,255,255,0.5)' }}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <p className="text-sm mb-2" style={{ color: 'var(--invite-primary)' }}>
                  {item.time}
                </p>
                <h4
                  className="text-xl"
                  style={{ fontFamily: 'var(--invite-font-heading)', color: 'var(--invite-text)' }}
                >
                  {item.title}
                </h4>
                {item.note && (
                  <p className="text-sm mt-2" style={{ color: 'var(--invite-muted)' }}>
                    {item.note}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </InviteSection>
      )}

      {/* RSVP */}
      {showRSVP && invite.rsvpEnabled && invite.id && (
        <InviteSection className="pb-20 text-center">
          <SectionTitle>Katılım Bildir</SectionTitle>
          <div className="max-w-md mx-auto">
            <RSVPForm inviteId={invite.id} primaryColor={invite.themeTokens.primaryColor} />
          </div>
        </InviteSection>
      )}
    </BaseTemplate>
  );
};

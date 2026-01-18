import { motion } from 'framer-motion';
import { MapPin, Clock, Calendar, Heart } from 'lucide-react';
import { InviteData } from '@/types/invite';
import { BaseTemplate, InviteSection, SectionTitle, Divider } from './BaseTemplate';
import { RSVPForm } from '@/components/rsvp/RSVPForm';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface ClassicTemplateProps {
  invite: InviteData;
  showRSVP?: boolean;
}

export const ClassicTemplate = ({ invite, showRSVP = true }: ClassicTemplateProps) => {
  const eventDate = new Date(invite.eventDate);
  const formattedDate = format(eventDate, 'd MMMM yyyy', { locale: tr });

  return (
    <BaseTemplate invite={invite} className="overflow-x-hidden">
      {/* Hero Section */}
      <InviteSection className="min-h-screen flex flex-col items-center justify-center text-center relative">
        {/* Decorative corner ornaments */}
        <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 opacity-30" style={{ borderColor: 'var(--invite-primary)' }} />
        <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 opacity-30" style={{ borderColor: 'var(--invite-primary)' }} />
        <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 opacity-30" style={{ borderColor: 'var(--invite-primary)' }} />
        <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 opacity-30" style={{ borderColor: 'var(--invite-primary)' }} />

        <motion.p
          className="text-sm md:text-base tracking-[0.3em] uppercase mb-4"
          style={{ color: 'var(--invite-muted)', fontFamily: 'var(--invite-font-body)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Düğün Davetiyesi
        </motion.p>

        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h1
            className="text-4xl md:text-6xl lg:text-7xl leading-tight"
            style={{ fontFamily: 'var(--invite-font-heading)', color: 'var(--invite-text)' }}
          >
            {invite.brideName}
            <span className="block text-2xl md:text-3xl my-2" style={{ color: 'var(--invite-primary)' }}>
              &
            </span>
            {invite.groomName}
          </h1>
        </motion.div>

        <Divider className="my-8" />

        <motion.div
          className="flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center gap-2" style={{ color: 'var(--invite-text)' }}>
            <Calendar className="w-4 h-4" style={{ color: 'var(--invite-primary)' }} />
            <span style={{ fontFamily: 'var(--invite-font-body)' }}>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2" style={{ color: 'var(--invite-text)' }}>
            <Clock className="w-4 h-4" style={{ color: 'var(--invite-primary)' }} />
            <span style={{ fontFamily: 'var(--invite-font-body)' }}>{invite.eventTime}</span>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 rounded-full flex justify-center pt-2" style={{ borderColor: 'var(--invite-primary)' }}>
            <div className="w-1 h-2 rounded-full" style={{ backgroundColor: 'var(--invite-primary)' }} />
          </div>
        </motion.div>
      </InviteSection>

      {/* Story Section */}
      {invite.storyText && (
        <InviteSection className="max-w-2xl mx-auto text-center">
          <SectionTitle>Hikayemiz</SectionTitle>
          <p
            className="text-base md:text-lg leading-relaxed"
            style={{ fontFamily: 'var(--invite-font-body)', color: 'var(--invite-text)' }}
          >
            {invite.storyText}
          </p>
        </InviteSection>
      )}

      {/* Venue Section */}
      <InviteSection className="text-center">
        <SectionTitle>Mekan</SectionTitle>
        <div className="max-w-xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <MapPin className="w-5 h-5" style={{ color: 'var(--invite-primary)' }} />
            <h3
              className="text-xl md:text-2xl"
              style={{ fontFamily: 'var(--invite-font-heading)', color: 'var(--invite-text)' }}
            >
              {invite.venueName}
            </h3>
          </div>
          <p
            className="mb-6"
            style={{ fontFamily: 'var(--invite-font-body)', color: 'var(--invite-muted)' }}
          >
            {invite.venueAddress}
          </p>
          {invite.mapUrl && (
            <a
              href={invite.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-sm border-2 transition-colors hover:bg-opacity-10"
              style={{ 
                borderColor: 'var(--invite-primary)', 
                color: 'var(--invite-primary)',
                fontFamily: 'var(--invite-font-body)',
              }}
            >
              <MapPin className="w-4 h-4" />
              Haritada Görüntüle
            </a>
          )}
        </div>
      </InviteSection>

      {/* Schedule Section */}
      {invite.scheduleItems.length > 0 && (
        <InviteSection className="text-center">
          <SectionTitle>Program</SectionTitle>
          <div className="max-w-xl mx-auto space-y-6">
            {invite.scheduleItems.map((item, index) => (
              <motion.div
                key={index}
                className="flex items-start gap-4"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div
                  className="flex-shrink-0 w-20 text-right"
                  style={{ fontFamily: 'var(--invite-font-body)', color: 'var(--invite-primary)' }}
                >
                  {item.time}
                </div>
                <div className="flex-shrink-0 w-px h-12 relative" style={{ backgroundColor: 'var(--invite-primary)' }}>
                  <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
                    style={{ backgroundColor: 'var(--invite-primary)' }}
                  />
                </div>
                <div className="text-left">
                  <h4
                    className="text-lg"
                    style={{ fontFamily: 'var(--invite-font-heading)', color: 'var(--invite-text)' }}
                  >
                    {item.title}
                  </h4>
                  {item.note && (
                    <p
                      className="text-sm mt-1"
                      style={{ fontFamily: 'var(--invite-font-body)', color: 'var(--invite-muted)' }}
                    >
                      {item.note}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </InviteSection>
      )}

      {/* RSVP Section */}
      {showRSVP && invite.rsvpEnabled && invite.id && (
        <InviteSection className="text-center pb-20">
          <SectionTitle>Katılım Bildirimi</SectionTitle>
          <div className="max-w-md mx-auto">
            <RSVPForm inviteId={invite.id} primaryColor={invite.themeTokens.primaryColor} />
          </div>
        </InviteSection>
      )}

      {/* Footer */}
      <footer className="py-8 text-center" style={{ fontFamily: 'var(--invite-font-body)', color: 'var(--invite-muted)' }}>
        <Heart className="w-4 h-4 mx-auto mb-2" style={{ color: 'var(--invite-primary)' }} />
        <p className="text-sm">
          {invite.brideName} & {invite.groomName}
        </p>
      </footer>
    </BaseTemplate>
  );
};

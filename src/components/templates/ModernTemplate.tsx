import { motion } from 'framer-motion';
import { MapPin, Clock, Calendar, ArrowRight } from 'lucide-react';
import { InviteData } from '@/types/invite';
import { BaseTemplate, InviteSection } from './BaseTemplate';
import { RSVPForm } from '@/components/rsvp/RSVPForm';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface ModernTemplateProps {
  invite: InviteData;
  showRSVP?: boolean;
}

export const ModernTemplate = ({ invite, showRSVP = true }: ModernTemplateProps) => {
  const eventDate = new Date(invite.eventDate);
  const formattedDate = format(eventDate, 'd MMMM yyyy', { locale: tr });

  return (
    <BaseTemplate invite={invite} className="overflow-x-hidden">
      {/* Hero Section - Full screen split */}
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
        {/* Left side - Names */}
        <div className="flex flex-col justify-center px-8 md:px-16 py-20 lg:py-0">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p
              className="text-xs tracking-[0.4em] uppercase mb-8"
              style={{ color: 'var(--invite-muted)', fontFamily: 'var(--invite-font-body)' }}
            >
              Evleniyoruz
            </p>
            <h1
              className="text-5xl md:text-7xl lg:text-8xl font-light leading-none mb-4"
              style={{ fontFamily: 'var(--invite-font-heading)', color: 'var(--invite-text)' }}
            >
              {invite.brideName}
            </h1>
            <div
              className="text-4xl md:text-5xl font-light my-4"
              style={{ color: 'var(--invite-primary)' }}
            >
              &
            </div>
            <h1
              className="text-5xl md:text-7xl lg:text-8xl font-light leading-none"
              style={{ fontFamily: 'var(--invite-font-heading)', color: 'var(--invite-text)' }}
            >
              {invite.groomName}
            </h1>
          </motion.div>
        </div>

        {/* Right side - Date & Details */}
        <div
          className="flex flex-col justify-center px-8 md:px-16 py-20 lg:py-0"
          style={{ backgroundColor: 'var(--invite-primary)' }}
        >
          <motion.div
            className="text-white"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="space-y-8">
              <div>
                <p className="text-xs tracking-[0.3em] uppercase mb-2 opacity-70">Tarih</p>
                <p className="text-2xl md:text-3xl" style={{ fontFamily: 'var(--invite-font-heading)' }}>
                  {formattedDate}
                </p>
              </div>
              <div>
                <p className="text-xs tracking-[0.3em] uppercase mb-2 opacity-70">Saat</p>
                <p className="text-2xl md:text-3xl" style={{ fontFamily: 'var(--invite-font-heading)' }}>
                  {invite.eventTime}
                </p>
              </div>
              <div>
                <p className="text-xs tracking-[0.3em] uppercase mb-2 opacity-70">Mekan</p>
                <p className="text-2xl md:text-3xl" style={{ fontFamily: 'var(--invite-font-heading)' }}>
                  {invite.venueName}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Story Section */}
      {invite.storyText && (
        <InviteSection className="max-w-3xl mx-auto">
          <motion.p
            className="text-lg md:text-xl lg:text-2xl leading-relaxed text-center"
            style={{ fontFamily: 'var(--invite-font-body)', color: 'var(--invite-text)' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            "{invite.storyText}"
          </motion.p>
        </InviteSection>
      )}

      {/* Schedule Section */}
      {invite.scheduleItems.length > 0 && (
        <InviteSection>
          <h2
            className="text-xs tracking-[0.4em] uppercase text-center mb-12"
            style={{ color: 'var(--invite-muted)', fontFamily: 'var(--invite-font-body)' }}
          >
            Günün Programı
          </h2>
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {invite.scheduleItems.map((item, index) => (
              <motion.div
                key={index}
                className="flex items-start gap-4 p-6"
                style={{ borderLeft: `2px solid var(--invite-primary)` }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div>
                  <p
                    className="text-sm mb-1"
                    style={{ color: 'var(--invite-primary)', fontFamily: 'var(--invite-font-body)' }}
                  >
                    {item.time}
                  </p>
                  <h3
                    className="text-xl mb-2"
                    style={{ fontFamily: 'var(--invite-font-heading)', color: 'var(--invite-text)' }}
                  >
                    {item.title}
                  </h3>
                  {item.note && (
                    <p
                      className="text-sm"
                      style={{ color: 'var(--invite-muted)', fontFamily: 'var(--invite-font-body)' }}
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

      {/* Venue Section */}
      <InviteSection>
        <div className="max-w-2xl mx-auto text-center">
          <h2
            className="text-xs tracking-[0.4em] uppercase mb-8"
            style={{ color: 'var(--invite-muted)', fontFamily: 'var(--invite-font-body)' }}
          >
            Konum
          </h2>
          <h3
            className="text-3xl md:text-4xl mb-4"
            style={{ fontFamily: 'var(--invite-font-heading)', color: 'var(--invite-text)' }}
          >
            {invite.venueName}
          </h3>
          <p
            className="text-lg mb-8"
            style={{ color: 'var(--invite-muted)', fontFamily: 'var(--invite-font-body)' }}
          >
            {invite.venueAddress}
          </p>
          {invite.mapUrl && (
            <a
              href={invite.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm tracking-wider uppercase transition-opacity hover:opacity-70"
              style={{ color: 'var(--invite-primary)', fontFamily: 'var(--invite-font-body)' }}
            >
              Haritayı Aç <ArrowRight className="w-4 h-4" />
            </a>
          )}
        </div>
      </InviteSection>

      {/* RSVP Section */}
      {showRSVP && invite.rsvpEnabled && invite.id && (
        <InviteSection className="pb-20">
          <h2
            className="text-xs tracking-[0.4em] uppercase text-center mb-12"
            style={{ color: 'var(--invite-muted)', fontFamily: 'var(--invite-font-body)' }}
          >
            Katılım Bildirimi
          </h2>
          <div className="max-w-md mx-auto">
            <RSVPForm inviteId={invite.id} primaryColor={invite.themeTokens.primaryColor} />
          </div>
        </InviteSection>
      )}
    </BaseTemplate>
  );
};

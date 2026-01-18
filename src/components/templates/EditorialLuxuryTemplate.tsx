import { motion } from 'framer-motion';
import { MapPin, ArrowRight } from 'lucide-react';
import { InviteData } from '@/types/invite';
import { BaseTemplate, InviteSection } from './BaseTemplate';
import { RSVPForm } from '@/components/rsvp/RSVPForm';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface EditorialLuxuryTemplateProps {
  invite: InviteData;
  showRSVP?: boolean;
}

export const EditorialLuxuryTemplate = ({ invite, showRSVP = true }: EditorialLuxuryTemplateProps) => {
  const eventDate = new Date(invite.eventDate);
  const formattedDate = format(eventDate, 'd MMMM yyyy', { locale: tr });
  const day = format(eventDate, 'd');
  const month = format(eventDate, 'MMMM', { locale: tr });
  const year = format(eventDate, 'yyyy');

  return (
    <BaseTemplate invite={invite} className="overflow-x-hidden bg-zinc-900 text-white">
      {/* Hero Section - Magazine style */}
      <div className="min-h-screen relative flex flex-col">
        {/* Header */}
        <motion.header
          className="flex justify-between items-center px-6 md:px-12 py-6 border-b border-white/10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-xs tracking-[0.5em] uppercase">Düğün Davetiyesi</span>
          <span className="text-xs">{year}</span>
        </motion.header>

        {/* Main content */}
        <div className="flex-1 flex items-center justify-center px-6 md:px-12">
          <motion.div
            className="text-center max-w-4xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <h1
              className="text-7xl md:text-9xl lg:text-[12rem] font-light leading-none tracking-tight"
              style={{ fontFamily: 'var(--invite-font-heading)' }}
            >
              {invite.brideName}
            </h1>
            <div className="flex items-center justify-center gap-8 my-8">
              <div className="h-px flex-1 max-w-32 bg-white/30" />
              <span className="text-2xl md:text-4xl" style={{ color: 'var(--invite-primary)' }}>&</span>
              <div className="h-px flex-1 max-w-32 bg-white/30" />
            </div>
            <h1
              className="text-7xl md:text-9xl lg:text-[12rem] font-light leading-none tracking-tight"
              style={{ fontFamily: 'var(--invite-font-heading)' }}
            >
              {invite.groomName}
            </h1>
          </motion.div>
        </div>

        {/* Date bar at bottom */}
        <motion.div
          className="grid grid-cols-3 border-t border-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="p-6 md:p-8 text-center border-r border-white/10">
            <p className="text-5xl md:text-7xl font-light">{day}</p>
            <p className="text-xs tracking-widest uppercase mt-2 text-white/60">Gün</p>
          </div>
          <div className="p-6 md:p-8 text-center border-r border-white/10">
            <p className="text-xl md:text-2xl font-light">{month}</p>
            <p className="text-xs tracking-widest uppercase mt-2 text-white/60">Ay</p>
          </div>
          <div className="p-6 md:p-8 text-center">
            <p className="text-xl md:text-2xl font-light">{invite.eventTime}</p>
            <p className="text-xs tracking-widest uppercase mt-2 text-white/60">Saat</p>
          </div>
        </motion.div>
      </div>

      {/* Story Section */}
      {invite.storyText && (
        <InviteSection className="border-t border-white/10">
          <div className="max-w-3xl mx-auto">
            <p
              className="text-2xl md:text-3xl lg:text-4xl font-light leading-relaxed text-center text-white/80"
              style={{ fontFamily: 'var(--invite-font-heading)' }}
            >
              {invite.storyText}
            </p>
          </div>
        </InviteSection>
      )}

      {/* Venue Section - Editorial layout */}
      <InviteSection className="border-t border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div>
            <p className="text-xs tracking-[0.4em] uppercase text-white/40 mb-4">Mekan</p>
            <h2
              className="text-4xl md:text-5xl lg:text-6xl font-light mb-4"
              style={{ fontFamily: 'var(--invite-font-heading)' }}
            >
              {invite.venueName}
            </h2>
          </div>
          <div className="flex flex-col justify-end">
            <p className="text-lg text-white/60 mb-6">{invite.venueAddress}</p>
            {invite.mapUrl && (
              <a
                href={invite.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 text-sm tracking-wider uppercase transition-opacity hover:opacity-70 group"
              >
                <span>Haritayı Görüntüle</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            )}
          </div>
        </div>
      </InviteSection>

      {/* Schedule Section */}
      {invite.scheduleItems.length > 0 && (
        <InviteSection className="border-t border-white/10">
          <p className="text-xs tracking-[0.4em] uppercase text-white/40 mb-12 text-center">Program</p>
          <div className="max-w-2xl mx-auto space-y-0">
            {invite.scheduleItems.map((item, index) => (
              <motion.div
                key={index}
                className="grid grid-cols-3 py-6 border-b border-white/10"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-white/40">{item.time}</div>
                <div className="col-span-2">
                  <h4
                    className="text-xl font-light"
                    style={{ fontFamily: 'var(--invite-font-heading)' }}
                  >
                    {item.title}
                  </h4>
                  {item.note && (
                    <p className="text-sm text-white/40 mt-1">{item.note}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </InviteSection>
      )}

      {/* RSVP Section */}
      {showRSVP && invite.rsvpEnabled && invite.id && (
        <InviteSection className="border-t border-white/10 pb-20">
          <div className="max-w-md mx-auto text-center">
            <p className="text-xs tracking-[0.4em] uppercase text-white/40 mb-12">Katılım Bildirimi</p>
            <RSVPForm inviteId={invite.id} primaryColor={invite.themeTokens.primaryColor} isDark />
          </div>
        </InviteSection>
      )}

      {/* Footer */}
      <footer className="py-12 text-center border-t border-white/10">
        <p className="text-xs tracking-widest uppercase text-white/30">
          {invite.brideName} & {invite.groomName} — {year}
        </p>
      </footer>
    </BaseTemplate>
  );
};

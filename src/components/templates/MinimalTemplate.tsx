import { motion } from 'framer-motion';
import { MapPin, ArrowUpRight } from 'lucide-react';
import { InviteData } from '@/types/invite';
import { BaseTemplate, InviteSection } from './BaseTemplate';
import { RSVPForm } from '@/components/rsvp/RSVPForm';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface MinimalTemplateProps {
  invite: InviteData;
  showRSVP?: boolean;
}

export const MinimalTemplate = ({ invite, showRSVP = true }: MinimalTemplateProps) => {
  const eventDate = new Date(invite.eventDate);
  const formattedDate = format(eventDate, 'd MMMM yyyy', { locale: tr });
  const dayName = format(eventDate, 'EEEE', { locale: tr });

  return (
    <BaseTemplate invite={invite} className="overflow-x-hidden">
      {/* Hero Section */}
      <div className="min-h-screen flex flex-col justify-center items-center px-4 py-20">
        <motion.div
          className="text-center max-w-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <p
            className="text-sm tracking-widest uppercase mb-12"
            style={{ color: 'var(--invite-muted)', fontFamily: 'var(--invite-font-body)' }}
          >
            {dayName}
          </p>
          
          <h1
            className="text-6xl md:text-8xl lg:text-9xl font-light mb-4"
            style={{ fontFamily: 'var(--invite-font-heading)', color: 'var(--invite-text)' }}
          >
            {invite.brideName}
          </h1>
          
          <p
            className="text-lg my-6"
            style={{ color: 'var(--invite-muted)' }}
          >
            ve
          </p>
          
          <h1
            className="text-6xl md:text-8xl lg:text-9xl font-light mb-12"
            style={{ fontFamily: 'var(--invite-font-heading)', color: 'var(--invite-text)' }}
          >
            {invite.groomName}
          </h1>

          <div className="space-y-2" style={{ color: 'var(--invite-text)', fontFamily: 'var(--invite-font-body)' }}>
            <p className="text-lg">{formattedDate}</p>
            <p className="text-lg">{invite.eventTime}</p>
          </div>
        </motion.div>
      </div>

      {/* Minimal divider */}
      <div className="flex justify-center py-8">
        <div className="w-px h-20" style={{ backgroundColor: 'var(--invite-muted)', opacity: 0.3 }} />
      </div>

      {/* Story */}
      {invite.storyText && (
        <InviteSection className="max-w-xl mx-auto text-center">
          <p
            className="text-base leading-loose"
            style={{ fontFamily: 'var(--invite-font-body)', color: 'var(--invite-text)' }}
          >
            {invite.storyText}
          </p>
        </InviteSection>
      )}

      {/* Venue */}
      <InviteSection className="text-center">
        <p
          className="text-3xl md:text-4xl mb-4"
          style={{ fontFamily: 'var(--invite-font-heading)', color: 'var(--invite-text)' }}
        >
          {invite.venueName}
        </p>
        <p
          className="text-sm mb-8"
          style={{ color: 'var(--invite-muted)', fontFamily: 'var(--invite-font-body)' }}
        >
          {invite.venueAddress}
        </p>
        {invite.mapUrl && (
          <a
            href={invite.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm underline underline-offset-4 transition-opacity hover:opacity-70"
            style={{ color: 'var(--invite-text)', fontFamily: 'var(--invite-font-body)' }}
          >
            Harita <ArrowUpRight className="w-3 h-3" />
          </a>
        )}
      </InviteSection>

      {/* Schedule - Minimal list */}
      {invite.scheduleItems.length > 0 && (
        <InviteSection className="max-w-sm mx-auto">
          <div className="space-y-4">
            {invite.scheduleItems.map((item, index) => (
              <motion.div
                key={index}
                className="flex justify-between items-baseline py-2 border-b"
                style={{ borderColor: 'var(--invite-muted)', opacity: 0.2 }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <span style={{ fontFamily: 'var(--invite-font-body)', color: 'var(--invite-text)' }}>
                  {item.title}
                </span>
                <span
                  className="text-sm"
                  style={{ color: 'var(--invite-muted)', fontFamily: 'var(--invite-font-body)' }}
                >
                  {item.time}
                </span>
              </motion.div>
            ))}
          </div>
        </InviteSection>
      )}

      {/* RSVP */}
      {showRSVP && invite.rsvpEnabled && invite.id && (
        <InviteSection className="pb-20">
          <p
            className="text-center text-sm tracking-widest uppercase mb-8"
            style={{ color: 'var(--invite-muted)', fontFamily: 'var(--invite-font-body)' }}
          >
            RSVP
          </p>
          <div className="max-w-md mx-auto">
            <RSVPForm inviteId={invite.id} primaryColor={invite.themeTokens.primaryColor} />
          </div>
        </InviteSection>
      )}
    </BaseTemplate>
  );
};

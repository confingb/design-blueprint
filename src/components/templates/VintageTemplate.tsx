import { motion } from 'framer-motion';
import { MapPin, Clock, Calendar } from 'lucide-react';
import { InviteData } from '@/types/invite';
import { BaseTemplate, InviteSection, SectionTitle, Divider } from './BaseTemplate';
import { RSVPForm } from '@/components/rsvp/RSVPForm';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface VintageTemplateProps {
  invite: InviteData;
  showRSVP?: boolean;
}

export const VintageTemplate = ({ invite, showRSVP = true }: VintageTemplateProps) => {
  const eventDate = new Date(invite.eventDate);
  const formattedDate = format(eventDate, 'd MMMM yyyy', { locale: tr });
  const year = format(eventDate, 'yyyy');

  return (
    <BaseTemplate invite={invite} className="overflow-x-hidden">
      {/* Vintage paper texture overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Hero Section */}
      <InviteSection className="min-h-screen flex flex-col items-center justify-center text-center relative">
        {/* Vintage frame border */}
        <div
          className="absolute inset-8 md:inset-16 border-2 pointer-events-none"
          style={{ borderColor: 'var(--invite-primary)' }}
        >
          {/* Corner decorations */}
          {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((pos, i) => (
            <div
              key={i}
              className={`absolute ${pos} w-8 h-8`}
              style={{ backgroundColor: 'var(--invite-bg)' }}
            >
              <svg viewBox="0 0 32 32" className="w-full h-full" style={{ color: 'var(--invite-primary)' }}>
                <path
                  d="M0,16 Q16,16 16,0 M0,16 Q16,16 16,32 M16,0 Q16,16 32,16 M16,32 Q16,16 32,16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                />
              </svg>
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          {/* Year badge */}
          <div
            className="inline-block px-6 py-2 border mb-8"
            style={{ borderColor: 'var(--invite-primary)' }}
          >
            <span
              className="text-sm tracking-[0.5em]"
              style={{ color: 'var(--invite-primary)', fontFamily: 'var(--invite-font-body)' }}
            >
              {year}
            </span>
          </div>

          <p
            className="text-xs tracking-[0.4em] uppercase mb-6"
            style={{ color: 'var(--invite-muted)', fontFamily: 'var(--invite-font-body)' }}
          >
            Düğün Davetiyesi
          </p>

          <h1
            className="text-4xl md:text-6xl lg:text-7xl mb-2"
            style={{ fontFamily: 'var(--invite-font-heading)', color: 'var(--invite-text)' }}
          >
            {invite.brideName}
          </h1>
          
          {/* Ornamental ampersand */}
          <div className="my-4 flex items-center justify-center gap-4">
            <div className="w-20 h-px" style={{ backgroundColor: 'var(--invite-primary)' }} />
            <span
              className="text-3xl"
              style={{ fontFamily: 'var(--invite-font-heading)', color: 'var(--invite-primary)' }}
            >
              &
            </span>
            <div className="w-20 h-px" style={{ backgroundColor: 'var(--invite-primary)' }} />
          </div>
          
          <h1
            className="text-4xl md:text-6xl lg:text-7xl"
            style={{ fontFamily: 'var(--invite-font-heading)', color: 'var(--invite-text)' }}
          >
            {invite.groomName}
          </h1>

          <Divider className="my-12" />

          <div className="flex flex-col items-center gap-3" style={{ fontFamily: 'var(--invite-font-body)' }}>
            <div className="flex items-center gap-3" style={{ color: 'var(--invite-text)' }}>
              <Calendar className="w-4 h-4" style={{ color: 'var(--invite-primary)' }} />
              <span className="text-lg">{formattedDate}</span>
            </div>
            <div className="flex items-center gap-3" style={{ color: 'var(--invite-text)' }}>
              <Clock className="w-4 h-4" style={{ color: 'var(--invite-primary)' }} />
              <span className="text-lg">{invite.eventTime}</span>
            </div>
          </div>
        </motion.div>
      </InviteSection>

      {/* Story */}
      {invite.storyText && (
        <InviteSection className="max-w-2xl mx-auto text-center">
          <div className="relative">
            <span
              className="absolute -left-4 -top-4 text-6xl opacity-20"
              style={{ color: 'var(--invite-primary)', fontFamily: 'serif' }}
            >
              "
            </span>
            <p
              className="text-base md:text-lg leading-relaxed italic px-8"
              style={{ fontFamily: 'var(--invite-font-body)', color: 'var(--invite-text)' }}
            >
              {invite.storyText}
            </p>
            <span
              className="absolute -right-4 -bottom-4 text-6xl opacity-20"
              style={{ color: 'var(--invite-primary)', fontFamily: 'serif' }}
            >
              "
            </span>
          </div>
        </InviteSection>
      )}

      {/* Venue */}
      <InviteSection className="text-center">
        <SectionTitle>Mekan</SectionTitle>
        <div className="max-w-xl mx-auto">
          <h3
            className="text-2xl md:text-3xl mb-2"
            style={{ fontFamily: 'var(--invite-font-heading)', color: 'var(--invite-text)' }}
          >
            {invite.venueName}
          </h3>
          <p
            className="text-sm mb-8"
            style={{ fontFamily: 'var(--invite-font-body)', color: 'var(--invite-muted)' }}
          >
            {invite.venueAddress}
          </p>
          {invite.mapUrl && (
            <a
              href={invite.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2 border transition-colors"
              style={{ 
                borderColor: 'var(--invite-primary)', 
                color: 'var(--invite-primary)',
                fontFamily: 'var(--invite-font-body)',
              }}
            >
              <MapPin className="w-4 h-4" />
              Haritayı Görüntüle
            </a>
          )}
        </div>
      </InviteSection>

      {/* Schedule */}
      {invite.scheduleItems.length > 0 && (
        <InviteSection className="text-center">
          <SectionTitle>Günün Akışı</SectionTitle>
          <div className="max-w-lg mx-auto">
            {invite.scheduleItems.map((item, index) => (
              <motion.div
                key={index}
                className="flex items-center py-4 border-b"
                style={{ borderColor: 'rgba(139, 69, 19, 0.2)' }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-20 text-right pr-4" style={{ color: 'var(--invite-primary)' }}>
                  {item.time}
                </div>
                <div className="flex-1 text-left pl-4">
                  <h4
                    className="text-lg"
                    style={{ fontFamily: 'var(--invite-font-heading)', color: 'var(--invite-text)' }}
                  >
                    {item.title}
                  </h4>
                  {item.note && (
                    <p className="text-sm" style={{ color: 'var(--invite-muted)' }}>
                      {item.note}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </InviteSection>
      )}

      {/* RSVP */}
      {showRSVP && invite.rsvpEnabled && invite.id && (
        <InviteSection className="pb-20 text-center">
          <SectionTitle>Lütfen Bildirin</SectionTitle>
          <div className="max-w-md mx-auto">
            <RSVPForm inviteId={invite.id} primaryColor={invite.themeTokens.primaryColor} />
          </div>
        </InviteSection>
      )}
    </BaseTemplate>
  );
};

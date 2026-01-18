import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { InviteData, TemplateId, BackgroundStyle, FontPreset } from '@/types/invite';
import { EnvelopeIntro } from '@/components/envelope/EnvelopeIntro';
import { renderTemplate } from '@/components/templates';
import { MetaTags } from '@/components/seo/MetaTags';
import { CalendarLinks } from '@/components/share/CalendarLinks';
import { ShareButtons } from '@/components/share/ShareButtons';
import { InvitePreviewSkeleton } from '@/components/common/Skeleton';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { motion } from 'framer-motion';

const InvitePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [invite, setInvite] = useState<InviteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEnvelope, setShowEnvelope] = useState(true);

  useEffect(() => {
    const fetchInvite = async () => {
      if (!slug) return;

      const { data, error } = await supabase
        .from('invites')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .maybeSingle();

      if (error) {
        setError('Davetiye yüklenirken bir hata oluştu.');
        setLoading(false);
        return;
      }

      if (!data) {
        setError('Davetiye bulunamadı.');
        setLoading(false);
        return;
      }

      // Increment view count (fire and forget)
      supabase.rpc('increment_view_count', { invite_slug: slug }).then(() => {}).catch(() => {});

      const themeTokens = data.theme_tokens as { primaryColor?: string; background?: string; fontPreset?: string } || {};
      
      setInvite({
        id: data.id,
        slug: data.slug,
        templateId: data.template_id as TemplateId,
        published: data.published,
        brideName: data.bride_name,
        groomName: data.groom_name,
        brideInitial: data.bride_initial,
        groomInitial: data.groom_initial,
        eventDate: data.event_date,
        eventTime: data.event_time,
        venueName: data.venue_name,
        venueAddress: data.venue_address,
        mapUrl: data.map_url || undefined,
        scheduleItems: (data.schedule_items as Array<{ time: string; title: string; note?: string }>) || [],
        storyText: data.story_text || undefined,
        heroImageUrl: data.hero_image_url || undefined,
        audioUrl: data.audio_url || undefined,
        themeTokens: {
          primaryColor: themeTokens.primaryColor || '#B8860B',
          background: (themeTokens.background as BackgroundStyle) || 'ivory',
          fontPreset: (themeTokens.fontPreset as FontPreset) || 'serif',
        },
        rsvpEnabled: data.rsvp_enabled,
        rsvpDeadline: data.rsvp_deadline || undefined,
        viewCount: data.view_count || 0,
        skipEnvelope: data.skip_envelope || false,
      });
      
      // Skip envelope if configured
      if (data.skip_envelope) {
        setShowEnvelope(false);
      }
      
      setLoading(false);
    };

    fetchInvite();
  }, [slug]);

  if (loading) {
    return <InvitePreviewSkeleton />;
  }

  if (error || !invite) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <motion.div 
          className="text-center p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-serif text-amber-900 mb-2">Davetiye Bulunamadı</h1>
          <p className="text-amber-600">{error}</p>
        </motion.div>
      </div>
    );
  }

  const pageTitle = `${invite.brideName} & ${invite.groomName} - Düğün Daveti`;
  const pageDescription = `${invite.brideName} ve ${invite.groomName} sizi düğünlerine davet ediyor. ${invite.eventDate}`;
  const pageUrl = typeof window !== 'undefined' ? window.location.href : '';

  if (showEnvelope) {
    return (
      <ErrorBoundary>
        <MetaTags
          title={pageTitle}
          description={pageDescription}
          url={pageUrl}
          image={invite.heroImageUrl}
        />
        <EnvelopeIntro
          brideInitial={invite.brideInitial}
          groomInitial={invite.groomInitial}
          primaryColor={invite.themeTokens.primaryColor}
          audioUrl={invite.audioUrl}
          onComplete={() => setShowEnvelope(false)}
          canSkip={invite.skipEnvelope}
        />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <MetaTags
        title={pageTitle}
        description={pageDescription}
        url={pageUrl}
        image={invite.heroImageUrl}
      />
      
      {/* Floating share/calendar buttons */}
      <motion.div
        className="fixed bottom-6 right-6 z-40 flex flex-col gap-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <CalendarLinks
          eventTitle={`${invite.brideName} & ${invite.groomName} Düğünü`}
          eventDate={invite.eventDate}
          eventTime={invite.eventTime}
          venueName={invite.venueName}
          venueAddress={invite.venueAddress}
        />
        <ShareButtons
          url={pageUrl}
          title={pageTitle}
          description={pageDescription}
        />
      </motion.div>
      
      {renderTemplate(invite, true)}
    </ErrorBoundary>
  );
};

export default InvitePage;

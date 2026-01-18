import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { InviteData, TemplateId, BackgroundStyle, FontPreset } from '@/types/invite';
import { EnvelopeIntro } from '@/components/envelope/EnvelopeIntro';
import { renderTemplate } from '@/components/templates';
import { Loader2 } from 'lucide-react';

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
      });
      setLoading(false);
    };

    fetchInvite();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
      </div>
    );
  }

  if (error || !invite) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <div className="text-center">
          <h1 className="text-2xl font-serif text-amber-900 mb-2">Davetiye Bulunamadı</h1>
          <p className="text-amber-600">{error}</p>
        </div>
      </div>
    );
  }

  if (showEnvelope) {
    return (
      <EnvelopeIntro
        brideInitial={invite.brideInitial}
        groomInitial={invite.groomInitial}
        primaryColor={invite.themeTokens.primaryColor}
        audioUrl={invite.audioUrl}
        onComplete={() => setShowEnvelope(false)}
      />
    );
  }

  return renderTemplate(invite, true);
};

export default InvitePage;

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { InviteForm } from '@/components/admin/InviteForm';
import { InviteFormData, TemplateId, BackgroundStyle, FontPreset } from '@/types/invite';
import { Loader2 } from 'lucide-react';

const AdminInviteEdit = () => {
  const { id } = useParams<{ id: string }>();
  const [invite, setInvite] = useState<InviteFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchInvite = async () => {
      if (!id) return;

      const { data, error } = await supabase
        .from('invites')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        toast({ title: 'Hata', description: 'Davetiye bulunamadı.', variant: 'destructive' });
        navigate('/admin/invites');
        return;
      }

      const themeTokens = data.theme_tokens as { primaryColor?: string; background?: string; fontPreset?: string } || {};

      setInvite({
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
        mapUrl: data.map_url || '',
        scheduleItems: (data.schedule_items as Array<{ time: string; title: string; note?: string }>) || [],
        storyText: data.story_text || '',
        heroImageUrl: data.hero_image_url || '',
        audioUrl: data.audio_url || '',
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
  }, [id, navigate, toast]);

  const handleSubmit = async (data: InviteFormData) => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('invites').update({
        slug: data.slug,
        template_id: data.templateId,
        published: data.published,
        bride_name: data.brideName,
        groom_name: data.groomName,
        bride_initial: data.brideInitial,
        groom_initial: data.groomInitial,
        event_date: data.eventDate,
        event_time: data.eventTime,
        venue_name: data.venueName,
        venue_address: data.venueAddress,
        map_url: data.mapUrl || null,
        schedule_items: data.scheduleItems,
        story_text: data.storyText || null,
        hero_image_url: data.heroImageUrl || null,
        audio_url: data.audioUrl || null,
        theme_tokens: data.themeTokens,
        rsvp_enabled: data.rsvpEnabled,
      }).eq('id', id);

      if (error) throw error;

      toast({ title: 'Başarılı', description: 'Davetiye güncellendi.' });
      navigate('/admin/invites');
    } catch (error: any) {
      toast({
        title: 'Hata',
        description: error.message || 'Davetiye güncellenemedi.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
      </div>
    );
  }

  if (!invite) return null;

  return (
    <div>
      <h1 className="text-2xl font-serif text-gray-900 mb-8">Davetiye Düzenle</h1>
      <InviteForm defaultValues={invite} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
};

export default AdminInviteEdit;

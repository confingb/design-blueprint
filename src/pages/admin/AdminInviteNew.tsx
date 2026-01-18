import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { InviteForm } from '@/components/admin/InviteForm';
import { InviteFormData } from '@/types/invite';

const AdminInviteNew = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (data: InviteFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('invites').insert({
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
      });

      if (error) throw error;

      toast({ title: 'Başarılı', description: 'Davetiye oluşturuldu.' });
      navigate('/admin/invites');
    } catch (error: any) {
      toast({
        title: 'Hata',
        description: error.message || 'Davetiye oluşturulamadı.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-serif text-gray-900 mb-8">Yeni Davetiye Oluştur</h1>
      <InviteForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
};

export default AdminInviteNew;

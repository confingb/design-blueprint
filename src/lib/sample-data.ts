import { InviteData, TemplateId } from '@/types/invite';

// Sample invite data for demos
export const sampleInviteData: InviteData = {
  slug: 'demo',
  templateId: 'classic',
  published: true,
  brideName: 'Ayşe',
  groomName: 'Mehmet',
  brideInitial: 'A',
  groomInitial: 'M',
  eventDate: '2025-06-15',
  eventTime: '16:00',
  venueName: 'Çırağan Sarayı',
  venueAddress: 'Çırağan Cad. No:32, Beşiktaş, İstanbul',
  mapUrl: 'https://maps.google.com/?q=Ciragan+Palace',
  scheduleItems: [
    { time: '16:00', title: 'Nikah Töreni', note: 'Ana salonda gerçekleşecektir' },
    { time: '17:00', title: 'Kokteyl', note: 'Bahçede ikramlar' },
    { time: '19:00', title: 'Akşam Yemeği', note: 'Özel menü' },
    { time: '21:00', title: 'Müzik & Dans', note: 'DJ performansı' },
  ],
  storyText: 'İlk kez 5 yıl önce bir arkadaş toplantısında tanıştık. O andan itibaren hayatlarımız birbirine bağlandı ve şimdi bu özel günü sizinle paylaşmaktan mutluluk duyuyoruz.',
  heroImageUrl: undefined,
  audioUrl: undefined,
  themeTokens: {
    primaryColor: '#B8860B',
    background: 'ivory',
    fontPreset: 'serif',
  },
  rsvpEnabled: true,
};

// Get sample data with specific template
export const getSampleDataForTemplate = (templateId: TemplateId): InviteData => {
  const themeVariants: Record<TemplateId, Partial<InviteData['themeTokens']>> = {
    classic: { primaryColor: '#B8860B', background: 'ivory', fontPreset: 'serif' },
    modern: { primaryColor: '#1a1a1a', background: 'white', fontPreset: 'modern' },
    minimal: { primaryColor: '#666666', background: 'white', fontPreset: 'modern' },
    floral: { primaryColor: '#D4A5A5', background: 'blush', fontPreset: 'handwritten' },
    vintage: { primaryColor: '#8B4513', background: 'ivory', fontPreset: 'serif' },
    'editorial-luxury': { primaryColor: '#1a1a1a', background: 'dark', fontPreset: 'serif' },
  };

  return {
    ...sampleInviteData,
    templateId,
    themeTokens: {
      ...sampleInviteData.themeTokens,
      ...themeVariants[templateId],
    },
  };
};

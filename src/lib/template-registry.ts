import { TemplateInfo, TemplateId } from '@/types/invite';

export const templateRegistry: TemplateInfo[] = [
  {
    id: 'classic',
    name: 'Klasik',
    description: 'Geleneksel ve zarif, altın süslemelerle bezeli klasik düğün davetiyesi',
    previewImage: '/templates/classic-preview.jpg',
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Minimalist çizgiler ve çağdaş tipografi ile modern bir yaklaşım',
    previewImage: '/templates/modern-preview.jpg',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Ultra sade tasarım, tipografi odaklı temiz görünüm',
    previewImage: '/templates/minimal-preview.jpg',
  },
  {
    id: 'floral',
    name: 'Çiçekli',
    description: 'Romantik çiçek motifleri ve pastel tonlarla doğal güzellik',
    previewImage: '/templates/floral-preview.jpg',
  },
  {
    id: 'vintage',
    name: 'Vintage',
    description: 'Nostaljik dokular ve retro estetikle zamansız bir his',
    previewImage: '/templates/vintage-preview.jpg',
  },
  {
    id: 'editorial-luxury',
    name: 'Editorial Lüks',
    description: 'Dergi kalitesinde premium tasarım, sofistike ve göz alıcı',
    previewImage: '/templates/editorial-preview.jpg',
  },
];

export const getTemplateInfo = (id: TemplateId): TemplateInfo | undefined => {
  return templateRegistry.find((t) => t.id === id);
};

export const getTemplateById = (id: string): TemplateId => {
  const validIds: TemplateId[] = ['classic', 'modern', 'minimal', 'floral', 'vintage', 'editorial-luxury'];
  return validIds.includes(id as TemplateId) ? (id as TemplateId) : 'classic';
};

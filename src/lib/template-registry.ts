import { TemplateId } from '@/types/invite';

export type TemplateTag = 'popular' | 'new' | 'elegant' | 'romantic' | 'modern' | 'classic' | 'nature' | 'luxury';

export interface TemplateInfo {
  id: TemplateId;
  name: string;
  description: string;
  previewImage: string;
  tags: TemplateTag[];
  primaryColor: string; // Default primary color for this template
  features: string[];
}

export const templateRegistry: TemplateInfo[] = [
  {
    id: 'classic',
    name: 'Klasik',
    description: 'Geleneksel ve zarif, altın süslemelerle bezeli klasik düğün davetiyesi',
    previewImage: '/templates/classic-preview.jpg',
    tags: ['popular', 'classic', 'elegant'],
    primaryColor: '#B8860B',
    features: ['Altın süslemeler', 'Serif tipografi', 'Geleneksel düzen'],
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Minimalist çizgiler ve çağdaş tipografi ile modern bir yaklaşım',
    previewImage: '/templates/modern-preview.jpg',
    tags: ['modern', 'popular'],
    primaryColor: '#1a1a1a',
    features: ['Sans-serif font', 'Asimetrik düzen', 'Bold tipografi'],
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Ultra sade tasarım, tipografi odaklı temiz görünüm',
    previewImage: '/templates/minimal-preview.jpg',
    tags: ['modern', 'elegant'],
    primaryColor: '#2c3e50',
    features: ['Temiz çizgiler', 'Bol boşluk', 'Odaklı içerik'],
  },
  {
    id: 'floral',
    name: 'Çiçekli',
    description: 'Romantik çiçek motifleri ve pastel tonlarla doğal güzellik',
    previewImage: '/templates/floral-preview.jpg',
    tags: ['romantic', 'nature', 'popular'],
    primaryColor: '#d4a574',
    features: ['Çiçek motifleri', 'Pastel tonlar', 'Romantik atmosfer'],
  },
  {
    id: 'vintage',
    name: 'Vintage',
    description: 'Nostaljik dokular ve retro estetikle zamansız bir his',
    previewImage: '/templates/vintage-preview.jpg',
    tags: ['classic', 'elegant'],
    primaryColor: '#8B7355',
    features: ['Retro estetik', 'Dokulu arkaplan', 'Nostaljik detaylar'],
  },
  {
    id: 'editorial-luxury',
    name: 'Editorial Lüks',
    description: 'Dergi kalitesinde premium tasarım, sofistike ve göz alıcı',
    previewImage: '/templates/editorial-preview.jpg',
    tags: ['luxury', 'new', 'elegant'],
    primaryColor: '#1a1a1a',
    features: ['Dergi düzeni', 'Premium tipografi', 'Lüks detaylar'],
  },
];

export const allTags: { id: TemplateTag; label: string }[] = [
  { id: 'popular', label: 'Popüler' },
  { id: 'new', label: 'Yeni' },
  { id: 'elegant', label: 'Zarif' },
  { id: 'romantic', label: 'Romantik' },
  { id: 'modern', label: 'Modern' },
  { id: 'classic', label: 'Klasik' },
  { id: 'nature', label: 'Doğal' },
  { id: 'luxury', label: 'Lüks' },
];

export const getTemplateInfo = (id: TemplateId): TemplateInfo | undefined => {
  return templateRegistry.find((t) => t.id === id);
};

export const getTemplateById = (id: string): TemplateId => {
  const validIds: TemplateId[] = ['classic', 'modern', 'minimal', 'floral', 'vintage', 'editorial-luxury'];
  return validIds.includes(id as TemplateId) ? (id as TemplateId) : 'classic';
};

export const filterTemplatesByTag = (tag: TemplateTag | 'all'): TemplateInfo[] => {
  if (tag === 'all') return templateRegistry;
  return templateRegistry.filter((t) => t.tags.includes(tag));
};

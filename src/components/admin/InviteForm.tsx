import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { inviteFormSchema, InviteFormData, templateIds, backgroundStyles, fontPresets } from '@/types/invite';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Plus, Trash2 } from 'lucide-react';

interface InviteFormProps {
  defaultValues?: InviteFormData;
  onSubmit: (data: InviteFormData) => Promise<void>;
  isSubmitting: boolean;
}

export const InviteForm = ({ defaultValues, onSubmit, isSubmitting }: InviteFormProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<InviteFormData>({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: defaultValues || {
      slug: '',
      templateId: 'classic',
      published: false,
      brideName: '',
      groomName: '',
      brideInitial: '',
      groomInitial: '',
      eventDate: '',
      eventTime: '',
      venueName: '',
      venueAddress: '',
      mapUrl: '',
      scheduleItems: [],
      storyText: '',
      heroImageUrl: '',
      audioUrl: '',
      themeTokens: {
        primaryColor: '#B8860B',
        background: 'ivory',
        fontPreset: 'serif',
      },
      rsvpEnabled: true,
    },
  });

  const scheduleItems = watch('scheduleItems') || [];
  const themeTokens = watch('themeTokens');

  const addScheduleItem = () => {
    setValue('scheduleItems', [...scheduleItems, { time: '', title: '', note: '' }]);
  };

  const removeScheduleItem = (index: number) => {
    setValue('scheduleItems', scheduleItems.filter((_, i) => i !== index));
  };

  const templateLabels: Record<string, string> = {
    classic: 'Klasik',
    modern: 'Modern',
    minimal: 'Minimal',
    floral: 'Çiçekli',
    vintage: 'Vintage',
    'editorial-luxury': 'Editorial Lüks',
  };

  const backgroundLabels: Record<string, string> = {
    ivory: 'Fildişi',
    white: 'Beyaz',
    blush: 'Pembe',
    dark: 'Koyu',
  };

  const fontLabels: Record<string, string> = {
    serif: 'Serif (Klasik)',
    modern: 'Modern (Sans)',
    handwritten: 'El Yazısı',
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
      {/* Basic Info */}
      <div className="bg-white rounded-lg border p-6 space-y-4">
        <h2 className="text-lg font-medium">Temel Bilgiler</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="brideName">Gelin Adı</Label>
            <Input id="brideName" {...register('brideName')} />
            {errors.brideName && <p className="text-sm text-red-500">{errors.brideName.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="groomName">Damat Adı</Label>
            <Input id="groomName" {...register('groomName')} />
            {errors.groomName && <p className="text-sm text-red-500">{errors.groomName.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="brideInitial">Gelin Baş Harfi (Mühür)</Label>
            <Input id="brideInitial" {...register('brideInitial')} maxLength={1} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="groomInitial">Damat Baş Harfi (Mühür)</Label>
            <Input id="groomInitial" {...register('groomInitial')} maxLength={1} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">URL Slug</Label>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">/i/</span>
            <Input id="slug" {...register('slug')} placeholder="ayse-mehmet" />
          </div>
          {errors.slug && <p className="text-sm text-red-500">{errors.slug.message}</p>}
        </div>
      </div>

      {/* Event Info */}
      <div className="bg-white rounded-lg border p-6 space-y-4">
        <h2 className="text-lg font-medium">Etkinlik Bilgileri</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="eventDate">Tarih</Label>
            <Input id="eventDate" type="date" {...register('eventDate')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="eventTime">Saat</Label>
            <Input id="eventTime" type="time" {...register('eventTime')} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="venueName">Mekan Adı</Label>
          <Input id="venueName" {...register('venueName')} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="venueAddress">Adres</Label>
          <Textarea id="venueAddress" {...register('venueAddress')} rows={2} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="mapUrl">Harita URL (Opsiyonel)</Label>
          <Input id="mapUrl" {...register('mapUrl')} placeholder="https://maps.google.com/..." />
        </div>
      </div>

      {/* Template & Theme */}
      <div className="bg-white rounded-lg border p-6 space-y-4">
        <h2 className="text-lg font-medium">Şablon & Tema</h2>
        
        <div className="space-y-2">
          <Label>Şablon</Label>
          <Select value={watch('templateId')} onValueChange={(v) => setValue('templateId', v as any)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {templateIds.map((id) => (
                <SelectItem key={id} value={id}>{templateLabels[id]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Ana Renk</Label>
            <Input
              type="color"
              value={themeTokens.primaryColor}
              onChange={(e) => setValue('themeTokens.primaryColor', e.target.value)}
              className="h-10 p-1"
            />
          </div>
          <div className="space-y-2">
            <Label>Arka Plan</Label>
            <Select value={themeTokens.background} onValueChange={(v) => setValue('themeTokens.background', v as any)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {backgroundStyles.map((style) => (
                  <SelectItem key={style} value={style}>{backgroundLabels[style]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Yazı Tipi</Label>
            <Select value={themeTokens.fontPreset} onValueChange={(v) => setValue('themeTokens.fontPreset', v as any)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {fontPresets.map((preset) => (
                  <SelectItem key={preset} value={preset}>{fontLabels[preset]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Schedule */}
      <div className="bg-white rounded-lg border p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium">Program</h2>
          <Button type="button" variant="outline" size="sm" onClick={addScheduleItem}>
            <Plus className="w-4 h-4 mr-1" /> Ekle
          </Button>
        </div>
        
        {scheduleItems.map((_, index) => (
          <div key={index} className="flex gap-2 items-start">
            <Input
              placeholder="Saat"
              {...register(`scheduleItems.${index}.time`)}
              className="w-24"
            />
            <Input
              placeholder="Başlık"
              {...register(`scheduleItems.${index}.title`)}
              className="flex-1"
            />
            <Input
              placeholder="Not (opsiyonel)"
              {...register(`scheduleItems.${index}.note`)}
              className="flex-1"
            />
            <Button type="button" variant="ghost" size="sm" onClick={() => removeScheduleItem(index)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Additional */}
      <div className="bg-white rounded-lg border p-6 space-y-4">
        <h2 className="text-lg font-medium">Ek Bilgiler</h2>
        
        <div className="space-y-2">
          <Label htmlFor="storyText">Hikaye (Opsiyonel)</Label>
          <Textarea id="storyText" {...register('storyText')} rows={3} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="audioUrl">Müzik URL (Opsiyonel)</Label>
          <Input id="audioUrl" {...register('audioUrl')} placeholder="https://..." />
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white rounded-lg border p-6 space-y-4">
        <h2 className="text-lg font-medium">Ayarlar</h2>
        
        <div className="flex items-center justify-between">
          <div>
            <Label>Yayınla</Label>
            <p className="text-sm text-gray-500">Davetiyeyi herkese açık yap</p>
          </div>
          <Switch checked={watch('published')} onCheckedChange={(v) => setValue('published', v)} />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label>RSVP</Label>
            <p className="text-sm text-gray-500">Katılım formunu aktif et</p>
          </div>
          <Switch checked={watch('rsvpEnabled')} onCheckedChange={(v) => setValue('rsvpEnabled', v)} />
        </div>
      </div>

      <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Kaydediliyor...
          </>
        ) : (
          'Kaydet'
        )}
      </Button>
    </form>
  );
};

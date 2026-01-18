import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { rsvpSchema, RSVPFormData } from '@/types/invite';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Check, Loader2 } from 'lucide-react';

interface RSVPFormProps {
  inviteId: string;
  primaryColor: string;
  isDark?: boolean;
}

export const RSVPForm = ({ inviteId, primaryColor, isDark = false }: RSVPFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RSVPFormData>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: {
      attendanceStatus: 'attending',
      guestCount: 1,
    },
  });

  const attendanceStatus = watch('attendanceStatus');

  const onSubmit = async (data: RSVPFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('rsvps').insert({
        invite_id: inviteId,
        name: data.name,
        email: data.email,
        attendance_status: data.attendanceStatus,
        guest_count: data.guestCount,
        message: data.message || null,
      });

      if (error) throw error;

      setIsSubmitted(true);
      toast({
        title: 'Teşekkürler!',
        description: 'Katılım bildiriminiz alındı.',
      });
    } catch (error) {
      toast({
        title: 'Hata',
        description: 'Bir sorun oluştu. Lütfen tekrar deneyin.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-8">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: primaryColor }}
        >
          <Check className="w-8 h-8 text-white" />
        </div>
        <h3 className={`text-xl mb-2 ${isDark ? 'text-white' : ''}`}>Teşekkür Ederiz!</h3>
        <p className={isDark ? 'text-white/60' : 'text-muted-foreground'}>
          Katılım bildiriminiz başarıyla alındı.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name" className={isDark ? 'text-white' : ''}>
          Adınız Soyadınız
        </Label>
        <Input
          id="name"
          {...register('name')}
          className={isDark ? 'bg-white/10 border-white/20 text-white' : ''}
          placeholder="Adınız Soyadınız"
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className={isDark ? 'text-white' : ''}>
          E-posta
        </Label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          className={isDark ? 'bg-white/10 border-white/20 text-white' : ''}
          placeholder="ornek@email.com"
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-3">
        <Label className={isDark ? 'text-white' : ''}>Katılım Durumu</Label>
        <RadioGroup
          value={attendanceStatus}
          onValueChange={(value) => setValue('attendanceStatus', value as RSVPFormData['attendanceStatus'])}
          className="space-y-2"
        >
          {[
            { value: 'attending', label: 'Katılacağım' },
            { value: 'maybe', label: 'Belki' },
            { value: 'not_attending', label: 'Katılamayacağım' },
          ].map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem
                value={option.value}
                id={option.value}
                className={isDark ? 'border-white/40' : ''}
              />
              <Label htmlFor={option.value} className={isDark ? 'text-white' : ''}>
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {attendanceStatus !== 'not_attending' && (
        <div className="space-y-2">
          <Label htmlFor="guestCount" className={isDark ? 'text-white' : ''}>
            Kişi Sayısı
          </Label>
          <Input
            id="guestCount"
            type="number"
            min={1}
            max={10}
            {...register('guestCount', { valueAsNumber: true })}
            className={isDark ? 'bg-white/10 border-white/20 text-white' : ''}
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="message" className={isDark ? 'text-white' : ''}>
          Mesajınız (Opsiyonel)
        </Label>
        <Textarea
          id="message"
          {...register('message')}
          className={isDark ? 'bg-white/10 border-white/20 text-white' : ''}
          placeholder="Çift için bir mesaj bırakın..."
          rows={3}
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full"
        style={{ backgroundColor: primaryColor }}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Gönderiliyor...
          </>
        ) : (
          'Gönder'
        )}
      </Button>
    </form>
  );
};

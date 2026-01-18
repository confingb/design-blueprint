import { z } from 'zod';

// Template types
export const templateIds = ['classic', 'modern', 'minimal', 'floral', 'vintage', 'editorial-luxury'] as const;
export type TemplateId = typeof templateIds[number];

// Background styles
export const backgroundStyles = ['ivory', 'white', 'blush', 'dark'] as const;
export type BackgroundStyle = typeof backgroundStyles[number];

// Font presets
export const fontPresets = ['serif', 'modern', 'handwritten'] as const;
export type FontPreset = typeof fontPresets[number];

// Attendance status
export const attendanceStatuses = ['attending', 'maybe', 'not_attending'] as const;
export type AttendanceStatus = typeof attendanceStatuses[number];

// Schedule item schema
export const scheduleItemSchema = z.object({
  time: z.string(),
  title: z.string(),
  note: z.string().optional(),
});

export type ScheduleItem = z.infer<typeof scheduleItemSchema>;

// Theme tokens schema
export const themeTokensSchema = z.object({
  primaryColor: z.string().default('#B8860B'),
  background: z.enum(backgroundStyles).default('ivory'),
  fontPreset: z.enum(fontPresets).default('serif'),
});

export type ThemeTokens = z.infer<typeof themeTokensSchema>;

// Invite data schema (for templates)
export interface InviteData {
  id?: string;
  slug: string;
  templateId: TemplateId;
  published: boolean;
  brideName: string;
  groomName: string;
  brideInitial: string;
  groomInitial: string;
  eventDate: string;
  eventTime: string;
  venueName: string;
  venueAddress: string;
  mapUrl?: string;
  scheduleItems: ScheduleItem[];
  storyText?: string;
  heroImageUrl?: string;
  audioUrl?: string;
  themeTokens: ThemeTokens;
  rsvpEnabled: boolean;
  rsvpDeadline?: string;
  viewCount?: number;
  skipEnvelope?: boolean;
}

// RSVP schema
export const rsvpSchema = z.object({
  name: z.string().min(2, 'İsim en az 2 karakter olmalıdır'),
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  attendanceStatus: z.enum(attendanceStatuses),
  guestCount: z.number().min(1).max(10),
  message: z.string().optional(),
});

export type RSVPFormData = z.infer<typeof rsvpSchema>;

// Invite form schema for admin
export const inviteFormSchema = z.object({
  slug: z.string().min(3, 'URL en az 3 karakter olmalıdır').regex(/^[a-z0-9-]+$/, 'Sadece küçük harf, rakam ve tire kullanılabilir'),
  templateId: z.enum(templateIds),
  published: z.boolean(),
  brideName: z.string().min(2, 'Gelin adı gereklidir'),
  groomName: z.string().min(2, 'Damat adı gereklidir'),
  brideInitial: z.string().length(1, 'Tek karakter olmalıdır'),
  groomInitial: z.string().length(1, 'Tek karakter olmalıdır'),
  eventDate: z.string(),
  eventTime: z.string(),
  venueName: z.string().min(2, 'Mekan adı gereklidir'),
  venueAddress: z.string().min(5, 'Adres gereklidir'),
  mapUrl: z.string().url().optional().or(z.literal('')),
  scheduleItems: z.array(scheduleItemSchema),
  storyText: z.string().optional(),
  heroImageUrl: z.string().optional(),
  audioUrl: z.string().optional(),
  themeTokens: themeTokensSchema,
  rsvpEnabled: z.boolean(),
  rsvpDeadline: z.string().optional().or(z.literal('')),
  skipEnvelope: z.boolean().optional(),
});

export type InviteFormData = z.infer<typeof inviteFormSchema>;

// RSVP response type
export interface RSVPResponse {
  id: string;
  inviteId: string;
  name: string;
  email: string;
  attendanceStatus: AttendanceStatus;
  guestCount: number;
  message?: string;
  createdAt: string;
}

// Template info for registry (basic version for type compatibility)
export interface TemplateInfoBasic {
  id: TemplateId;
  name: string;
  description: string;
  previewImage: string;
}

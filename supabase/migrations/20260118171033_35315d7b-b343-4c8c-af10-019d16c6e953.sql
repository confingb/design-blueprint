-- Create enum for template types
CREATE TYPE public.template_type AS ENUM ('classic', 'modern', 'minimal', 'floral', 'vintage', 'editorial-luxury');

-- Create enum for background styles
CREATE TYPE public.background_style AS ENUM ('ivory', 'white', 'blush', 'dark');

-- Create enum for font presets
CREATE TYPE public.font_preset AS ENUM ('serif', 'modern', 'handwritten');

-- Create enum for attendance status
CREATE TYPE public.attendance_status AS ENUM ('attending', 'maybe', 'not_attending');

-- Create enum for app roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table for role management
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create invites table
CREATE TABLE public.invites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    template_id template_type NOT NULL DEFAULT 'classic',
    published BOOLEAN NOT NULL DEFAULT false,
    bride_name TEXT NOT NULL,
    groom_name TEXT NOT NULL,
    bride_initial TEXT NOT NULL DEFAULT 'G',
    groom_initial TEXT NOT NULL DEFAULT 'D',
    event_date DATE NOT NULL,
    event_time TIME NOT NULL,
    venue_name TEXT NOT NULL,
    venue_address TEXT NOT NULL,
    map_url TEXT,
    schedule_items JSONB DEFAULT '[]'::jsonb,
    story_text TEXT,
    hero_image_url TEXT,
    audio_url TEXT,
    theme_tokens JSONB DEFAULT '{"primaryColor": "#B8860B", "background": "ivory", "fontPreset": "serif"}'::jsonb,
    rsvp_enabled BOOLEAN NOT NULL DEFAULT true,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on invites
ALTER TABLE public.invites ENABLE ROW LEVEL SECURITY;

-- Create rsvps table
CREATE TABLE public.rsvps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invite_id UUID REFERENCES public.invites(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    attendance_status attendance_status NOT NULL DEFAULT 'attending',
    guest_count INTEGER NOT NULL DEFAULT 1,
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on rsvps
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id
          AND role = _role
    )
$$;

-- Create function to check if user is admin by email (for allowlist)
CREATE OR REPLACE FUNCTION public.is_admin_email(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM auth.users
        WHERE id = _user_id
          AND email = 'emrecan.bayrak42@gmail.com'
    )
$$;

-- Create function to auto-assign admin role on signup for allowed email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Auto-assign admin role if email matches allowlist
    IF NEW.email = 'emrecan.bayrak42@gmail.com' THEN
        INSERT INTO public.user_roles (user_id, role)
        VALUES (NEW.id, 'admin')
        ON CONFLICT (user_id, role) DO NOTHING;
    END IF;
    RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- Create trigger for invite timestamp updates
CREATE TRIGGER update_invites_updated_at
    BEFORE UPDATE ON public.invites
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
    ON public.user_roles
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

-- RLS Policies for invites
-- Public can read only published invites
CREATE POLICY "Anyone can view published invites"
    ON public.invites
    FOR SELECT
    USING (published = true);

-- Admin can view all invites
CREATE POLICY "Admins can view all invites"
    ON public.invites
    FOR SELECT
    TO authenticated
    USING (public.is_admin_email(auth.uid()));

-- Admin can insert invites
CREATE POLICY "Admins can create invites"
    ON public.invites
    FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin_email(auth.uid()));

-- Admin can update invites
CREATE POLICY "Admins can update invites"
    ON public.invites
    FOR UPDATE
    TO authenticated
    USING (public.is_admin_email(auth.uid()));

-- Admin can delete invites
CREATE POLICY "Admins can delete invites"
    ON public.invites
    FOR DELETE
    TO authenticated
    USING (public.is_admin_email(auth.uid()));

-- RLS Policies for rsvps
-- Public can insert RSVP for published invites
CREATE POLICY "Anyone can submit RSVP for published invites"
    ON public.rsvps
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.invites
            WHERE id = invite_id
              AND published = true
              AND rsvp_enabled = true
        )
    );

-- Admin can view all RSVPs
CREATE POLICY "Admins can view all rsvps"
    ON public.rsvps
    FOR SELECT
    TO authenticated
    USING (public.is_admin_email(auth.uid()));

-- Create storage bucket for invite assets
INSERT INTO storage.buckets (id, name, public)
VALUES ('invite-assets', 'invite-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for invite assets
CREATE POLICY "Anyone can view invite assets"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'invite-assets');

CREATE POLICY "Admins can upload invite assets"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'invite-assets' AND public.is_admin_email(auth.uid()));

CREATE POLICY "Admins can update invite assets"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (bucket_id = 'invite-assets' AND public.is_admin_email(auth.uid()));

CREATE POLICY "Admins can delete invite assets"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (bucket_id = 'invite-assets' AND public.is_admin_email(auth.uid()));
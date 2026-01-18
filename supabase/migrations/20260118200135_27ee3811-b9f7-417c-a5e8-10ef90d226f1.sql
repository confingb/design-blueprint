-- Add RSVP deadline and view analytics columns to invites table
ALTER TABLE public.invites 
ADD COLUMN IF NOT EXISTS rsvp_deadline date DEFAULT NULL,
ADD COLUMN IF NOT EXISTS view_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS skip_envelope boolean DEFAULT false;

-- Add index for analytics queries
CREATE INDEX IF NOT EXISTS idx_invites_view_count ON public.invites(view_count);

-- Create function to increment view count
CREATE OR REPLACE FUNCTION public.increment_view_count(invite_slug text)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
    UPDATE public.invites
    SET view_count = view_count + 1
    WHERE slug = invite_slug AND published = true;
$$;
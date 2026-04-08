
CREATE TABLE public.codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view codes" ON public.codes FOR SELECT USING (true);
CREATE POLICY "Anyone can insert codes" ON public.codes FOR INSERT WITH CHECK (true);

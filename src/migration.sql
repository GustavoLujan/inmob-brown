-- ============================================================
-- MIGRACIÓN SUPABASE — Inmobiliaria
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ============================================================

-- ── 1. Tabla de perfiles ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT,
  avatar_url  TEXT,
  role        TEXT NOT NULL DEFAULT 'agent',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trigger: crear perfil automáticamente al registrar un usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE(NEW.raw_user_meta_data->>'role', 'agent')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS en profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios pueden ver su propio perfil"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Usuarios pueden actualizar su propio perfil"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);


-- ── 2. Tabla de propiedades ──────────────────────────────────
CREATE TABLE IF NOT EXISTS public.properties (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  type        TEXT NOT NULL CHECK (type IN ('sale', 'rent')),
  price       NUMERIC NOT NULL,
  address     TEXT,
  description TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  images      TEXT[] NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS en properties
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Lectura pública (sitio público sin login)
CREATE POLICY "Lectura pública de propiedades"
  ON public.properties FOR SELECT
  USING (true);

-- Los agentes solo gestionan sus propias propiedades
CREATE POLICY "Agentes insertan sus propiedades"
  ON public.properties FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Agentes actualizan sus propiedades"
  ON public.properties FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Agentes eliminan sus propiedades"
  ON public.properties FOR DELETE
  USING (auth.uid() = user_id);


-- ── 3. Storage: bucket property-images ───────────────────────
-- Ejecutar desde SQL Editor (requiere extensión storage habilitada)

INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO NOTHING;

-- Política: subida solo para usuarios autenticados en su propia carpeta
CREATE POLICY "Agentes suben imágenes en su carpeta"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'property-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Política: eliminar solo sus propias imágenes
CREATE POLICY "Agentes eliminan sus imágenes"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'property-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Política: lectura pública de imágenes
CREATE POLICY "Lectura pública de imágenes"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'property-images');

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

// ── Claves de caché ──────────────────────────────────────────────
export const QUERY_KEYS = {
  allProperties: ['properties'],
  featuredProperties: ['properties', 'featured'],
  myProperties: (userId) => ['properties', 'mine', userId],
  property: (id) => ['properties', id],
}

// ── Queries públicas ─────────────────────────────────────────────

/** Todas las propiedades públicas, ordenadas por más recientes */
export function useAllProperties() {
  return useQuery({
    queryKey: QUERY_KEYS.allProperties,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
  })
}

/** Solo propiedades con is_featured = true */
export function useFeaturedProperties() {
  return useQuery({
    queryKey: QUERY_KEYS.featuredProperties,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
  })
}

/** Una propiedad por id */
export function useProperty(id) {
  return useQuery({
    queryKey: QUERY_KEYS.property(id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single()
      if (error) throw error
      return data
    },
    enabled: !!id,
  })
}

// ── Queries privadas (solo agente autenticado) ───────────────────

/** Propiedades del agente logueado */
export function useMyProperties(userId) {
  return useQuery({
    queryKey: QUERY_KEYS.myProperties(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
    enabled: !!userId,
  })
}

// ── Mutations ────────────────────────────────────────────────────

/** Crear propiedad */
export function useCreateProperty() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ propertyData, files, userId }) => {
      // 1. Insertar propiedad sin imágenes para obtener el id
      const { data: property, error: insertError } = await supabase
        .from('properties')
        .insert({ ...propertyData, user_id: userId, images: [] })
        .select()
        .single()
      if (insertError) throw insertError

      // 2. Subir imágenes si existen
      if (files && files.length > 0) {
        const urls = await uploadImages(files, userId, property.id)
        const { error: updateError } = await supabase
          .from('properties')
          .update({ images: urls })
          .eq('id', property.id)
        if (updateError) throw updateError
        return { ...property, images: urls }
      }

      return property
    },
    onSuccess: (_data, { userId }) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.myProperties(userId) })
      qc.invalidateQueries({ queryKey: QUERY_KEYS.allProperties })
      qc.invalidateQueries({ queryKey: QUERY_KEYS.featuredProperties })
    },
  })
}

/** Editar propiedad */
export function useUpdateProperty() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, propertyData, newFiles, userId, existingImages }) => {
      let images = existingImages ?? []

      // Subir nuevas imágenes si las hay
      if (newFiles && newFiles.length > 0) {
        const newUrls = await uploadImages(newFiles, userId, id)
        images = [...images, ...newUrls]
      }

      const { data, error } = await supabase
        .from('properties')
        .update({ ...propertyData, images })
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: (data, { userId }) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.myProperties(userId) })
      qc.invalidateQueries({ queryKey: QUERY_KEYS.property(data.id) })
      qc.invalidateQueries({ queryKey: QUERY_KEYS.allProperties })
      qc.invalidateQueries({ queryKey: QUERY_KEYS.featuredProperties })
    },
  })
}

/** Eliminar propiedad */
export function useDeleteProperty() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, userId }) => {
      // Eliminar imágenes del storage
      const { data: property } = await supabase
        .from('properties')
        .select('images')
        .eq('id', id)
        .single()

      if (property?.images?.length > 0) {
        const paths = property.images.map(url => {
          const parts = url.split('/property-images/')
          return parts[1]
        }).filter(Boolean)

        if (paths.length > 0) {
          await supabase.storage.from('property-images').remove(paths)
        }
      }

      const { error } = await supabase.from('properties').delete().eq('id', id)
      if (error) throw error
      return { id, userId }
    },
    onSuccess: (_data, { userId }) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.myProperties(userId) })
      qc.invalidateQueries({ queryKey: QUERY_KEYS.allProperties })
      qc.invalidateQueries({ queryKey: QUERY_KEYS.featuredProperties })
    },
  })
}

// ── Helpers ──────────────────────────────────────────────────────

async function uploadImages(files, userId, propertyId) {
  const uploadPromises = Array.from(files).slice(0, 10).map(async (file) => {
    const ext = file.name.split('.').pop()
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const path = `${userId}/${propertyId}/${filename}`

    const { error } = await supabase.storage
      .from('property-images')
      .upload(path, file, { upsert: false })

    if (error) throw error

    const { data: { publicUrl } } = supabase.storage
      .from('property-images')
      .getPublicUrl(path)

    return publicUrl
  })

  return Promise.all(uploadPromises)
}

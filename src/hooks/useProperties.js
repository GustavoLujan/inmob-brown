import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  collection, query, where, orderBy, getDocs, getDoc,
  addDoc, updateDoc, deleteDoc, doc, serverTimestamp,
} from 'firebase/firestore'
import { db } from '../lib/firebase'

export const QUERY_KEYS = {
  allProperties: ['properties'],
  featuredProperties: ['properties', 'featured'],
  myProperties: (userId) => ['properties', 'mine', userId],
  property: (id) => ['properties', id],
}

function toProperty(snap) {
  return { id: snap.id, ...snap.data() }
}

function sortByDate(arr) {
  return arr.sort((a, b) => {
    const aMs = a.created_at?.toDate?.()?.getTime() ?? 0
    const bMs = b.created_at?.toDate?.()?.getTime() ?? 0
    return bMs - aMs
  })
}

export function useAllProperties() {
  return useQuery({
    queryKey: QUERY_KEYS.allProperties,
    queryFn: async () => {
      const q = query(collection(db, 'properties'), orderBy('created_at', 'desc'))
      const snap = await getDocs(q)
      return snap.docs.map(toProperty)
    },
  })
}

export function useFeaturedProperties() {
  return useQuery({
    queryKey: QUERY_KEYS.featuredProperties,
    queryFn: async () => {
      const q = query(collection(db, 'properties'), where('is_featured', '==', true))
      const snap = await getDocs(q)
      return sortByDate(snap.docs.map(toProperty))
    },
  })
}

export function useProperty(id) {
  return useQuery({
    queryKey: QUERY_KEYS.property(id),
    queryFn: async () => {
      const snap = await getDoc(doc(db, 'properties', id))
      if (!snap.exists()) throw new Error('Propiedad no encontrada')
      return toProperty(snap)
    },
    enabled: !!id,
  })
}

export function useMyProperties(userId) {
  return useQuery({
    queryKey: QUERY_KEYS.myProperties(userId),
    queryFn: async () => {
      const q = query(collection(db, 'properties'), where('user_id', '==', userId))
      const snap = await getDocs(q)
      return sortByDate(snap.docs.map(toProperty))
    },
    enabled: !!userId,
  })
}

export function useCreateProperty() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ propertyData, files, userId }) => {
      const docRef = await addDoc(collection(db, 'properties'), {
        ...propertyData,
        user_id: userId,
        images: [],
        created_at: serverTimestamp(),
      })

      if (files && files.length > 0) {
        const urls = await uploadImages(files)
        await updateDoc(docRef, { images: urls })
        return { id: docRef.id, ...propertyData, user_id: userId, images: urls }
      }

      return { id: docRef.id, ...propertyData, user_id: userId, images: [] }
    },
    onSuccess: (_data, { userId }) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.myProperties(userId) })
      qc.invalidateQueries({ queryKey: QUERY_KEYS.allProperties })
      qc.invalidateQueries({ queryKey: QUERY_KEYS.featuredProperties })
    },
  })
}

export function useUpdateProperty() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, propertyData, newFiles, userId, existingImages }) => {
      let images = existingImages ?? []

      if (newFiles && newFiles.length > 0) {
        const newUrls = await uploadImages(newFiles)
        images = [...images, ...newUrls]
      }

      await updateDoc(doc(db, 'properties', id), { ...propertyData, images })
      return { id, ...propertyData, images }
    },
    onSuccess: (data, { userId }) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.myProperties(userId) })
      qc.invalidateQueries({ queryKey: QUERY_KEYS.property(data.id) })
      qc.invalidateQueries({ queryKey: QUERY_KEYS.allProperties })
      qc.invalidateQueries({ queryKey: QUERY_KEYS.featuredProperties })
    },
  })
}

export function useDeleteProperty() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id }) => {
      await deleteDoc(doc(db, 'properties', id))
      return { id }
    },
    onSuccess: (_data, { userId }) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.myProperties(userId) })
      qc.invalidateQueries({ queryKey: QUERY_KEYS.allProperties })
      qc.invalidateQueries({ queryKey: QUERY_KEYS.featuredProperties })
    },
  })
}

async function uploadImages(files) {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

  const uploads = Array.from(files).slice(0, 10).map(async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', uploadPreset)

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: 'POST', body: formData }
    )
    const data = await res.json()
    if (!res.ok) throw new Error(data.error?.message ?? 'Error al subir imagen')
    return data.secure_url
  })

  return Promise.all(uploads)
}

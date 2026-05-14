import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBath, faBed, faWarehouse } from '@fortawesome/free-solid-svg-icons'

const PROPERTY_TYPES = [
  { value: 'casa', label: 'Casa' },
  { value: 'departamento', label: 'Departamento' },
  { value: 'ph', label: 'PH' },
  { value: 'local', label: 'Local Comercial' },
  { value: 'terreno', label: 'Terreno' },
  { value: 'lote', label: 'Lote' },
  { value: 'cochera', label: 'Cochera' },
  { value: 'oficina', label: 'Oficina' },
]

const INITIAL_STATE = {
  title: '',
  type: 'sale',
  property_type: 'casa',
  price: '',
  locality: '',
  address: '',
  bedrooms: '',
  bathrooms: '',
  garages: '',
  description: '',
  is_featured: false,
  is_opportunity: false,
}

export default function PropertyForm({ initialData, onSubmit, onCancel, isSubmitting }) {
  const [form, setForm] = useState(INITIAL_STATE)
  const [newFiles, setNewFiles] = useState([])
  const [existingImages, setExistingImages] = useState([])
  const [previewUrls, setPreviewUrls] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    if (initialData) {
      const { images, ...rest } = initialData
      setForm({
        title: rest.title ?? '',
        type: rest.type ?? 'sale',
        property_type: rest.property_type ?? 'casa',
        price: rest.price ?? '',
        locality: rest.locality ?? '',
        address: rest.address ?? '',
        bedrooms: rest.bedrooms ?? '',
        bathrooms: rest.bathrooms ?? '',
        garages: rest.garages ?? '',
        description: rest.description ?? '',
        is_featured: rest.is_featured ?? false,
        is_opportunity: rest.is_opportunity ?? false,
      })
      setExistingImages(images ?? [])
    }
  }, [initialData])

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  function handleFiles(e) {
    const selected = Array.from(e.target.files)
    setNewFiles(prev => {
      const combined = [...prev, ...selected]
      setPreviewUrls(combined.map(f => URL.createObjectURL(f)))
      return combined
    })
  }

  function removeExistingImage(url) {
    setExistingImages(imgs => imgs.filter(i => i !== url))
  }

  function removeNewFile(index) {
    setNewFiles(prev => {
      const next = prev.filter((_, i) => i !== index)
      setPreviewUrls(next.map(f => URL.createObjectURL(f)))
      return next
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    if (!form.title.trim()) return setError('El título es requerido')
    if (!form.price) return setError('El precio es requerido')

    try {
      await onSubmit(
        {
          ...form,
          price: Number(form.price),
          bedrooms: form.bedrooms !== '' ? Number(form.bedrooms) : null,
          bathrooms: form.bathrooms !== '' ? Number(form.bathrooms) : null,
          garages: form.garages !== '' ? Number(form.garages) : null,
        },
        newFiles,
        existingImages,
      )
    } catch (err) {
      setError(err.message || 'Error al guardar la propiedad')
    }
  }

  const totalImages = existingImages.length + newFiles.length

  return (
    <form onSubmit={handleSubmit} style={s.form}>
      {error && <div style={s.error}>{error}</div>}

      <div style={s.field}>
        <label style={s.label}>Título *</label>
        <input name="title" value={form.title} onChange={handleChange}
          style={s.input} placeholder="Ej: Casa 3 ambientes en José Mármol" required />
      </div>

      <div style={s.row}>
        <div style={{ ...s.field, flex: 1 }}>
          <label style={s.label}>Operación *</label>
          <select name="type" value={form.type} onChange={handleChange} style={s.input}>
            <option value="sale">Venta</option>
            <option value="rent">Alquiler</option>
          </select>
        </div>
        <div style={{ ...s.field, flex: 1 }}>
          <label style={s.label}>Tipo de propiedad *</label>
          <select name="property_type" value={form.property_type} onChange={handleChange} style={s.input}>
            {PROPERTY_TYPES.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={s.field}>
        <label style={s.label}>Precio (USD) *</label>
        <input name="price" type="number" min="0" value={form.price} onChange={handleChange}
          style={s.input} placeholder="150000" required />
      </div>

      <div style={s.row}>
        <div style={{ ...s.field, flex: 1 }}>
          <label style={s.label}>Localidad</label>
          <input name="locality" value={form.locality} onChange={handleChange}
            style={s.input} placeholder="Ej: José Mármol" />
        </div>
        <div style={{ ...s.field, flex: 2 }}>
          <label style={s.label}>Dirección</label>
          <input name="address" value={form.address} onChange={handleChange}
            style={s.input} placeholder="Ej: Av. Santa Fe 1234" />
        </div>
      </div>

      <div style={s.row}>
        <div style={{ ...s.field, flex: 1 }}>
          <label style={s.label}>
            <FontAwesomeIcon icon={faBed} style={{ marginRight: '0.4rem' }} />
            Dormitorios
          </label>
          <input name="bedrooms" type="number" min="0" value={form.bedrooms}
            onChange={handleChange} style={s.input} placeholder="0" />
        </div>
        <div style={{ ...s.field, flex: 1 }}>
          <label style={s.label}>
            <FontAwesomeIcon icon={faBath} style={{ marginRight: '0.4rem' }} />
            Baños
          </label>
          <input name="bathrooms" type="number" min="0" value={form.bathrooms}
            onChange={handleChange} style={s.input} placeholder="0" />
        </div>
        <div style={{ ...s.field, flex: 1 }}>
          <label style={s.label}>
            <FontAwesomeIcon icon={faWarehouse} style={{ marginRight: '0.4rem' }} />
            Cocheras
          </label>
          <input name="garages" type="number" min="0" value={form.garages}
            onChange={handleChange} style={s.input} placeholder="0" />
        </div>
      </div>

      <div style={s.field}>
        <label style={s.label}>Descripción</label>
        <textarea name="description" value={form.description} onChange={handleChange}
          style={{ ...s.input, minHeight: '120px', resize: 'vertical' }}
          placeholder="Descripción detallada de la propiedad..." />
      </div>

      <div style={s.checkboxRow}>
        <label style={s.checkboxLabel}>
          <input type="checkbox" name="is_featured" checked={form.is_featured}
            onChange={handleChange} style={{ marginRight: '0.5rem' }} />
          ★ Destacado
        </label>
        <label style={s.checkboxLabel}>
          <input type="checkbox" name="is_opportunity" checked={form.is_opportunity}
            onChange={handleChange} style={{ marginRight: '0.5rem' }} />
          🔥 Oportunidad
        </label>
      </div>

      {existingImages.length > 0 && (
        <div style={s.field}>
          <label style={s.label}>Imágenes actuales ({existingImages.length})</label>
          <div style={s.imageGrid}>
            {existingImages.map((url) => (
              <div key={url} style={s.imageThumb}>
                <img src={url} alt="" style={s.thumbImg} />
                <button type="button" onClick={() => removeExistingImage(url)}
                  style={s.removeBtn} title="Eliminar imagen">✕</button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={s.field}>
        <label style={s.label}>
          {initialData ? 'Agregar más fotos' : 'Fotos'}
          {totalImages > 0 &&
            <span style={{ color: '#6b7280', fontWeight: 400 }}> ({totalImages} en total)</span>
          }
        </label>
        <input type="file" accept="image/*" multiple onChange={handleFiles}
          style={{ fontSize: '0.875rem' }} />

        {previewUrls.length > 0 && (
          <div style={{ ...s.imageGrid, marginTop: '0.75rem' }}>
            {previewUrls.map((url, i) => (
              <div key={i} style={s.imageThumb}>
                <img src={url} alt="" style={s.thumbImg} />
                <button type="button" onClick={() => removeNewFile(i)}
                  style={s.removeBtn} title="Quitar foto">✕</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={s.actions}>
        <button type="button" onClick={onCancel} style={s.cancelBtn}>
          Cancelar
        </button>
        <button type="submit" style={s.submitBtn} disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : initialData ? 'Guardar cambios' : 'Crear propiedad'}
        </button>
      </div>
    </form>
  )
}

const s = {
  form: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
  error: {
    background: '#fef2f2', border: '1px solid #fecaca',
    borderRadius: '6px', padding: '0.75rem 1rem', color: '#dc2626', fontSize: '0.875rem',
  },
  field: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  row: { display: 'flex', gap: '1rem', flexWrap: 'wrap' },
  label: { fontSize: '0.875rem', fontWeight: '500', color: '#374151' },
  input: {
    padding: '0.625rem 0.875rem', border: '1px solid #d1d5db',
    borderRadius: '6px', fontSize: '0.95rem', width: '100%', boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  checkboxRow: { display: 'flex', gap: '1.5rem', flexWrap: 'wrap' },
  checkboxLabel: {
    display: 'flex', alignItems: 'center', fontSize: '0.9rem',
    color: '#374151', cursor: 'pointer',
  },
  imageGrid: { display: 'flex', flexWrap: 'wrap', gap: '0.5rem' },
  imageThumb: { position: 'relative', width: '80px', height: '80px' },
  thumbImg: { width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' },
  removeBtn: {
    position: 'absolute', top: '-6px', right: '-6px',
    background: '#ef4444', color: '#fff', border: 'none',
    borderRadius: '50%', width: '18px', height: '18px',
    fontSize: '10px', cursor: 'pointer', lineHeight: '18px', padding: 0,
  },
  actions: { display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '0.5rem' },
  cancelBtn: {
    padding: '0.625rem 1.25rem', background: '#f3f4f6',
    border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem',
  },
  submitBtn: {
    padding: '0.625rem 1.5rem', background: '#1d4ed8', color: '#fff',
    border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600',
  },
}

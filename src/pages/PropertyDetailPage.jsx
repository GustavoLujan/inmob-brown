import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useProperty } from '../hooks/useProperties'

export default function PropertyDetailPage() {
  const { id } = useParams()
  const { data: property, isLoading, isError } = useProperty(id)
  const [activeImg, setActiveImg] = useState(0)

  if (isLoading) return <div style={s.center}><p>Cargando propiedad...</p></div>
  if (isError || !property) return (
    <div style={s.center}>
      <p>Propiedad no encontrada.</p>
      <Link to="/" style={s.backLink}>← Volver al inicio</Link>
    </div>
  )

  const images = property.images ?? []

  return (
    <div style={s.page}>
      <div style={s.container}>
        <Link to="/" style={s.backLink}>← Volver a propiedades</Link>

        <div style={s.grid}>
          {/* Galería */}
          <div style={s.gallery}>
            {images.length > 0 ? (
              <>
                <div style={s.mainImageWrap}>
                  <img src={images[activeImg]} alt={property.title} style={s.mainImage} />
                </div>
                {images.length > 1 && (
                  <div style={s.thumbnails}>
                    {images.map((url, i) => (
                      <button key={i} onClick={() => setActiveImg(i)} style={{
                        ...s.thumbBtn,
                        ...(i === activeImg ? s.thumbActive : {}),
                      }}>
                        <img src={url} alt="" style={s.thumbImg} />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div style={s.noImage}>Sin imágenes</div>
            )}
          </div>

          {/* Info */}
          <div style={s.info}>
            <div style={s.badges}>
              <span style={property.type === 'sale' ? s.badgeSale : s.badgeRent}>
                {property.type === 'sale' ? 'Venta' : 'Alquiler'}
              </span>
              {property.is_featured && (
                <span style={s.badgeFeatured}>★ Destacado</span>
              )}
            </div>

            <h1 style={s.title}>{property.title}</h1>

            <p style={s.price}>
              USD {Number(property.price).toLocaleString('es-AR')}
            </p>

            {property.address && (
              <p style={s.address}>📍 {property.address}</p>
            )}

            {property.description && (
              <div style={s.descriptionWrap}>
                <h2 style={s.descTitle}>Descripción</h2>
                <p style={s.description}>{property.description}</p>
              </div>
            )}

            {/* Contacto */}
            <div style={s.contactBox}>
              <h2 style={s.descTitle}>¿Te interesa esta propiedad?</h2>
              <p style={s.contactText}>Contactanos y un agente se comunicará con vos.</p>
              <a href="mailto:contacto@inmobiliaria.com" style={s.contactBtn}>
                Consultar por email
              </a>
              <a href="https://wa.me/5491100000000" target="_blank" rel="noreferrer" style={{ ...s.contactBtn, ...s.waBtn }}>
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const s = {
  page: { minHeight: '100vh', background: '#f9fafb', padding: '2rem 1rem' },
  container: { maxWidth: '1100px', margin: '0 auto' },
  center: { minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' },
  backLink: { display: 'inline-block', marginBottom: '1.5rem', color: '#1d4ed8', textDecoration: 'none', fontSize: '0.9rem' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem', alignItems: 'start', '@media(max-width:700px)': { gridTemplateColumns: '1fr' } },
  gallery: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  mainImageWrap: { borderRadius: '10px', overflow: 'hidden', background: '#e5e7eb', aspectRatio: '4/3' },
  mainImage: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  noImage: { borderRadius: '10px', background: '#e5e7eb', aspectRatio: '4/3', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' },
  thumbnails: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap' },
  thumbBtn: { border: '2px solid transparent', borderRadius: '6px', padding: 0, cursor: 'pointer', background: 'none', overflow: 'hidden', width: '68px', height: '68px' },
  thumbActive: { borderColor: '#1d4ed8' },
  thumbImg: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  info: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
  badges: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap' },
  badgeSale: { background: '#dbeafe', color: '#1d4ed8', borderRadius: '999px', padding: '0.25rem 0.75rem', fontSize: '0.8rem', fontWeight: '600' },
  badgeRent: { background: '#fef3c7', color: '#92400e', borderRadius: '999px', padding: '0.25rem 0.75rem', fontSize: '0.8rem', fontWeight: '600' },
  badgeFeatured: { background: '#fef9c3', color: '#854d0e', borderRadius: '999px', padding: '0.25rem 0.75rem', fontSize: '0.8rem', fontWeight: '600' },
  title: { margin: 0, fontSize: '1.65rem', fontWeight: '800', color: '#111827', lineHeight: 1.2 },
  price: { margin: 0, fontSize: '1.75rem', fontWeight: '800', color: '#1d4ed8' },
  address: { margin: 0, color: '#6b7280', fontSize: '0.95rem' },
  descriptionWrap: {},
  descTitle: { margin: '0 0 0.5rem', fontSize: '1rem', fontWeight: '700', color: '#374151' },
  description: { margin: 0, color: '#4b5563', lineHeight: 1.7, whiteSpace: 'pre-wrap' },
  contactBox: { background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '10px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  contactText: { margin: 0, color: '#475569', fontSize: '0.875rem' },
  contactBtn: { display: 'inline-block', textAlign: 'center', padding: '0.65rem 1.25rem', background: '#1d4ed8', color: '#fff', borderRadius: '6px', textDecoration: 'none', fontWeight: '600', fontSize: '0.9rem' },
  waBtn: { background: '#16a34a' },
}

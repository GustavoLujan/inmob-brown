import { Link } from 'react-router-dom'

export default function PropertyCard({ property }) {
  const { id, title, type, price, address, images, is_featured } = property
  const coverImage = images?.[0] ?? null

  return (
    <Link to={`/propiedad/${id}`} style={s.card}>
      {/* Imagen de portada */}
      <div style={s.imageWrap}>
        {coverImage
          ? <img src={coverImage} alt={title} style={s.image} />
          : <div style={s.noImage}>Sin imagen</div>
        }
        <div style={s.badges}>
          <span style={type === 'sale' ? s.badgeSale : s.badgeRent}>
            {type === 'sale' ? 'Venta' : 'Alquiler'}
          </span>
          {is_featured && <span style={s.badgeFeatured}>★ Destacado</span>}
        </div>
      </div>

      {/* Info */}
      <div style={s.body}>
        <p style={s.price}>USD {Number(price).toLocaleString('es-AR')}</p>
        <h3 style={s.title}>{title}</h3>
        {address && <p style={s.address}>📍 {address}</p>}
      </div>
    </Link>
  )
}

const s = {
  card: {
    display: 'block',
    textDecoration: 'none',
    color: 'inherit',
    background: '#fff',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
    transition: 'transform 0.18s, box-shadow 0.18s',
    cursor: 'pointer',
  },
  imageWrap: { position: 'relative', aspectRatio: '4/3', background: '#e5e7eb', overflow: 'hidden' },
  image: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  noImage: { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: '0.85rem' },
  badges: { position: 'absolute', top: '0.6rem', left: '0.6rem', display: 'flex', gap: '0.35rem' },
  badgeSale: { background: '#1d4ed8', color: '#fff', borderRadius: '999px', padding: '0.2rem 0.6rem', fontSize: '0.72rem', fontWeight: '700' },
  badgeRent: { background: '#d97706', color: '#fff', borderRadius: '999px', padding: '0.2rem 0.6rem', fontSize: '0.72rem', fontWeight: '700' },
  badgeFeatured: { background: '#ca8a04', color: '#fff', borderRadius: '999px', padding: '0.2rem 0.6rem', fontSize: '0.72rem', fontWeight: '700' },
  body: { padding: '1rem' },
  price: { margin: '0 0 0.35rem', fontWeight: '800', fontSize: '1.1rem', color: '#1d4ed8' },
  title: { margin: '0 0 0.4rem', fontSize: '0.95rem', fontWeight: '600', color: '#111827', lineHeight: 1.3 },
  address: { margin: 0, fontSize: '0.8rem', color: '#6b7280' },
}

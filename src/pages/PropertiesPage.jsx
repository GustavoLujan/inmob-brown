import { useAllProperties, useFeaturedProperties } from '../hooks/useProperties'
import PropertyCard from '../components/PropertyCard'

export default function PropertiesPage() {
  const { data: all, isLoading: loadingAll, isError: errorAll } = useAllProperties()
  const { data: featured, isLoading: loadingFeatured } = useFeaturedProperties()

  return (
    <div style={s.page}>
      {/* Destacados */}
      {!loadingFeatured && featured?.length > 0 && (
        <section style={s.section}>
          <h2 style={s.sectionTitle}>★ Propiedades Destacadas</h2>
          <div style={s.grid}>
            {featured.map(p => <PropertyCard key={p.id} property={p} />)}
          </div>
        </section>
      )}

      {/* Todas */}
      <section style={s.section}>
        <h2 style={s.sectionTitle}>Todas las propiedades</h2>

        {loadingAll && <p style={s.msg}>Cargando propiedades...</p>}
        {errorAll && <p style={{ ...s.msg, color: '#dc2626' }}>Error al cargar las propiedades.</p>}
        {!loadingAll && all?.length === 0 && (
          <p style={s.msg}>No hay propiedades disponibles por el momento.</p>
        )}

        {all && all.length > 0 && (
          <div style={s.grid}>
            {all.map(p => <PropertyCard key={p.id} property={p} />)}
          </div>
        )}
      </section>
    </div>
  )
}

const s = {
  page: { maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 1.25rem' },
  section: { marginBottom: '3.5rem' },
  sectionTitle: { fontSize: '1.35rem', fontWeight: '800', color: '#111827', marginBottom: '1.5rem' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.5rem',
  },
  msg: { textAlign: 'center', color: '#6b7280', padding: '2rem 0' },
}

import { useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useAllProperties } from '../hooks/useProperties'
import PropertyCard from '../components/PropertyCard'

const PROPERTY_TYPE_LABELS = {
  casa: 'Casa', departamento: 'Departamento', ph: 'PH',
  local: 'Local Comercial', terreno: 'Terreno', lote: 'Lote',
  cochera: 'Cochera', oficina: 'Oficina',
}

export default function PropertiesPage() {
  const [searchParams] = useSearchParams()
  const { data: all, isLoading, isError } = useAllProperties()

  const typeFilter = searchParams.get('type') || ''
  const localityFilter = searchParams.get('locality') || ''
  const propertyTypeFilter = searchParams.get('property_type') || ''
  const hasFilters = typeFilter || localityFilter || propertyTypeFilter

  const filtered = useMemo(() => {
    if (!all) return []
    return all.filter(p => {
      if (typeFilter && p.type !== typeFilter) return false
      if (localityFilter && p.locality?.trim().toLowerCase() !== localityFilter.toLowerCase()) return false
      if (propertyTypeFilter && p.property_type !== propertyTypeFilter) return false
      return true
    })
  }, [all, typeFilter, localityFilter, propertyTypeFilter])

  const filterLabels = [
    typeFilter && (typeFilter === 'sale' ? 'Venta' : 'Alquiler'),
    localityFilter,
    propertyTypeFilter && (PROPERTY_TYPE_LABELS[propertyTypeFilter] ?? propertyTypeFilter),
  ].filter(Boolean)

  return (
    <div style={s.page}>
      {hasFilters && (
        <div style={s.filterBanner}>
          <span>
            {filtered.length} resultado{filtered.length !== 1 ? 's' : ''} para:{' '}
            <strong>{filterLabels.join(' · ')}</strong>
          </span>
          <Link to="/propiedades" style={s.clearLink}>✕ Limpiar filtros</Link>
        </div>
      )}

      <section style={s.section}>
        <h2 style={s.sectionTitle}>
          {hasFilters ? 'Resultados de búsqueda' : 'Todas las propiedades'}
        </h2>

        {isLoading && <p style={s.msg}>Cargando propiedades...</p>}
        {isError && <p style={{ ...s.msg, color: '#dc2626' }}>Error al cargar las propiedades.</p>}
        {!isLoading && !isError && filtered.length === 0 && (
          <p style={s.msg}>
            {hasFilters
              ? 'No hay propiedades que coincidan con tu búsqueda.'
              : 'No hay propiedades disponibles por el momento.'
            }
          </p>
        )}

        {filtered.length > 0 && (
          <div style={s.grid}>
            {filtered.map(p => <PropertyCard key={p.id} property={p} />)}
          </div>
        )}
      </section>
    </div>
  )
}

const s = {
  page: { maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 1.25rem' },
  filterBanner: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    background: '#f0f4ff', border: '1px solid #c7d7f9', borderRadius: '8px',
    padding: '0.75rem 1.25rem', marginBottom: '1.5rem', fontSize: '0.9rem', color: '#374151',
    flexWrap: 'wrap', gap: '0.5rem',
  },
  clearLink: { color: '#1d4ed8', textDecoration: 'none', fontWeight: '600', fontSize: '0.85rem' },
  section: { marginBottom: '3.5rem' },
  sectionTitle: { fontSize: '1.35rem', fontWeight: '800', color: '#111827', marginBottom: '1.5rem' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.5rem',
  },
  msg: { textAlign: 'center', color: '#6b7280', padding: '2rem 0' },
}

import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAllProperties, useFeaturedProperties } from '../hooks/useProperties'
import PropertyCard from '../components/PropertyCard'
import imagenCasa from '../assets/casa.png'
import './Nosotros.css'

const PROPERTY_TYPE_LABELS = {
  casa: 'Casa',
  departamento: 'Departamento',
  ph: 'PH',
  local: 'Local Comercial',
  terreno: 'Terreno',
  lote: 'Lote',
  cochera: 'Cochera',
  oficina: 'Oficina',
}

function shuffleTake(arr, n) {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy.slice(0, n)
}

export default function Nosotros() {
  const navigate = useNavigate()
  const { data: allProperties } = useAllProperties()
  const { data: featuredProperties } = useFeaturedProperties()

  const [searchType, setSearchType] = useState('')
  const [searchLocality, setSearchLocality] = useState('')
  const [searchPropertyType, setSearchPropertyType] = useState('')

  const localities = useMemo(() => {
    if (!allProperties) return []
    const set = new Set()
    allProperties.forEach(p => { if (p.locality?.trim()) set.add(p.locality.trim()) })
    return [...set].sort()
  }, [allProperties])

  const propertyTypes = useMemo(() => {
    if (!allProperties) return []
    const set = new Set()
    allProperties.forEach(p => { if (p.property_type?.trim()) set.add(p.property_type.trim()) })
    return [...set].sort()
  }, [allProperties])

  const displayedFeatured = useMemo(() => {
    if (!featuredProperties || featuredProperties.length === 0) return []
    return shuffleTake(featuredProperties, 4)
  }, [featuredProperties])

  function handleSearch(e) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchType) params.set('type', searchType)
    if (searchLocality) params.set('locality', searchLocality)
    if (searchPropertyType) params.set('property_type', searchPropertyType)
    navigate(`/propiedades${params.toString() ? '?' + params.toString() : ''}`)
  }

  return (
    <div className="nosotros-container">
      <div className="hero-section">
        <div className="hero-image-container">
          <img src={imagenCasa} alt="Nuestra Inmobiliaria" className="hero-casa-img" />
          <div className="hero-overlay">
            <h1>Inmobiliaria Brown</h1>
          </div>
        </div>

        <form className="hero-search" onSubmit={handleSearch}>
          <select value={searchType} onChange={e => setSearchType(e.target.value)}>
            <option value="">Venta / Alquiler</option>
            <option value="sale">Venta</option>
            <option value="rent">Alquiler</option>
          </select>
          <select value={searchLocality} onChange={e => setSearchLocality(e.target.value)}>
            <option value="">Localidades</option>
            {localities.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          <select value={searchPropertyType} onChange={e => setSearchPropertyType(e.target.value)}>
            <option value="">Tipos de propiedad</option>
            {propertyTypes.map(t => (
              <option key={t} value={t}>{PROPERTY_TYPE_LABELS[t] ?? t}</option>
            ))}
          </select>
          <button type="submit">BUSCAR</button>
        </form>
      </div>

      <div className="history-card">
        <div className="history-content">
          <h3>Nuestra Historia</h3>
          <p>
            Con años de trayectoria en la zona de <span className="highlight-text">José Mármol</span> y alrededores,
            nos hemos consolidado como referentes de confianza y profesionalismo en el sector inmobiliario.
          </p>
          <p>
            Nuestra misión es simple: acompañarte en cada paso del camino, ya sea que busques el hogar de tus sueños
            o la mejor inversión para tu futuro.
          </p>
          <div className="valores-grid">
            <div className="valor-item">Confianza</div>
            <div className="valor-item">Trayectoria</div>
            <div className="valor-item">Excelencia</div>
          </div>
        </div>
      </div>

      {displayedFeatured.length > 0 && (
        <section className="featured-section">
          <h2 className="featured-title">★ Propiedades Destacadas</h2>
          <div className="featured-grid">
            {displayedFeatured.map(p => <PropertyCard key={p.id} property={p} />)}
          </div>
        </section>
      )}
    </div>
  )
}

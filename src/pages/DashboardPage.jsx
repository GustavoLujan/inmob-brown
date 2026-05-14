import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useMyProperties, useCreateProperty, useUpdateProperty, useDeleteProperty } from '../hooks/useProperties'
import PropertyForm from '../components/PropertyForm'

export default function DashboardPage() {
  const { user, profile, signOut } = useAuth()
  const { data: properties, isLoading, isError } = useMyProperties(user?.id)
  const createProperty = useCreateProperty()
  const updateProperty = useUpdateProperty()
  const deleteProperty = useDeleteProperty()

  const [mode, setMode] = useState('list') // 'list' | 'create' | 'edit'
  const [editingProperty, setEditingProperty] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  async function handleCreate(propertyData, newFiles) {
    await createProperty.mutateAsync({ propertyData, files: newFiles, userId: user.id })
    setMode('list')
  }

  async function handleUpdate(propertyData, newFiles, existingImages) {
    await updateProperty.mutateAsync({
      id: editingProperty.id,
      propertyData,
      newFiles,
      userId: user.id,
      existingImages,
    })
    setMode('list')
    setEditingProperty(null)
  }

  async function handleDelete(id) {
    await deleteProperty.mutateAsync({ id, userId: user.id })
    setDeleteConfirm(null)
  }

  function startEdit(property) {
    setEditingProperty(property)
    setMode('edit')
  }

  function cancelForm() {
    setMode('list')
    setEditingProperty(null)
  }

  const agentName = profile?.full_name || user?.email || 'Agente'

  return (
    <div style={s.page}>
      {/* Header */}
      <header style={s.header}>
        <div style={s.headerInner}>
          <div>
            <h1 style={s.headerTitle}>Panel de control</h1>
            <p style={s.headerSub}>Bienvenido, <strong>{agentName}</strong></p>
          </div>
          <button onClick={signOut} style={s.logoutBtn}>Cerrar sesión</button>
        </div>
      </header>

      <main style={s.main}>
        {/* Vista: formulario de creación */}
        {mode === 'create' && (
          <section style={s.section}>
            <h2 style={s.sectionTitle}>Nueva propiedad</h2>
            <PropertyForm
              onSubmit={handleCreate}
              onCancel={cancelForm}
              isSubmitting={createProperty.isPending}
            />
          </section>
        )}

        {/* Vista: formulario de edición */}
        {mode === 'edit' && editingProperty && (
          <section style={s.section}>
            <h2 style={s.sectionTitle}>Editar propiedad</h2>
            <PropertyForm
              initialData={editingProperty}
              onSubmit={handleUpdate}
              onCancel={cancelForm}
              isSubmitting={updateProperty.isPending}
            />
          </section>
        )}

        {/* Vista: lista de propiedades */}
        {mode === 'list' && (
          <section style={s.section}>
            <div style={s.listHeader}>
              <h2 style={s.sectionTitle}>Mis propiedades</h2>
              <button onClick={() => setMode('create')} style={s.addBtn}>
                + Nueva propiedad
              </button>
            </div>

            {isLoading && <p style={s.stateMsg}>Cargando propiedades...</p>}
            {isError && <p style={{ ...s.stateMsg, color: '#dc2626' }}>Error al cargar propiedades.</p>}

            {!isLoading && properties?.length === 0 && (
              <div style={s.emptyState}>
                <p>Todavía no cargaste ninguna propiedad.</p>
                <button onClick={() => setMode('create')} style={s.addBtn}>
                  Agregar la primera
                </button>
              </div>
            )}

            {properties && properties.length > 0 && (
              <div style={s.table}>
                {/* Encabezado tabla */}
                <div style={{ ...s.tableRow, ...s.tableHead }}>
                  <span style={{ flex: 3 }}>Título</span>
                  <span style={{ flex: 1 }}>Tipo</span>
                  <span style={{ flex: 1 }}>Precio</span>
                  <span style={{ flex: 1, textAlign: 'center' }}>Destacado</span>
                  <span style={{ flex: 1, textAlign: 'center' }}>Oportunidad</span>
                  <span style={{ flex: 1.5, textAlign: 'right' }}>Acciones</span>
                </div>

                {properties.map(prop => (
                  <div key={prop.id} style={s.tableRow}>
                    <span style={{ flex: 3, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {prop.title}
                    </span>
                    <span style={{ flex: 1 }}>
                      <span style={prop.type === 'sale' ? s.badgeSale : s.badgeRent}>
                        {prop.type === 'sale' ? 'Venta' : 'Alquiler'}
                      </span>
                    </span>
                    <span style={{ flex: 1 }}>
                      USD {Number(prop.price).toLocaleString('es-AR')}
                    </span>
                    <span style={{ flex: 1, textAlign: 'center' }}>
                      {prop.is_featured
                        ? <span style={s.badgeFeatured}>★ Sí</span>
                        : <span style={s.badgeNormal}>—</span>
                      }
                    </span>
                    <span style={{ flex: 1, textAlign: 'center' }}>
                      {prop.is_opportunity
                        ? <span style={s.badgeOpportunity}>🔥 Sí</span>
                        : <span style={s.badgeNormal}>—</span>
                      }
                    </span>
                    <span style={{ flex: 1.5, display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button onClick={() => startEdit(prop)} style={s.editBtn}>Editar</button>
                      <button onClick={() => setDeleteConfirm(prop)} style={s.deleteBtn}>Eliminar</button>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Modal de confirmación de borrado */}
        {deleteConfirm && (
          <div style={s.modalOverlay}>
            <div style={s.modal}>
              <h3 style={{ margin: '0 0 0.5rem' }}>¿Eliminar propiedad?</h3>
              <p style={{ margin: '0 0 1.5rem', color: '#555' }}>
                <strong>"{deleteConfirm.title}"</strong> será eliminada permanentemente junto con todas sus imágenes.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button onClick={() => setDeleteConfirm(null)} style={s.cancelBtn}>
                  Cancelar
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm.id)}
                  style={s.deleteBtn}
                  disabled={deleteProperty.isPending}
                >
                  {deleteProperty.isPending ? 'Eliminando...' : 'Sí, eliminar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

const s = {
  page: { minHeight: '100vh', background: '#f9fafb', fontFamily: 'inherit' },
  header: { background: '#1d4ed8', color: '#fff', padding: '1rem 1.5rem' },
  headerInner: { maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' },
  headerTitle: { margin: 0, fontSize: '1.25rem', fontWeight: '700' },
  headerSub: { margin: '0.2rem 0 0', fontSize: '0.875rem', opacity: 0.85 },
  logoutBtn: { padding: '0.5rem 1.1rem', background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.35)', borderRadius: '6px', cursor: 'pointer', fontSize: '0.875rem' },
  main: { maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' },
  section: { background: '#fff', borderRadius: '8px', padding: '1.75rem', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' },
  sectionTitle: { margin: '0 0 1.5rem', fontSize: '1.15rem', fontWeight: '700', color: '#1a1a1a' },
  listHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' },
  addBtn: { padding: '0.6rem 1.2rem', background: '#1d4ed8', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600' },
  stateMsg: { textAlign: 'center', color: '#6b7280', padding: '2rem 0' },
  emptyState: { textAlign: 'center', color: '#6b7280', padding: '3rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' },
  table: { display: 'flex', flexDirection: 'column', border: '1px solid #e5e7eb', borderRadius: '6px', overflow: 'hidden' },
  tableHead: { background: '#f3f4f6', fontWeight: '600', fontSize: '0.8rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' },
  tableRow: { display: 'flex', alignItems: 'center', padding: '0.85rem 1rem', gap: '0.75rem', borderBottom: '1px solid #e5e7eb', fontSize: '0.9rem' },
  badgeSale: { background: '#dbeafe', color: '#1d4ed8', borderRadius: '999px', padding: '0.2rem 0.6rem', fontSize: '0.75rem', fontWeight: '600' },
  badgeRent: { background: '#fef3c7', color: '#92400e', borderRadius: '999px', padding: '0.2rem 0.6rem', fontSize: '0.75rem', fontWeight: '600' },
  badgeFeatured: { background: '#fef9c3', color: '#854d0e', borderRadius: '999px', padding: '0.2rem 0.6rem', fontSize: '0.75rem', fontWeight: '600' },
  badgeOpportunity: { background: '#fef2f2', color: '#dc2626', borderRadius: '999px', padding: '0.2rem 0.6rem', fontSize: '0.75rem', fontWeight: '600' },
  badgeNormal: { color: '#9ca3af', fontSize: '0.85rem' },
  editBtn: { padding: '0.35rem 0.85rem', background: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '5px', cursor: 'pointer', fontSize: '0.8rem' },
  deleteBtn: { padding: '0.35rem 0.85rem', background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', borderRadius: '5px', cursor: 'pointer', fontSize: '0.8rem' },
  cancelBtn: { padding: '0.5rem 1.1rem', background: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', fontSize: '0.875rem' },
  modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' },
  modal: { background: '#fff', borderRadius: '10px', padding: '2rem', maxWidth: '420px', width: '100%', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' },
}

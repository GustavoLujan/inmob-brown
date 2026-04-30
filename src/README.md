# Inmobiliaria — Supabase Integration

Guía completa para configurar el backend con Supabase y desplegar en Vercel.

---

## 1. Instalar dependencias

```bash
npm install @supabase/supabase-js @tanstack/react-query
```

---

## 2. Variables de entorno

Crear el archivo `.env.local` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

> En Vercel: agregar las mismas variables en **Settings → Environment Variables**.

---

## 3. Configurar Supabase Dashboard

### 3.1 Deshabilitar registro público

1. Ir a **Authentication → Providers → Email**
2. Desactivar **"Enable Email Signup"**
3. Guardar cambios

Los usuarios solo pueden ser creados por el administrador desde:
- **Authentication → Users → Invite user**
- O usando el script de creación de usuarios con el `service_role` key

### 3.2 Ejecutar la migración SQL

1. Ir a **SQL Editor** en el Dashboard
2. Pegar el contenido de `supabase/migration.sql`
3. Ejecutar

Esto crea:
- Tabla `profiles` con trigger automático al crear usuarios
- Tabla `properties` con todas las columnas requeridas
- Row Level Security (RLS) en ambas tablas
- Bucket de storage `property-images` con políticas

### 3.3 Crear el primer agente

En **Authentication → Users → Add user**:
- Email y contraseña del agente
- En "User metadata" (JSON): `{ "full_name": "Nombre Apellido", "role": "agent" }`

---

## 4. Estructura de archivos

```
src/
├── lib/
│   ├── supabase.js          # Cliente Supabase
│   └── queryClient.js       # TanStack Query client
├── contexts/
│   └── AuthContext.jsx      # Sesión, login, logout, perfil
├── hooks/
│   └── useProperties.js     # Queries y mutations de propiedades
├── components/
│   ├── PrivateRoute.jsx     # Protección de rutas privadas
│   ├── PropertyCard.jsx     # Card pública de propiedad
│   └── PropertyForm.jsx     # Formulario crear/editar propiedad
├── pages/
│   ├── LoginPage.jsx        # /login
│   ├── DashboardPage.jsx    # /dashboard (privado)
│   ├── PropertiesPage.jsx   # / (público)
│   └── PropertyDetailPage.jsx # /propiedad/:id (público)
└── App.jsx                  # Routing principal
```

---

## 5. Rutas

| Ruta | Acceso | Descripción |
|---|---|---|
| `/` | Público | Listado de propiedades + destacados |
| `/propiedad/:id` | Público | Detalle de propiedad |
| `/login` | Público | Login de agentes (no visible en nav) |
| `/dashboard` | Privado | Panel del agente |

---

## 6. Integrar con el sitio existente

### Reemplazar datos estáticos

Donde antes tenías arrays hardcodeados, ahora usás los hooks:

```jsx
// Antes
const properties = [{ id: 1, title: '...' }, ...]

// Ahora
import { useAllProperties } from '../hooks/useProperties'

function MyComponent() {
  const { data: properties, isLoading } = useAllProperties()
  // ...
}
```

### Agregar las rutas en App.jsx

Copiar el `App.jsx` proporcionado o integrar las rutas en tu router existente:

```jsx
import { Route } from 'react-router-dom'
import PrivateRoute from './components/PrivateRoute'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import PropertyDetailPage from './pages/PropertyDetailPage'

// Dentro de tu <Routes>:
<Route path="/login" element={<LoginPage />} />
<Route path="/propiedad/:id" element={<PropertyDetailPage />} />
<Route element={<PrivateRoute />}>
  <Route path="/dashboard" element={<DashboardPage />} />
</Route>
```

### Envolver con providers en main.jsx

```jsx
import { QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './contexts/AuthContext'
import { queryClient } from './lib/queryClient'

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <App />
    </AuthProvider>
  </QueryClientProvider>
)
```

> Si usás el `App.jsx` provisto, los providers ya están incluidos adentro. No los dupliques.

---

## 7. Deploy en Vercel

1. Push al repositorio de GitHub
2. Importar proyecto en Vercel
3. Agregar variables de entorno:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Framework preset: **Vite**
5. Deploy

---

## 8. Flujo de imágenes

Las imágenes se guardan en Supabase Storage con esta estructura:

```
property-images/
└── {user_id}/
    └── {property_id}/
        ├── 1712345678-abc123.jpg
        └── 1712345679-def456.jpg
```

Las URLs públicas se almacenan en `properties.images` (tipo `text[]`).

---

## 9. Seguridad

- El registro público está **deshabilitado** en Supabase
- RLS garantiza que cada agente solo accede a sus propias propiedades
- Las propiedades y las imágenes son de **lectura pública** para el sitio
- Nunca exponer la `service_role` key en el frontend

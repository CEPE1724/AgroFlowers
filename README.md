# AgroFlowers AI — Frontend

Sistema de gestión inteligente de exportación de flores: fincas, variedades, compras, embarques, costos logísticos, ventas, rentabilidad y un asistente de inteligencia artificial. Frontend construido con **Astro + React + TypeScript + Tailwind CSS**, preparado para conectarse a microservicios reales protegidos por **Keycloak (OAuth2/OIDC + JWT)**.

## Índice

1. [Stack tecnológico](#stack-tecnológico)
2. [Ejecución local](#ejecución-local)
3. [Modo mock vs. modo real (Keycloak + API)](#modo-mock-vs-modo-real-keycloak--api)
4. [Credenciales de prueba](#credenciales-de-prueba)
5. [Roles y permisos](#roles-y-permisos)
6. [Listado de rutas](#listado-de-rutas)
7. [Arquitectura del código](#arquitectura-del-código)
8. [Docker](#docker)
9. [Evidencia de validación por fase](#evidencia-de-validación-por-fase)
10. [Notas y decisiones técnicas](#notas-y-decisiones-técnicas)

## Stack tecnológico

- **Astro 4** (SSR con adapter `@astrojs/node`, modo `standalone`)
- **React 18** — solo para componentes interactivos (islands)
- **TypeScript** estricto
- **Tailwind CSS 3**
- **Zod** — validaciones de formularios y esquemas
- **React Hook Form** (+ `@hookform/resolvers`) — formularios complejos
- **Axios** — cliente HTTP centralizado con interceptores
- **Recharts** — gráficos del dashboard
- **keycloak-js** — autenticación OAuth2/OIDC (Authorization Code + PKCE)
- **Lucide React** — iconos
- **Sonner** — notificaciones
- **nanostores** + `@nanostores/react` — estado global compartido entre islands (sesión, tema, sidebar)
- **Docker** + **Nginx** — contenerización y reverse proxy

## Ejecución local

```bash
npm install
npm run dev
```

Abre **http://localhost:4321** — redirige automáticamente a `/login`.

Otros comandos:

```bash
npm run check    # astro check (validación de TypeScript)
npm run build    # astro check + build de producción (SSR)
npm run preview  # sirve el build de producción localmente
```

## Modo mock vs. modo real (Keycloak + API)

El archivo `.env` controla el modo de operación mediante `PUBLIC_USE_MOCKS`:

```bash
PUBLIC_API_BASE_URL=http://localhost/api
PUBLIC_KEYCLOAK_URL=http://localhost/auth
PUBLIC_KEYCLOAK_REALM=agroflowers-realm
PUBLIC_KEYCLOAK_CLIENT_ID=agroflowers-web
PUBLIC_USE_MOCKS=true
```

| Valor | Comportamiento |
|---|---|
| `PUBLIC_USE_MOCKS=true` | Login con formulario simulado (3 usuarios de prueba) y todos los `services/*` devuelven datos de `mocks/*` en memoria. Ideal para desarrollo sin backend. |
| `PUBLIC_USE_MOCKS=false` | El login redirige a la página real de Keycloak (Authorization Code + PKCE vía `keycloak-js`, client **público**, sin secret). Todos los `services/*` llaman a `PUBLIC_API_BASE_URL` a través de `apiClient` (Axios) con el JWT real como `Authorization: Bearer`. |

> **Importante:** las variables `PUBLIC_*` de Astro/Vite se incrustan en el bundle **en tiempo de build**, no en tiempo de ejecución. Si despliegas con Docker, deben pasarse como *build args* (ver sección Docker), no solo como variables de entorno del contenedor.

### Configuración esperada del client en Keycloak (modo real)

A diferencia de un backend que usa Postman (client confidential), este es un frontend SPA, así que el client debe ser:

- **Client authentication: Off** (público — un SPA no puede guardar un secreto de forma segura)
- **Standard flow: On** (habilita la redirección/Authorization Code)
- **Direct access grants: Off** (el frontend no debe usar `password` grant)
- **Valid redirect URIs**: `http://localhost:4321/*` (dev) o el dominio de producción
- **Web origins**: mismo origen del frontend (para evitar problemas de CORS en el intercambio de token)
- Roles de realm `ADMIN`, `SUPERVISOR`, `OPERADOR` asignados a los usuarios

## Credenciales de prueba

Solo aplican en modo mock (`PUBLIC_USE_MOCKS=true`):

| Correo | Contraseña | Rol |
|---|---|---|
| `admin@agroflowers.com` | `123456` | ADMIN |
| `supervisor@agroflowers.com` | `123456` | SUPERVISOR |
| `operador@agroflowers.com` | `123456` | OPERADOR |

En la pantalla de login hay botones de acceso rápido que autocompletan cada cuenta.

## Roles y permisos

Definidos en [`src/utils/permissions.ts`](src/utils/permissions.ts):

```ts
hasRole('ADMIN')
hasAnyRole(['ADMIN', 'SUPERVISOR'])
can('FARMS_MANAGE') // permisos granulares por acción
```

| Rol | Puede |
|---|---|
| **ADMIN** | Acceso completo: gestionar fincas, variedades, compras, embarques, costos, ventas, ver rentabilidad, usar IA, configuración |
| **SUPERVISOR** | Consultar dashboard, fincas, compras, embarques, costos, rentabilidad, IA — sin crear ni eliminar |
| **OPERADOR** | Registrar compras, embarques y costos; consultar sus propios registros — sin administrar fincas ni configuración |

El componente [`AuthGuard`](src/components/layout/AuthGuard.tsx) protege cada página del dashboard: verifica sesión activa y, si la ruta declara `requiredPermission`, valida el permiso antes de renderizar contenido; de lo contrario redirige a `/login` o `/unauthorized`.

## Listado de rutas

| Ruta | Descripción | Permiso requerido |
|---|---|---|
| `/` | Redirección según sesión activa | — |
| `/login` | Inicio de sesión (mock o Keycloak) | — |
| `/dashboard` | Indicadores, gráficos y últimos embarques | Sesión activa |
| `/farms` | Listado de fincas | `FARMS_VIEW` |
| `/farms/new` | Registrar finca | `FARMS_MANAGE` |
| `/farms/[id]` | Detalle de finca | `FARMS_VIEW` |
| `/farms/[id]/edit` | Editar finca | `FARMS_MANAGE` |
| `/flowers` | Listado de flores y variedades | `FLOWERS_VIEW` |
| `/flowers/new` | Registrar variedad | `FLOWERS_MANAGE` |
| `/flowers/[id]/edit` | Editar variedad | `FLOWERS_MANAGE` |
| `/purchases` | Listado de compras | `PURCHASES_VIEW` |
| `/purchases/new` | Registrar compra (detalle dinámico) | `PURCHASES_CREATE` |
| `/purchases/[id]` | Detalle de compra | `PURCHASES_VIEW` |
| `/shipments` | Listado de embarques | `SHIPMENTS_VIEW` |
| `/shipments/new` | Registrar embarque | `SHIPMENTS_CREATE` |
| `/shipments/[id]` | Detalle de embarque | `SHIPMENTS_VIEW` |
| `/shipments/[id]/edit` | Editar embarque | `SHIPMENTS_CREATE` |
| `/costs` | Listado de costos | `COSTS_VIEW` |
| `/costs/new` | Registrar costos de un embarque | `COSTS_CREATE` |
| `/costs/[shipmentId]` | Desglose de costos de un embarque | `COSTS_VIEW` |
| `/sales` | Listado de ventas | `SALES_VIEW` |
| `/sales/new` | Registrar venta (detalle dinámico) | `SALES_CREATE` |
| `/sales/[id]` | Detalle de venta | `SALES_VIEW` |
| `/profitability` | Rentabilidad con filtros y exportación CSV | `PROFITABILITY_VIEW` |
| `/ai-assistant` | Asistente de IA (chat) | `AI_ASSISTANT` |
| `/profile` | Datos de la sesión activa | Sesión activa |
| `/unauthorized` | Acceso denegado por rol | — |
| `/404` | Página no encontrada | — |

## Arquitectura del código

```
src/
├── components/       # common/ (reutilizables), layout/, y uno por módulo de negocio
├── layouts/           # MainLayout, AuthLayout, DashboardLayout (Astro)
├── pages/             # rutas de archivo de Astro
├── services/          # apiClient + un servicio por dominio (mock/real vía PUBLIC_USE_MOCKS)
├── mocks/             # datos de prueba en memoria
├── schemas/           # validaciones Zod por formulario
├── stores/            # nanostores: authStore, uiStore
├── types/             # tipos TypeScript por dominio
└── utils/             # permisos, formato de moneda/fecha, mapeo de estados, manejo de errores
```

Patrones aplicados:

- **Separación por capas**: página (Astro) → componente de vista (React) → `services/*` → `apiClient`/mocks. Ninguna página llama directo a `fetch`/`axios`.
- **Un solo cliente HTTP** (`services/apiClient.ts`) con interceptores para adjuntar el JWT, manejar `401` (cierra sesión y redirige a login), `403` (notifica) y errores de red.
- **`utils/errors.ts`** centraliza el mapeo de errores HTTP (`400`, `401`, `403`, `404`, `500`) a mensajes comprensibles para el usuario, usado de forma consistente en todos los formularios y tablas.
- **`utils/mockCollection.ts`**: fábrica genérica de colecciones mock (list/paginación/búsqueda/CRUD) reutilizada por los 6 servicios de negocio, evitando duplicar lógica.
- Formularios: validación Zod, deshabilitado de envío mientras procesa, mensajes de error persistentes (no se pierden los datos ingresados), confirmación para acciones destructivas (`ConfirmDialog`).
- Tablas (`DataTable`): búsqueda, paginación, ordenamiento por columna, estados de carga/vacío/error, badges de estado, acciones por fila — todo reutilizado desde `components/common/`.

## Docker

```bash
docker compose up -d --build
```

Sirve la aplicación en **http://localhost:8095**.

El contenedor corre en dos etapas:

1. **Build**: instala dependencias y compila Astro (`npm run build`) con las variables `PUBLIC_*` pasadas como *build args*.
2. **Runtime**: imagen Node + Nginx. Node ejecuta el servidor SSR (`dist/server/entry.mjs`) en `127.0.0.1:3000`; Nginx escucha en el puerto **80** (expuesto) y actúa como *reverse proxy* hacia Node, cacheando los assets estáticos de `_astro/`.

Para apuntar el build a un backend real, ajusta los `args` en `docker-compose.yml` (o pásalos por línea de comandos con `docker build --build-arg`):

```bash
docker build \
  --build-arg PUBLIC_API_BASE_URL=https://api.tudominio.com \
  --build-arg PUBLIC_KEYCLOAK_URL=https://auth.tudominio.com \
  --build-arg PUBLIC_KEYCLOAK_REALM=agroflowers-realm \
  --build-arg PUBLIC_KEYCLOAK_CLIENT_ID=agroflowers-web \
  --build-arg PUBLIC_USE_MOCKS=false \
  -t agroflowers-frontend .
```

## Evidencia de validación por fase

Cada fase se validó con `astro check` (0 errores de TypeScript) y `astro build` (build de producción exitoso) antes de continuar con la siguiente:

| Fase | Contenido | Archivos analizados | Resultado `astro check` |
|---|---|---|---|
| 1 | Estructura base, Tailwind, layouts, sidebar/topbar, login mock | 34 | 0 errores |
| 2 | Dashboard (8 indicadores + 5 gráficos + tabla), componentes comunes, mocks | 80 | 0 errores |
| 3 | Fincas, Flores, Compras (CRUD completo) | 103 | 0 errores |
| 4 | Embarques, Costos, Ventas (CRUD completo) | 126 | 0 errores |
| 5 | Rentabilidad (filtros + export CSV), Asistente IA (chat) | 134 | 0 errores |
| 6 | Integración real de Keycloak (`keycloak-js`), refresco de token, logout | 134 | 0 errores |
| 7 | Docker, Nginx, README | — | build de producción exitoso |

Se migró el proyecto a `output: 'server'` con adapter `@astrojs/node` en la Fase 3, ya que las rutas dinámicas (`/farms/[id]`, `/purchases/[id]`, etc.) requieren resolver IDs en tiempo de petición — inviable en modo `static` sin conocer de antemano todos los IDs posibles (los que se crean en tiempo real vía mocks o API no existen en tiempo de build).

## Notas y decisiones técnicas

- **Por qué SSR y no estático puro**: con `output: 'static'`, Astro exige generar en tiempo de build todas las rutas dinámicas (`getStaticPaths`), lo cual es incompatible con registros creados en tiempo real (una finca nueva no tendría una página `/farms/7` pre-generada). Se optó por `@astrojs/node` en modo `standalone`, con Nginx como reverse proxy — el mismo patrón usado en despliegues productivos de Astro con rutas dinámicas.
- **Autenticación real vs. mock**: en modo mock se usa un JWT simulado (payload en base64, sin firma) únicamente para desarrollo. En modo real, `keycloak-js` maneja el flujo completo (Authorization Code + PKCE, refresco silencioso de token cada 20s, logout centralizado en Keycloak).
- **Origen de "producto" en Ventas**: al no existir un catálogo de "productos" separado en el enunciado, el detalle de venta reutiliza el catálogo de variedades de flor (`flowers`), consistente con el resto del sistema.
- **Fila adicional en datos de prueba**: las tablas de costos y ventas del enunciado (seed original) solo cubrían 2 de los 3 embarques de ejemplo; se agregó una tercera fila (`EMB-000077`) en `mocks/costs.ts` y `mocks/sales.ts` para que coincida con el tercer registro ya presente en `mocks/profitability.ts` (clasificación `LOW`, usado como ejemplo de baja rentabilidad en el asistente de IA).

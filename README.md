# E-Commerce Project

Plataforma completa de comercio electrónico con frontend y backend.

## Estructura del Proyecto

El proyecto está dividido en dos partes principales:

### Backend

Desarrollado con Node.js, Express y Prisma:

- **config/**: Configuraciones globales de la aplicación
- **controllers/**: Lógica de negocio para cada endpoint
- **middlewares/**: Funciones intermediarias para autenticación y validación
- **prisma/**: Esquema de base de datos y migraciones
- **routes/**: Definición de rutas API
- **uploads/**: Almacenamiento de archivos subidos
- **utils/**: Utilidades comunes

### Frontend

Desarrollado con React:

- **admin/**: Panel de administración
  - **components/**: Componentes específicos del admin
  - **views/**: Vistas del panel administrativo
- **components/**: Componentes reutilizables
  - **Auth/**: Componentes de autenticación
  - **layout/**: Componentes de estructura
  - **ui/**: Componentes de interfaz de usuario
- **context/**: Gestión del estado global
- **hooks/**: Hooks personalizados
- **lib/**: Utilidades y servicios
- **pages/**: Páginas principales
- **routes/**: Configuración de rutas
- **utils/**: Funciones auxiliares

## Funcionalidades

- Gestión de productos y categorías
- Panel de administración
- Autenticación de usuarios
- Carrito de compras
- Procesamiento de pagos
- Gestión de pedidos
- Configuraciones del sitio

## Tecnologías Utilizadas

- **Backend**: Node.js, Express, Prisma, PostgreSQL
- **Frontend**: React, React Router, Context API
- **Despliegue**: Docker, GitHub Actions

## Instalación y Ejecución

### Requisitos Previos

- Node.js (v16 o superior)
- PostgreSQL
- npm o yarn

### Configuración del Backend

```bash
cd backend
npm install
npx prisma migrate dev
npm run dev
```

### Configuración del Frontend

```bash
cd frontend
npm install
npm run dev
```

## Contribuciones

Las contribuciones son bienvenidas. Por favor, sigue estos pasos:

1. Crea un fork del repositorio
2. Crea una rama para tu característica (`git checkout -b feature/amazing-feature`)
3. Realiza tus cambios y haz commit (`git commit -m 'Add some amazing feature'`)
4. Sube tu rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request
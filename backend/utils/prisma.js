import { PrismaClient } from '@prisma/client';

// Crear una instancia de PrismaClient con singleton pattern
const prisma = globalThis.prisma || new PrismaClient();

// En desarrollo, guarda la instancia en globalThis para evitar múltiples conexiones
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

// Middleware para logging (opcional)
prisma.$use(async (params, next) => {
  const before = Date.now();
  const result = await next(params);
  const after = Date.now();
  console.log(`Consulta ${params.model}.${params.action} tomó ${after - before}ms`);
  return result;
});

// Manejo de errores de conexión
prisma.$on('error', (e) => {
  console.error('Error de Prisma:', e);
});

// Exportar prisma como default y también como db para compatibilidad
export const db = prisma;
export default prisma; 
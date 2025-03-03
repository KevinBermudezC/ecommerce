/**
 * Middleware para verificar si el usuario tiene rol de administrador
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 * @param {Function} next - Función para continuar al siguiente middleware
 */
const adminMiddleware = (req, res, next) => {
  // Verificar si el usuario está autenticado y tiene rol de admin
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Acceso denegado. Se requiere rol de administrador." });
  }
  
  // Si el usuario es admin, continuar
  next();
};

export default adminMiddleware; 
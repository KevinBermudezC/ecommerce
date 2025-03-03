import jwt from "jsonwebtoken";
import prisma from "../utils/prisma.js";
import { JWT_SECRET } from "../config/env.js";

/**
 * Middleware para verificar la autenticación del usuario
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 * @param {Function} next - Función para continuar al siguiente middleware
 */
const authMiddleware = async (req, res, next) => {
	try {
		let token;

		// Obtener token del header Authorization o de las cookies
		if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
			token = req.headers.authorization.split(" ")[1];
		} else if (req.cookies?.token) {
			token = req.cookies.token;
		}

		// Verificar si existe el token
		if(!token) {
			return res.status(401).json({ message: 'No autorizado. Token no proporcionado.' });
		}

		// Verificar y decodificar el token
		const decoded = jwt.verify(token, JWT_SECRET);
		
		// Buscar el usuario en la base de datos
		const user = await prisma.user.findUnique({
			where: {
				id: decoded.id,
			},
		});
		
		// Verificar si el usuario existe
		if(!user) {
			return res.status(401).json({ message: 'No autorizado. Usuario no encontrado.' });
		}

		// Agregar el usuario al objeto de solicitud
		req.user = user;
				
		// Continuar con la siguiente función
		next();
	} catch (error) {
		console.error("Error de autenticación:", error);
		res.status(401).json({
			message: "No autorizado. Token inválido.",
			error: error.message,
		});
	}
}

export default authMiddleware;
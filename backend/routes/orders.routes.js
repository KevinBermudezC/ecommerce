import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";
import { 
  getOrders, 
  getOrderById, 
  updateOrderStatus, 
  getOrderStats, 
  getUserOrders
} from "../controllers/orders.controllers.js";

const ordersRouter = Router();

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Obtiene lista paginada de pedidos
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página para paginación
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Cantidad de pedidos por página
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, processing, shipped, delivered, cancelled]
 *         description: Filtrar por estado del pedido
 *     responses:
 *       200:
 *         description: Lista de pedidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 */
ordersRouter.get("/", authMiddleware, adminMiddleware, getOrders);

/**
 * @swagger
 * /api/orders/stats:
 *   get:
 *     summary: Obtiene estadísticas de pedidos
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas de pedidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 */
ordersRouter.get("/stats", authMiddleware, adminMiddleware, getOrderStats);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Obtiene un pedido por su ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del pedido
 *     responses:
 *       200:
 *         description: Datos del pedido
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Pedido no encontrado
 */
ordersRouter.get("/:id", authMiddleware, getOrderById);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   put:
 *     summary: Actualiza el estado de un pedido
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del pedido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, processing, shipped, delivered, cancelled]
 *                 required: true
 *     responses:
 *       200:
 *         description: Estado del pedido actualizado exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Pedido no encontrado
 */
ordersRouter.put("/:id/status", authMiddleware, adminMiddleware, updateOrderStatus);

/**
 * @swagger
 * /api/users/{userId}/orders:
 *   get:
 *     summary: Obtiene los pedidos de un usuario específico
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página para paginación
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Cantidad de pedidos por página
 *     responses:
 *       200:
 *         description: Lista de pedidos del usuario
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Usuario no encontrado
 */
// Esta ruta debe ir en users.routes.js
// ordersRouter.get("/users/:userId/orders", authMiddleware, getUserOrders);

export default ordersRouter; 
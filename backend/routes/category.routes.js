import { Router } from "express";
import { 
  createCategory, 
  getAllCategories, 
  getCategoryById, 
  updateCategory, 
  deleteCategory 
} from "../controllers/category.controllers.js";


const categoryRouter = Router();

// Añadir middleware de log para depuración
categoryRouter.use((req, res, next) => {
  console.log(`Petición a categoría: ${req.method} ${req.originalUrl}`);
  console.log('Body:', req.body);
  next();
});

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Obtiene una lista paginada de categorías
 *     tags: [Categories]
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
 *         description: Cantidad de categorías por página
 *     responses:
 *       200:
 *         description: Lista de categorías
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 categories:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 *                 totalCount:
 *                   type: integer
 */
categoryRouter.get("/", getAllCategories);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Obtiene una categoría por su ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la categoría
 *     responses:
 *       200:
 *         description: Datos de la categoría
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Categoría no encontrada
 */
categoryRouter.get("/:id", getCategoryById);

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Crea una nueva categoría
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 required: true
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Categoría creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 */
categoryRouter.post("/", createCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Actualiza una categoría existente
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la categoría
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Categoría actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Categoría no encontrada
 */
categoryRouter.put("/:id", updateCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Elimina una categoría
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la categoría
 *     responses:
 *       200:
 *         description: Categoría eliminada exitosamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Categoría no encontrada
 */
categoryRouter.delete("/:id", deleteCategory);



export default categoryRouter;
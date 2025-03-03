import prisma from "../utils/prisma.js";

/**
 * Crea una nueva categoría
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */
export const createCategory = async (req, res) => {
	try {
		console.log("Creando categoría con datos:", req.body);
		const { name, description } = req.body;

		// Validar datos requeridos
		if (!name) {
			return res.status(400).json({ 
				success: false,
				message: "El nombre de la categoría es obligatorio" 
			});
		}

		// Verificar si ya existe una categoría con el mismo nombre
		const existingCategory = await prisma.category.findFirst({
			where: { name },
		});

		if (existingCategory) {
			return res.status(400).json({ 
				success: false,
				message: "Ya existe una categoría con este nombre" 
			});
		}

		// Crear nueva categoría
		const newCategory = await prisma.category.create({
			data: {
				name,
				description: description || "",
			},
		});

		console.log("Categoría creada:", newCategory);

		res.status(201).json({
			success: true,
			message: "Categoría creada correctamente",
			data: newCategory
		});
	} catch (error) {
		console.error("Error al crear categoría:", error);
		res.status(500).json({ 
			success: false,
			message: "Error al crear la categoría",
			error: error.message
		});
	}
};

/**
 * Obtiene todas las categorías con paginación opcional
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */
export const getAllCategories = async (req, res) => {
	try {
		console.log('📥 Recibida petición GET /categories');
		const { page = 1, limit = 10 } = req.query;
		const skip = (parseInt(page) - 1) * parseInt(limit);
		const take = parseInt(limit);

		// Obtener categorías con paginación
		const [categories, totalCount] = await Promise.all([
			prisma.category.findMany({
				skip,
				take,
				orderBy: {
					name: 'asc'
				}
			}),
			prisma.category.count()
		]);

		console.log(`✅ Encontradas ${categories.length} categorías de un total de ${totalCount}`);

		res.status(200).json({
			success: true,
			categories,
			totalCount,
			currentPage: parseInt(page),
			totalPages: Math.ceil(totalCount / take),
		});
	} catch (error) {
		console.error("❌ Error al obtener categorías:", error);
		res.status(500).json({ 
			success: false,
			message: "Error al obtener las categorías",
			error: error.message
		});
	}
};

/**
 * Obtiene una categoría por su ID
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */
export const getCategoryById = async (req, res) => {
	try {
		const { id } = req.params;

		// Validar ID
		if (!id || isNaN(parseInt(id))) {
			return res.status(400).json({ message: "ID de categoría inválido" });
		}

		// Buscar categoría por ID
		const category = await prisma.category.findUnique({
			where: { id: parseInt(id) },
			include: {
				products: true, // Incluir productos relacionados con esta categoría
			},
		});

		if (!category) {
			return res.status(404).json({ message: "Categoría no encontrada" });
		}

		res.status(200).json(category);
	} catch (error) {
		console.error("Error al obtener categoría:", error);
		res.status(500).json({ message: "Error al obtener la categoría" });
	}
};

/**
 * Actualiza una categoría existente
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */
export const updateCategory = async (req, res) => {
	try {
		const { id } = req.params;
		const { name, description } = req.body;

		// Validar ID
		if (!id || isNaN(parseInt(id))) {
			return res.status(400).json({ message: "ID de categoría inválido" });
		}

		// Verificar si la categoría existe
		const existingCategory = await prisma.category.findUnique({
			where: { id: parseInt(id) },
		});

		if (!existingCategory) {
			return res.status(404).json({ message: "Categoría no encontrada" });
		}

		// Si se actualiza el nombre, verificar que no exista otra categoría con ese nombre
		if (name && name !== existingCategory.name) {
			const categoryWithSameName = await prisma.category.findUnique({
				where: { name },
			});

			if (categoryWithSameName) {
				return res.status(400).json({ message: "Ya existe una categoría con este nombre" });
			}
		}

		// Actualizar categoría
		const updatedCategory = await prisma.category.update({
			where: { id: parseInt(id) },
			data: {
				name: name || existingCategory.name,
				description: description !== undefined ? description : existingCategory.description,
			},
		});

		res.status(200).json(updatedCategory);
	} catch (error) {
		console.error("Error al actualizar categoría:", error);
		res.status(500).json({ message: "Error al actualizar la categoría" });
	}
};

/**
 * Elimina una categoría
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */
export const deleteCategory = async (req, res) => {
	try {
		const { id } = req.params;

		// Validar ID
		if (!id || isNaN(parseInt(id))) {
			return res.status(400).json({ message: "ID de categoría inválido" });
		}

		// Verificar si la categoría existe
		const existingCategory = await prisma.category.findUnique({
			where: { id: parseInt(id) },
			include: {
				products: true,
			},
		});

		if (!existingCategory) {
			return res.status(404).json({ message: "Categoría no encontrada" });
		}

		// Verificar si hay productos asociados a esta categoría
		if (existingCategory.products.length > 0) {
			return res.status(400).json({ 
				message: "No se puede eliminar la categoría porque tiene productos asociados",
				productCount: existingCategory.products.length
			});
		}

		// Eliminar categoría
		await prisma.category.delete({
			where: { id: parseInt(id) },
		});

		res.status(200).json({ message: "Categoría eliminada exitosamente" });
	} catch (error) {
		console.error("Error al eliminar categoría:", error);
		res.status(500).json({ message: "Error al eliminar la categoría" });
	}
};
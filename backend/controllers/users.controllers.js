import prisma from "../utils/prisma.js";

/**
 * Obtiene una lista paginada de usuarios
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */
export const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // Obtener usuarios con paginación, excluyendo contraseñas
    const users = await prisma.user.findMany({
      skip,
      take,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            orders: true,
          },
        },
      },
    });

    // Contar total de usuarios para paginación
    const totalCount = await prisma.user.count();

    res.status(200).json({
      users,
      totalCount,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalCount / take),
    });
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ message: "Error al obtener los usuarios" });
  }
};

/**
 * Obtiene un usuario específico por su ID
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar ID
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ message: "ID de usuario inválido" });
    }

    // Verificar permisos (solo el propio usuario o un admin pueden ver los detalles)
    if (req.user.role !== "admin" && req.user.id !== parseInt(id)) {
      return res.status(403).json({ message: "No tienes permiso para ver este usuario" });
    }

    // Buscar usuario por ID, excluyendo contraseña
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            orders: true,
            reviews: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    res.status(500).json({ message: "Error al obtener el usuario" });
  }
};

/**
 * Actualiza un usuario existente
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    // Validar ID
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ message: "ID de usuario inválido" });
    }

    // Verificar si el usuario existe
    const existingUser = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Si se actualiza el email, verificar que no exista otro usuario con ese email
    if (email && email !== existingUser.email) {
      const userWithSameEmail = await prisma.user.findUnique({
        where: { email },
      });

      if (userWithSameEmail) {
        return res.status(400).json({ message: "Ya existe un usuario con este email" });
      }
    }

    // Validar rol
    if (role && !["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Rol inválido. Debe ser 'user' o 'admin'" });
    }

    // Actualizar usuario
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        name: name || existingUser.name,
        email: email || existingUser.email,
        role: role || existingUser.role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ message: "Error al actualizar el usuario" });
  }
};

/**
 * Elimina un usuario
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar ID
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ message: "ID de usuario inválido" });
    }

    // Verificar si el usuario existe
    const existingUser = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Evitar que un admin elimine su propia cuenta
    if (existingUser.role === "admin" && req.user.id === parseInt(id)) {
      return res.status(400).json({ message: "No puedes eliminar tu propia cuenta de administrador" });
    }

    // Eliminar usuario
    await prisma.user.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: "Usuario eliminado exitosamente" });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ message: "Error al eliminar el usuario" });
  }
};

/**
 * Obtiene estadísticas de usuarios
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */
export const getUserStats = async (req, res) => {
  try {
    // Contar total de usuarios
    const totalUsers = await prisma.user.count();

    // Obtener fecha de inicio del mes actual
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    // Contar usuarios nuevos este mes
    const newUsersThisMonth = await prisma.user.count({
      where: {
        createdAt: {
          gte: startOfMonth,
        },
      },
    });

    // Obtener fecha de inicio del mes anterior
    const startOfPreviousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const endOfPreviousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0, 23, 59, 59);

    // Contar usuarios nuevos el mes anterior
    const newUsersLastMonth = await prisma.user.count({
      where: {
        createdAt: {
          gte: startOfPreviousMonth,
          lte: endOfPreviousMonth,
        },
      },
    });

    // Calcular crecimiento de usuarios
    const userGrowth = newUsersLastMonth > 0 
      ? ((newUsersThisMonth - newUsersLastMonth) / newUsersLastMonth) * 100 
      : 100;

    res.status(200).json({
      totalUsers,
      newUsersThisMonth,
      userGrowth: parseFloat(userGrowth.toFixed(2)),
    });
  } catch (error) {
    console.error("Error al obtener estadísticas de usuarios:", error);
    res.status(500).json({ message: "Error al obtener estadísticas de usuarios" });
  }
};

/**
 * Obtiene los pedidos de un usuario específico
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */
export const getUserOrders = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // Validar ID de usuario
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ message: "ID de usuario inválido" });
    }

    // Verificar permisos (solo el propio usuario o un admin pueden ver sus pedidos)
    if (req.user.role !== "admin" && req.user.id !== parseInt(id)) {
      return res.status(403).json({ message: "No tienes permiso para ver estos pedidos" });
    }

    // Verificar si el usuario existe
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Obtener pedidos del usuario con paginación
    const orders = await prisma.order.findMany({
      where: { userId: parseInt(id) },
      skip,
      take,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        payment: true,
      },
    });

    // Contar total de pedidos para paginación
    const totalCount = await prisma.order.count({
      where: { userId: parseInt(id) },
    });

    res.status(200).json({
      orders,
      totalCount,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalCount / take),
    });
  } catch (error) {
    console.error("Error al obtener pedidos del usuario:", error);
    res.status(500).json({ message: "Error al obtener los pedidos del usuario" });
  }
}; 
import { db } from '../utils/db.js';

/**
 * Obtiene una lista paginada de órdenes
 */
export const getOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status;

    // Construir el filtro de búsqueda
    const whereClause = {};
    if (status) {
      whereClause.status = status.toLowerCase();
    }

    // Obtener órdenes con paginación y relaciones
    const orders = await db.order.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                image: true
              }
            }
          }
        }
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Contar el total de órdenes para paginación
    const totalCount = await db.order.count({
      where: whereClause
    });

    // Formatear los datos para la respuesta
    const formattedOrders = orders.map(order => {
      // Calcular el total sumando todos los items
      const total = order.orderItems.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
      }, 0);

      return {
        id: order.id,
        userId: order.userId,
        status: order.status,
        total: total,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        items: order.orderItems.map(item => ({
          id: item.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          productName: item.product?.name || ""
        })),
        userName: order.user?.name || "",
        userEmail: order.user?.email || "",
      };
    });

    return res.json({
      orders: formattedOrders,
      totalCount
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene una orden por su ID
 */
export const getOrderById = async (req, res, next) => {
  try {
    const orderId = parseInt(req.params.id);

    // Validar que el ID sea un número válido
    if (isNaN(orderId)) {
      return res.status(400).json({
        success: false,
        message: "ID de orden inválido"
      });
    }

    // Obtener la orden con sus relaciones
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                image: true
              }
            }
          }
        },
        payment: true
      }
    });

    // Verificar si se encontró la orden
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Orden no encontrada"
      });
    }

    // Verificar si el usuario solicitante es el propietario o un administrador
    if (req.user.id !== order.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "No tiene permiso para ver esta orden"
      });
    }

    // Calcular el total sumando todos los items
    const total = order.orderItems.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    // Formatear la respuesta
    const formattedOrder = {
      id: order.id,
      userId: order.userId,
      status: order.status,
      total: total,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      items: order.orderItems.map(item => ({
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        productName: item.product?.name || "",
        productImage: item.product?.image || ""
      })),
      userName: order.user?.name || "",
      userEmail: order.user?.email || "",
      payment: order.payment ? {
        id: order.payment.id,
        amount: order.payment.amount,
        method: order.payment.method,
        status: order.payment.status,
        createdAt: order.payment.createdAt
      } : null
    };

    return res.json(formattedOrder);
  } catch (error) {
    next(error);
  }
};

/**
 * Actualiza el estado de una orden
 */
export const updateOrderStatus = async (req, res, next) => {
  try {
    const orderId = parseInt(req.params.id);
    const { status } = req.body;

    // Validar que el ID sea un número válido
    if (isNaN(orderId)) {
      return res.status(400).json({
        success: false,
        message: "ID de orden inválido"
      });
    }

    // Validar el estado
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!status || !validStatuses.includes(status.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: "Estado inválido. Debe ser uno de: " + validStatuses.join(", ")
      });
    }

    // Verificar que la orden exista
    const existingOrder = await db.order.findUnique({
      where: { id: orderId }
    });

    if (!existingOrder) {
      return res.status(404).json({
        success: false,
        message: "Orden no encontrada"
      });
    }

    // Actualizar el estado de la orden
    const updatedOrder = await db.order.update({
      where: { id: orderId },
      data: {
        status: status.toLowerCase()
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        orderItems: {
          include: {
            product: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });

    // Calcular el total sumando todos los items
    const total = updatedOrder.orderItems.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    // Formatear la respuesta
    const formattedOrder = {
      id: updatedOrder.id,
      userId: updatedOrder.userId,
      status: updatedOrder.status,
      total: total,
      createdAt: updatedOrder.createdAt,
      updatedAt: updatedOrder.updatedAt,
      items: updatedOrder.orderItems.map(item => ({
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        productName: item.product?.name || ""
      })),
      userName: updatedOrder.user?.name || "",
      userEmail: updatedOrder.user?.email || ""
    };

    return res.json(formattedOrder);
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene estadísticas de órdenes
 */
export const getOrderStats = async (req, res, next) => {
  try {
    // Obtener el número total de órdenes
    const totalOrders = await db.order.count();

    // Calcular el total de ingresos sumando todos los items de las órdenes
    const orderItems = await db.orderItem.findMany();
    const totalRevenue = orderItems.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    // Obtener la fecha de hace un mes
    const monthAgoDate = new Date();
    monthAgoDate.setMonth(monthAgoDate.getMonth() - 1);

    // Obtener todas las órdenes del último mes
    const recentOrders = await db.order.findMany({
      where: {
        createdAt: {
          gte: monthAgoDate
        }
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        orderItems: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Contar órdenes del mes actual
    const ordersThisMonth = recentOrders.length;

    // Calcular ingresos del mes actual
    const revenueThisMonth = recentOrders.reduce((sum, order) => {
      const orderTotal = order.orderItems.reduce((itemSum, item) => {
        return itemSum + (item.price * item.quantity);
      }, 0);
      return sum + orderTotal;
    }, 0);

    // Obtener la fecha de hace dos meses
    const twoMonthsAgoDate = new Date();
    twoMonthsAgoDate.setMonth(twoMonthsAgoDate.getMonth() - 2);

    // Obtener órdenes del mes anterior
    const previousMonthOrders = await db.order.findMany({
      where: {
        createdAt: {
          gte: twoMonthsAgoDate,
          lt: monthAgoDate
        }
      },
      include: {
        orderItems: true
      }
    });

    // Contar órdenes del mes anterior
    const ordersPreviousMonth = previousMonthOrders.length;

    // Calcular ingresos del mes anterior
    const revenuePreviousMonth = previousMonthOrders.reduce((sum, order) => {
      const orderTotal = order.orderItems.reduce((itemSum, item) => {
        return itemSum + (item.price * item.quantity);
      }, 0);
      return sum + orderTotal;
    }, 0);

    // Calcular el crecimiento de órdenes (porcentaje)
    let orderGrowth = 0;
    if (ordersPreviousMonth > 0) {
      orderGrowth = ((ordersThisMonth - ordersPreviousMonth) / ordersPreviousMonth) * 100;
    } else if (ordersThisMonth > 0) {
      orderGrowth = 100; // Si no había órdenes el mes anterior, el crecimiento es del 100%
    }

    // Calcular el crecimiento de ingresos (porcentaje)
    let revenueGrowth = 0;
    if (revenuePreviousMonth > 0) {
      revenueGrowth = ((revenueThisMonth - revenuePreviousMonth) / revenuePreviousMonth) * 100;
    } else if (revenueThisMonth > 0) {
      revenueGrowth = 100; // Si no había ingresos el mes anterior, el crecimiento es del 100%
    }

    // Formatear las órdenes recientes para la respuesta
    const formattedRecentOrders = recentOrders.slice(0, 5).map(order => {
      const total = order.orderItems.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
      }, 0);
      
      return {
        id: order.id,
        userId: order.userId,
        status: order.status,
        total: total,
        createdAt: order.createdAt,
        userName: order.user?.name || "",
        userEmail: order.user?.email || ""
      };
    });

    return res.json({
      totalOrders,
      totalRevenue,
      ordersThisMonth,
      revenueThisMonth,
      orderGrowth,
      revenueGrowth,
      recentOrders: formattedRecentOrders
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene las órdenes de un usuario específico
 */
export const getUserOrders = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Validar que el ID sea un número válido
    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: "ID de usuario inválido"
      });
    }

    // Verificar que el usuario exista
    const user = await db.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado"
      });
    }

    // Verificar si el usuario solicitante es el propietario o un administrador
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "No tiene permiso para ver las órdenes de este usuario"
      });
    }

    // Obtener órdenes del usuario con paginación
    const orders = await db.order.findMany({
      where: { userId },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                name: true
              }
            }
          }
        }
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Contar el total de órdenes del usuario
    const totalCount = await db.order.count({
      where: { userId }
    });

    // Formatear las órdenes para la respuesta
    const formattedOrders = orders.map(order => {
      const total = order.orderItems.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
      }, 0);

      return {
        id: order.id,
        userId: order.userId,
        status: order.status,
        total: total,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        items: order.orderItems.map(item => ({
          id: item.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          productName: item.product?.name || ""
        }))
      };
    });

    return res.json({
      orders: formattedOrders,
      totalCount
    });
  } catch (error) {
    next(error);
  }
}; 
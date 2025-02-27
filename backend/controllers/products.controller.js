import { db } from '../utils/db.js';

export const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, stock, image, category_id } = req.body;

    // Validaciones básicas
    if (!name || !price || !stock || !category_id) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing required fields (name, price, stock, category_id)." 
      });
    }

    // Asegurar que price y stock sean valores numéricos válidos
    const parsedPrice = parseFloat(price);
    const parsedStock = parseInt(stock);

    if (isNaN(parsedPrice) || isNaN(parsedStock)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid price or stock value. They must be numbers." 
      });
    }

    // Verificar que la categoría exista antes de asociarla
    const existingCategory = await db.category.findUnique({
      where: { id: parseInt(category_id) }
    });

    if (!existingCategory) {
      return res.status(404).json({ 
        success: false, 
        message: "Category not found." 
      });
    }

    // Crear el producto en la base de datos
    const product = await db.product.create({
      data: {
        name,
        description: description || "", // Permitir que sea opcional
        price: parsedPrice,
        stock: parsedStock,
        image: image || "https://example.com/default-product.jpg", // Imagen por defecto si no se proporciona
        category: {
          connect: { id: parseInt(category_id) }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product
    });

  } catch (error) {
    console.error("Error creating product:", error);
    next(error);
  }
};


export const getAllProducts = async (req,res,next) => {
  try {
    const products = await db.product.findMany({
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      data: products
    });
    
  } catch (error) {
    console.error("Error getting products:", error);
    next(error);
  }
}

export const getSingleProduct = async (req,res,next) => {
  try {
    const { id } = req.params;
    const product = await db.product.findUnique({
      where: {
        id: parseInt(id)
      },
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Product retrieved successfully",
      data: product
    });

  } catch (error) {
    console.error("Error getting single product:", error);
    next(error);
  }
}

export const updateProduct = async (req,res,next) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, image, category_id } = req.body;
    
    const product = await db.product.update({
      where: {
        id: parseInt(id)
      },
      data: {
        name,
        description,
        price,
        stock,
        image,
        category: {
          connect: { id: parseInt(category_id) }
        }
      }
    });

    // Validaciones básicas
    if (!name || !price || !stock || !category_id) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing required fields (name, price, stock, category_id)." 
      });
    }
    
    // Asegurar que price y stock sean valores numéricos válidos
    const parsedPrice = parseFloat(price);
    const parsedStock = parseInt(stock);
    
    if (isNaN(parsedPrice) || isNaN(parsedStock)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid price or stock value. They must be numbers." 
      });
    }
    
    // Verificar que la categoría exista antes de asociarla
    const existingCategory = await db.category.findUnique({
      where: { id: parseInt(category_id) }
    });
    
    if (!existingCategory) {
      return res.status(404).json({ 
        success: false, 
        message: "Category not found." 
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product
    });

  } catch (error) {
    console.error("Error updating product:", error);
    next(error);
  }
}

export const deleteProduct = async (req,res,next) => {
  try {
    const { id } = req.params;
    const product = await db.product.delete({
      where: {
        id: parseInt(id)
      }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: product
    });

  } catch (error) {
    console.error("Error deleting product:", error);
    next(error);
  }
}
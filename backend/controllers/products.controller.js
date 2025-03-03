import { db } from '../utils/db.js';
import { uploadImage } from '../utils/cloudinary.js';
import fs from 'fs';

export const createProduct = async (req, res, next) => {
  try {
    console.log("Datos recibidos:", req.body);
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
        image: image || "", // No usar URL por defecto, dejar vacío si no hay imagen
        category: {
          connect: { id: parseInt(category_id) }
        }
      }
    });

    console.log("Producto creado:", product);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product
    });

  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({
      success: false,
      message: "Error creating product",
      error: error.message
    });
    next(error)
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
    
    // Actualizar el producto después de las validaciones
    const product = await db.product.update({
      where: {
        id: parseInt(id)
      },
      data: {
        name,
        description,
        price: parsedPrice,
        stock: parsedStock,
        image,
        category: {
          connect: { id: parseInt(category_id) }
        }
      }
    });

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

export const uploadProductImage = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log("Subiendo imagen para producto ID:", id);
    console.log("Archivo recibido:", req.file);
    
    // Verificar si el producto existe
    const product = await db.product.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!product) {
      // Si hay un archivo temporal, eliminarlo
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado"
      });
    }
    
    // Verificar si se envió una imagen
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No se ha proporcionado ninguna imagen"
      });
    }
    
    // Subir imagen a Cloudinary
    console.log("Subiendo imagen a Cloudinary...");
    const result = await uploadImage(req.file.path);
    console.log("Resultado de Cloudinary:", result);
    
    // Eliminar archivo temporal
    fs.unlinkSync(req.file.path);
    
    // Actualizar la URL de la imagen en la base de datos
    const updatedProduct = await db.product.update({
      where: { id: parseInt(id) },
      data: { image: result.secure_url }
    });
    
    console.log("Producto actualizado con imagen:", updatedProduct);
    
    res.status(200).json({
      success: true,
      message: "Imagen subida correctamente",
      imageUrl: result.secure_url,
      data: updatedProduct
    });
    
  } catch (error) {
    console.error("Error al subir imagen:", error);
    
    // Eliminar archivo temporal en caso de error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      message: "Error al subir la imagen",
      error: error.message
    });
    next(error)
  }
};
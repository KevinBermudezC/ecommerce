import { db } from '../utils/db.js';
import { uploadImage } from '../utils/cloudinary.js';
import fs from 'fs';

// ... existing code ...

export const uploadCategoryImage = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log("Subiendo imagen para categoría ID:", id);
    console.log("Archivo recibido:", req.file);
    
    // Verificar si la categoría existe
    const category = await db.category.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!category) {
      // Si hay un archivo temporal, eliminarlo
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      
      return res.status(404).json({
        success: false,
        message: "Categoría no encontrada"
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
    const result = await uploadImage(req.file.path, 'ecommerce/categories');
    console.log("Resultado de Cloudinary:", result);
    
    // Eliminar archivo temporal
    fs.unlinkSync(req.file.path);
    
    // Actualizar la URL de la imagen en la base de datos
    const updatedCategory = await db.category.update({
      where: { id: parseInt(id) },
      data: { image: result.secure_url }
    });
    
    console.log("Categoría actualizada con imagen:", updatedCategory);
    
    res.status(200).json({
      success: true,
      message: "Imagen subida correctamente",
      imageUrl: result.secure_url,
      data: updatedCategory
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
    next(error);
  }
}; 
import { v2 as cloudinary } from 'cloudinary';

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Verificar que la configuración sea correcta
console.log("Configuración de Cloudinary:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY ? "***" : "undefined", // Ocultar la clave API por seguridad
  api_secret: process.env.CLOUDINARY_API_SECRET ? "***" : "undefined" // Ocultar el secret por seguridad
});

/**
 * Función para subir una imagen a Cloudinary
 * @param {string} filePath - Ruta temporal del archivo
 * @param {string} folder - Carpeta donde se guardará en Cloudinary
 * @returns {Promise} - Resultado de la subida
 */
export const uploadImage = async (filePath, folder = 'ecommerce/products') => {
  try {
    console.log("Iniciando carga a Cloudinary:", filePath);
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: 'auto'
    });
    console.log("Imagen subida exitosamente a Cloudinary");
    return result;
  } catch (error) {
    console.error('Error detallado al subir imagen a Cloudinary:', error);
    throw new Error(`Error al subir la imagen: ${error.message}`);
  }
};

export default cloudinary; 
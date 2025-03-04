import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Obtener todas las configuraciones
const getAllConfigs = async (req, res) => {
  try {
    const configs = await prisma.siteConfig.findMany();
    res.json(configs);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las configuraciones' },error);
  }
};

// Obtener una configuración específica por key
const getConfigByKey = async (req, res) => {
  try {
    const { key } = req.params;
    const config = await prisma.siteConfig.findUnique({
      where: { key }
    });
    if (!config) {
      return res.status(404).json({ error: 'Configuración no encontrada' });
    }
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la configuración' },error);
  }
};

// Crear o actualizar una configuración
const upsertConfig = async (req, res) => {
  try {
    const { key, type, value, label, description } = req.body;
    
    const config = await prisma.siteConfig.upsert({
      where: { key },
      update: { type, value, label, description },
      create: { key, type, value, label, description }
    });
    
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar la configuración' },error);
  }
};

// Eliminar una configuración
const deleteConfig = async (req, res) => {
  try {
    const { key } = req.params;
    await prisma.siteConfig.delete({
      where: { key }
    });
    res.json({ message: 'Configuración eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la configuración' },error);
  }
};

export {
  getAllConfigs,
  getConfigByKey,
  upsertConfig,
  deleteConfig
}; 
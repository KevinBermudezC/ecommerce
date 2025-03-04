import { Router } from 'express';
const router = Router();
import  authMiddleware  from '../middlewares/auth.middleware.js';
import { getAllConfigs, getConfigByKey, upsertConfig, deleteConfig } from '../controllers/siteConfig.controller.js';

// Rutas públicas
router.get('/', getAllConfigs);
router.get('/:key', getConfigByKey);

// Rutas protegidas (solo admin)
router.post('/', authMiddleware, upsertConfig);
router.put('/:key', authMiddleware, upsertConfig);
router.delete('/:key', authMiddleware, deleteConfig);

export default router; 
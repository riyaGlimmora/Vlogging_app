import { Router } from 'express';
import {
  getVlogs,
  getVlog,
  createVlog,
  updateVlog,
  deleteVlog,
  toggleLike,
} from '../controllers/vlogController.js';
import { protect } from '../middleware/auth.js';
import { uploadVlogMedia } from '../middleware/upload.js';
import { createVlogValidator, updateVlogValidator } from '../validators/vlogValidator.js';
import validate from '../middleware/validate.js';

const router = Router();

router.get('/', getVlogs);
router.get('/:id', getVlog);
router.post('/', protect, uploadVlogMedia, createVlogValidator, validate, createVlog);
router.put('/:id', protect, uploadVlogMedia, updateVlogValidator, validate, updateVlog);
router.delete('/:id', protect, deleteVlog);
router.post('/:id/like', protect, toggleLike);

export default router;

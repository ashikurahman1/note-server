import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createANote,
  deleteANote,
  getAllNotes,
  getNoteById,
  updateANote,
} from '../controllers/notesController.js';

const router = express.Router();

router.get('/', protect, getAllNotes);
router.get('/:id', protect, getNoteById);
router.post('/', protect, createANote);
router.put('/:id', protect, updateANote);
router.delete('/:id', protect, deleteANote);

export default router;

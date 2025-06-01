import express from 'express';
import multer from 'multer';
import { createTemplate, getTemplates, updateTemplate, deleteTemplate } from '../controllers/templateController.js';
import { analyzeTemplate } from '../services/templateProcessor.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('file'), createTemplate);
router.post('/analyze', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const analysis = await analyzeTemplate(req.file);
    res.json(analysis);
  } catch (error) {
    next(error);
  }
});
router.get('/', getTemplates);
router.put('/:id', updateTemplate);
router.delete('/:id', deleteTemplate);

export default router;

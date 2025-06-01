import express from 'express';
import multer from 'multer';
import { processDocument, getDocumentStatus, getAllDocuments } from '../controllers/documentController.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), processDocument);
router.get('/status/:id', getDocumentStatus);
router.get('/', getAllDocuments);

export default router;
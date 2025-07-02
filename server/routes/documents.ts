// @ts-ignore
import express, { type Router } from 'express';
// @ts-ignore
import multer, { type Multer } from 'multer';
import { 
  processDocument, 
  getDocumentStatus, 
  getAllDocuments 
} from '../controllers/documentController.js';

const router: Router = express.Router();
const upload: Multer = multer({ 
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Upload a document for processing
router.post('/upload', upload.single('file'), processDocument);

// Get status of a specific document
router.get('/status/:id', getDocumentStatus);

// Get all documents
router.get('/', getAllDocuments);

export default router;
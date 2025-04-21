import express from 'express';
import multer from 'multer';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { convertPdfToHtml } from './utils/convertPdf.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    fs.mkdirSync('./uploads', { recursive: true });
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '15mb' })); // For parsing base64 encoded PDFs

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    message: 'PDF to HTML API is running'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    service: 'PDF to HTML Conversion API',
    endpoints: {
      health: '/api/health',
      uploadPdf: '/api/pdf-to-html/upload',
      base64Pdf: '/api/pdf-to-html/base64'
    }
  });
});

// Route for PDF file upload to HTML conversion
app.post('/api/pdf-to-html/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    const result = await handlePdfConversion(file.path);
    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }

    res.download(result.outputPath, 'converted.html', () => {
      // Clean up files after sending
      cleanupFiles(file.path, result.outputDir);
    });
  } catch (error) {
    console.error('Error in PDF upload conversion:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Route for base64 PDF to HTML conversion
app.post('/api/pdf-to-html/base64', async (req, res) => {
  try {
    const { base64pdf } = req.body;
    
    if (!base64pdf) {
      return res.status(400).json({ error: 'No base64 PDF data provided' });
    }

    // Create a temporary file from the base64 data
    const tempFilename = `temp-${Date.now()}-${Math.round(Math.random() * 1E9)}.pdf`;
    const tempFilePath = path.join(__dirname, 'uploads', tempFilename);
    
    // Ensure uploads directory exists
    fs.mkdirSync('./uploads', { recursive: true });

    // Extract actual base64 content if it includes data URI scheme
    let base64Data = base64pdf;
    if (base64pdf.includes('base64,')) {
      base64Data = base64pdf.split('base64,')[1];
    }

    // Write the base64 data to a temporary file
    fs.writeFileSync(tempFilePath, Buffer.from(base64Data, 'base64'));

    const result = await handlePdfConversion(tempFilePath);
    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }

    res.download(result.outputPath, 'converted.html', () => {
      // Clean up files after sending
      cleanupFiles(tempFilePath, result.outputDir);
    });
  } catch (error) {
    console.error('Error in base64 PDF conversion:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Helper function to handle PDF conversion
async function handlePdfConversion(filePath) {
  const outputDir = path.join(__dirname, 'output', path.basename(filePath, '.pdf'));
  const outputHtml = path.join(outputDir, 'output.html');
  
  // Create output directory if it doesn't exist
  fs.mkdirSync(outputDir, { recursive: true });

  console.log(`Converting file: ${filePath} to directory: ${outputDir}`);
  
  try {
    const converted = await convertPdfToHtml(filePath, outputDir);
    
    if (!converted || !fs.existsSync(outputHtml)) {
      console.error('Conversion failed - output file not found');
      return { success: false, error: 'Conversion failed' };
    }

    return { 
      success: true, 
      outputPath: outputHtml,
      outputDir: outputDir
    };
  } catch (error) {
    console.error('Conversion error:', error);
    return { success: false, error: error.message || 'Unknown conversion error' };
  }
}

// Helper function to clean up files
function cleanupFiles(filePath, outputDir) {
  setTimeout(() => {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      if (fs.existsSync(outputDir)) {
        fs.rmSync(outputDir, { recursive: true, force: true });
      }
    } catch (err) {
      console.error('Error cleaning up files:', err);
    }
  }, 1000);
}

app.listen(PORT, () => {
  console.log(`🚀 PDF to HTML API server running at http://localhost:${PORT}`);
});
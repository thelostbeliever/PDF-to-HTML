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

const upload = multer({ dest: 'uploads/' });
app.use(cors());

app.post('/api/pdf-to-html', upload.single('file'), async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'No file uploaded' });

  const outputDir = path.join(__dirname, 'output', file.filename);
  const outputHtml = path.join(outputDir, 'output.html');
  fs.mkdirSync(outputDir, { recursive: true });

  const converted = await convertPdfToHtml(file.path, outputDir);
  if (!converted || !fs.existsSync(outputHtml)) {
    return res.status(500).json({ error: 'Conversion failed' });
  }

  res.download(outputHtml, 'converted.html', () => {
    fs.unlinkSync(file.path);
    fs.rmSync(outputDir, { recursive: true, force: true });
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

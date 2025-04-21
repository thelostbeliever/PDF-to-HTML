import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import PDFToHTML from 'pdftohtmljs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Convert PDF file to HTML using pdftohtmljs
 * 
 * @param {string} inputPath - Path to the input PDF file
 * @param {string} outputDir - Directory where the HTML output will be saved
 * @returns {Promise<boolean>} - True if conversion was successful, false otherwise
 */
export async function convertPdfToHtml(inputPath, outputDir) {
  try {
    // Check if the input file exists
    if (!fs.existsSync(inputPath)) {
      console.error(`Input file does not exist: ${inputPath}`);
      return false;
    }
    
    const outputHtml = path.join(outputDir, 'output.html');
    
    // Create instance with input PDF and HTML output path
    const converter = new PDFToHTML(inputPath, outputHtml);
    
    // Set conversion options
    converter.convert({
      'zoom': 1.5,       // Zoom factor
      'embed': 'cfijo',  // Embed fonts, frames, images, JavaScript, and outlines
      'dest-dir': outputDir // Output directory for resources
    }).then(() => {
      console.log(`PDF conversion complete: ${outputHtml}`);
    }).catch(err => {
      console.error('Conversion error:', err);
    });
    
    // Return a Promise for the conversion
    return new Promise((resolve) => {
      converter.success(() => {
        console.log('Conversion successfully finished');
        resolve(true);
      });
      
      converter.error((err) => {
        console.error('Conversion error:', err);
        resolve(false);
      });
    });
  } catch (error) {
    console.error('Error converting PDF to HTML:', error);
    return false;
  }
}
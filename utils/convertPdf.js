import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

const execPromise = promisify(exec);

/**
 * Convert PDF file to HTML using pdf2htmlEX
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
    
    // Create a command to convert PDF to HTML using pdf2htmlEX
    // --dest-dir: Specify output directory
    // --zoom: Zoom factor, default is 1.5
    // --embed cfijo: Embed fonts, frames, images, JavaScript, and outlines
    const command = `pdf2htmlEX --dest-dir "${outputDir}" --zoom 1.5 --embed cfijo "${inputPath}" output.html`;
    
    console.log(`Executing: ${command}`);
    
    const { stdout, stderr } = await execPromise(command);
    
    if (stderr && !stderr.includes('Warning')) {
      console.error('Conversion stderr:', stderr);
    }
    
    console.log('Conversion stdout:', stdout);
    
    // Verify the output file exists
    const outputFile = path.join(outputDir, 'output.html');
    if (fs.existsSync(outputFile)) {
      return true;
    } else {
      console.error(`Output file not created: ${outputFile}`);
      return false;
    }
  } catch (error) {
    console.error('Error converting PDF to HTML:', error);
    return false;
  }
}
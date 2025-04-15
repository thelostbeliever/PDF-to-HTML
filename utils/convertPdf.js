import { exec } from 'child_process';
import path from 'path';

export function convertPdfToHtml(inputPath, outputDir) {
  return new Promise((resolve, reject) => {
    const outputHtmlPath = path.join(outputDir, 'output.html');

    // Construct the pdf2htmlEX command
    const command = `pdf2htmlEX --embed cfijo --dest-dir "${outputDir}" --output "${outputHtmlPath}" "${inputPath}"`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error('❌ Error during PDF to HTML conversion:', stderr);
        return reject(false);
      }
      console.log('✅ PDF to HTML conversion completed');
      resolve(true);
    });
  });
}

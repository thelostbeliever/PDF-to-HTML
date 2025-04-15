import { exec } from 'child_process';

export function convertPdfToHtml(inputPath, outputDir) {
  return new Promise((resolve) => {
    const command = `pdf2htmlEX --embed cfijo --dest-dir "${outputDir}" "${inputPath}" "${outputDir}/output.html"`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error('Conversion Error:', stderr);
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

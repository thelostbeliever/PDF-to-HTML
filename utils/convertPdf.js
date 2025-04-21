import fs from 'fs';
import * as pdfjsLib from 'pdfjs-dist';
import { JSDOM } from 'jsdom';
import path from 'path';

export async function convertPdfToHtml(inputPath, outputDir) {
  try {
    // Read PDF file
    const data = new Uint8Array(fs.readFileSync(inputPath));
    
    // Load PDF document
    const loadingTask = pdfjsLib.getDocument({ data });
    const pdfDocument = await loadingTask.promise;
    
    // Create HTML structure
    const dom = new JSDOM('<!DOCTYPE html><html><head><meta charset="utf-8"><title>Converted PDF</title></head><body></body></html>');
    const document = dom.window.document;
    
    // Add basic styling
    const style = document.createElement('style');
    style.textContent = `
      body { font-family: Arial, sans-serif; margin: 20px; }
      .page { border: 1px solid #ddd; margin-bottom: 20px; padding: 20px; }
      .text-layer { position: relative; }
      .text-item { position: absolute; }
    `;
    document.head.appendChild(style);
    
    // Process each page
    for (let i = 1; i <= pdfDocument.numPages; i++) {
      const page = await pdfDocument.getPage(i);
      const viewport = page.getViewport({ scale: 1.5 });
      
      // Create page container
      const pageDiv = document.createElement('div');
      pageDiv.className = 'page';
      pageDiv.style.width = `${viewport.width}px`;
      pageDiv.style.height = `${viewport.height}px`;
      
      // Get text content
      const textContent = await page.getTextContent();
      
      // Create text layer
      const textLayer = document.createElement('div');
      textLayer.className = 'text-layer';
      textLayer.style.width = `${viewport.width}px`;
      textLayer.style.height = `${viewport.height}px`;
      
      // Add text elements
      for (const item of textContent.items) {
        if (!item.str) continue;
        
        const tx = pdfjsLib.Util.transform(
          viewport.transform,
          item.transform
        );
        
        const textDiv = document.createElement('div');
        textDiv.className = 'text-item';
        textDiv.textContent = item.str;
        textDiv.style.left = `${tx[4]}px`;
        textDiv.style.top = `${tx[5]}px`;
        textDiv.style.fontSize = `${Math.sqrt((tx[0] * tx[0]) + (tx[1] * tx[1]))}px`;
        textDiv.style.transform = `scaleX(${tx[0] / Math.sqrt((tx[0] * tx[0]) + (tx[1] * tx[1]))})`;
        
        textLayer.appendChild(textDiv);
      }
      
      pageDiv.appendChild(textLayer);
      document.body.appendChild(pageDiv);
    }
    
    // Write HTML to file
    const outputPath = path.join(outputDir, 'output.html');
    fs.writeFileSync(outputPath, dom.serialize());
    
    return true;
  } catch (error) {
    console.error('Error converting PDF to HTML:', error);
    return false;
  }
}
import mammoth from 'mammoth';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';

interface ProcessingResult {
  success: boolean;
  content?: string;
  base64?: string;
  error?: string;
  metadata?: {
    format: string;
    processedAt: Date;
  };
}

/**
 * Read and extract text content from a DOCX file
 */
export const extractTextFromDocx = async (file: File | Blob): Promise<ProcessingResult> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    
    return {
      success: true,
      content: result.value,
      metadata: {
        format: 'docx',
        processedAt: new Date()
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to extract text from DOCX'
    };
  }
};

/**
 * Generate a DOCX document from template with variables
 */
export const generateDocxFromTemplate = async (
  templateContent: ArrayBuffer,
  variables: Record<string, string>
): Promise<ProcessingResult> => {
  try {
    const zip = new PizZip(templateContent);
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });
    
    // Set template variables
    doc.setData(variables);
    
    // Render the document
    doc.render();
    
    // Get the document as base64
    const buf = doc.getZip().generate({
      type: 'base64',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });
    
    return {
      success: true,
      base64: buf,
      metadata: {
        format: 'docx',
        processedAt: new Date()
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate DOCX'
    };
  }
};

/**
 * Generate a PDF document from text content
 */
export const generatePdfFromText = async (
  content: string,
  metadata?: {
    title?: string;
    author?: string;
  }
): Promise<ProcessingResult> => {
  try {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    
    // Add metadata if provided
    if (metadata?.title) {
      pdfDoc.setTitle(metadata.title);
    }
    if (metadata?.author) {
      pdfDoc.setAuthor(metadata.author);
    }
    
    // Embed the Helvetica font
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    
    // Add pages and content
    const lines = content.split('\n');
    let currentPage = pdfDoc.addPage();
    let { height } = currentPage.getSize();
    let yPosition = height - 50;
    const fontSize = 12;
    const lineHeight = fontSize * 1.2;
    
    for (const line of lines) {
      // Check if we need a new page
      if (yPosition < 50) {
        currentPage = pdfDoc.addPage();
        yPosition = height - 50;
      }
      
      // Draw the text
      currentPage.drawText(line, {
        x: 50,
        y: yPosition,
        size: fontSize,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });
      
      yPosition -= lineHeight;
    }
    
    // Serialize the PDF to base64
    const pdfBytes = await pdfDoc.saveAsBase64();
    
    return {
      success: true,
      base64: pdfBytes,
      metadata: {
        format: 'pdf',
        processedAt: new Date()
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate PDF'
    };
  }
};

/**
 * Convert HTML content to PDF
 */
export const convertHtmlToPdf = async (htmlContent: string): Promise<ProcessingResult> => {
  try {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    
    // Add a page
    const page = pdfDoc.addPage();
    const { height } = page.getSize();
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    
    // Strip HTML tags and convert to plain text (simple approach)
    const plainText = htmlContent
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&');
    
    // Draw the text
    const lines = plainText.split('\n');
    let yPosition = height - 50;
    const fontSize = 12;
    const lineHeight = fontSize * 1.2;
    
    for (const line of lines) {
      if (yPosition < 50) {
        // Add a new page if needed
        const newPage = pdfDoc.addPage();
        yPosition = newPage.getSize().height - 50;
      }
      
      page.drawText(line, {
        x: 50,
        y: yPosition,
        size: fontSize,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });
      
      yPosition -= lineHeight;
    }
    
    // Serialize the PDF
    const pdfBytes = await pdfDoc.saveAsBase64();
    
    return {
      success: true,
      base64: pdfBytes,
      metadata: {
        format: 'pdf',
        processedAt: new Date()
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to convert HTML to PDF'
    };
  }
};

/**
 * Download a document from base64 content
 */
export const downloadDocument = (
  base64Content: string,
  filename: string,
  mimeType: string = 'application/octet-stream'
): void => {
  // Convert base64 to blob
  const byteCharacters = atob(base64Content);
  const byteNumbers = new Array(byteCharacters.length);
  
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: mimeType });
  
  // Create download link
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  
  // Trigger download
  document.body.appendChild(link);
  link.click();
  
  // Cleanup
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Get appropriate MIME type for file extension
 */
export const getMimeType = (extension: string): string => {
  const mimeTypes: Record<string, string> = {
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'pdf': 'application/pdf',
    'html': 'text/html',
    'txt': 'text/plain'
  };
  
  return mimeTypes[extension.toLowerCase()] || 'application/octet-stream';
};

/**
 * Process any document type and extract text content
 */
export const processDocument = async (file: File): Promise<string> => {
  const fileExt = file.name.split('.').pop()?.toLowerCase();
  
  if (fileExt === 'docx') {
    const result = await extractTextFromDocx(file);
    return result.content || '';
  } else if (fileExt === 'pdf') {
    // For PDF, we would need to implement PDF text extraction
    // For now, return a placeholder
    return `Content from PDF: ${file.name}`;
  } else if (fileExt === 'txt') {
    return await file.text();
  } else {
    throw new Error(`Unsupported file type: ${fileExt}`);
  }
};
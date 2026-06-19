import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

export async function parsePdf(fileBuffer: Buffer): Promise<string> {
  try {
    const data = await pdfParse(fileBuffer);
    return data.text;
  } catch (error: any) {
    console.error('PDF parsing error:', error.message || error);
    throw new Error('Failed to parse PDF document.');
  }
}

export async function parseDocx(fileBuffer: Buffer): Promise<string> {
  try {
    const data = await mammoth.extractRawText({ buffer: fileBuffer });
    return data.value;
  } catch (error: any) {
    console.error('DOCX parsing error:', error.message || error);
    throw new Error('Failed to parse DOCX document.');
  }
}

export async function extractTextFromResume(fileBuffer: Buffer, mimeType: string, fileName = ''): Promise<string> {
  const lowerName = fileName.toLowerCase();
  if (mimeType === 'application/pdf' || lowerName.endsWith('.pdf')) {
    return parsePdf(fileBuffer);
  } else if (
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    mimeType === 'application/msword' ||
    lowerName.endsWith('.docx') ||
    lowerName.endsWith('.doc')
  ) {
    return parseDocx(fileBuffer);
  } else {
    throw new Error('Unsupported file format. Please upload PDF or DOCX.');
  }
}

export function extractLinksFromPdfBuffer(buffer: Buffer): string[] {
  const content = buffer.toString('binary');
  const links: string[] = [];
  
  const uriRegex = /\/URI\s*\(([^)]+)\)/g;
  let match;
  while ((match = uriRegex.exec(content)) !== null) {
    let url = match[1].replace(/\\([()])/g, '$1');
    if (url.startsWith('http://') || url.startsWith('https://')) {
      links.push(url);
    }
  }
  
  const hexUriRegex = /\/URI\s*<([0-9a-fA-F]+)>/g;
  while ((match = hexUriRegex.exec(content)) !== null) {
    try {
      const hex = match[1];
      let url = '';
      for (let i = 0; i < hex.length; i += 2) {
        url += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
      }
      if (url.startsWith('http://') || url.startsWith('https://')) {
        links.push(url);
      }
    } catch (e) {}
  }

  return Array.from(new Set(links));
}


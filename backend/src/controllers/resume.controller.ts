import { Request, Response } from 'express';
import { extractTextFromResume, extractLinksFromPdfBuffer } from '../services/parser';
import { structureResumeText } from '../services/gemini';
import prisma from '../prisma/client';

export async function parseResume(req: Request, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded. Please upload a PDF or DOCX resume.' });
    }

    const rawText = await extractTextFromResume(req.file.buffer, req.file.mimetype, req.file.originalname);
    
    console.log('=== RAW TEXT EXTRACTED ===');
    console.log('File:', req.file.originalname, '| Size:', req.file.size, 'bytes | Type:', req.file.mimetype);
    console.log('Text length:', rawText?.length ?? 0, 'chars');
    console.log('First 500 chars:', rawText?.slice(0, 500));
    console.log('==========================');

    if (!rawText || rawText.trim().length === 0) {
      return res.status(422).json({ message: 'Could not extract text from the uploaded document.' });
    }

    // Extract clickable PDF annotations links if the file is a PDF
    let pdfLinks: string[] = [];
    if (req.file.mimetype === 'application/pdf' || req.file.originalname.toLowerCase().endsWith('.pdf')) {
      try {
        pdfLinks = extractLinksFromPdfBuffer(req.file.buffer);
        console.log('Extracted PDF clickable links:', pdfLinks);
      } catch (err: any) {
        console.warn('PDF link extraction failed:', err.message || err);
      }
    }

    const structuredData = await structureResumeText(rawText, pdfLinks);

    console.log('=== PARSED RESULT ===');
    console.log(JSON.stringify(structuredData, null, 2));
    console.log('=====================');

    // Log the generation action to analytics
    try {
      await prisma.analyticsLog.create({
        data: {
          action: 'GENERATE',
          metadata: {
            fileName: req.file.originalname,
            fileSize: req.file.size,
            mimeType: req.file.mimetype,
            parsedSuccess: !!structuredData,
          },
        },
      });
    } catch (dbErr) {
      console.warn('Analytics logging failed (DB not connected):', (dbErr as any)?.message);
    }

    return res.json({
      message: 'Resume parsed successfully',
      data: structuredData,
    });
  } catch (error: any) {
    console.error('Resume parsing controller error:', error);
    return res.status(500).json({
      message: 'Failed to process resume document.',
      error: error.message || error,
    });
  }
}

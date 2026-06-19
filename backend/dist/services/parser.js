"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePdf = parsePdf;
exports.parseDocx = parseDocx;
exports.extractTextFromResume = extractTextFromResume;
exports.extractLinksFromPdfBuffer = extractLinksFromPdfBuffer;
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const mammoth_1 = __importDefault(require("mammoth"));
async function parsePdf(fileBuffer) {
    try {
        const data = await (0, pdf_parse_1.default)(fileBuffer);
        return data.text;
    }
    catch (error) {
        console.error('PDF parsing error:', error.message || error);
        throw new Error('Failed to parse PDF document.');
    }
}
async function parseDocx(fileBuffer) {
    try {
        const data = await mammoth_1.default.extractRawText({ buffer: fileBuffer });
        return data.value;
    }
    catch (error) {
        console.error('DOCX parsing error:', error.message || error);
        throw new Error('Failed to parse DOCX document.');
    }
}
async function extractTextFromResume(fileBuffer, mimeType, fileName = '') {
    const lowerName = fileName.toLowerCase();
    if (mimeType === 'application/pdf' || lowerName.endsWith('.pdf')) {
        return parsePdf(fileBuffer);
    }
    else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        mimeType === 'application/msword' ||
        lowerName.endsWith('.docx') ||
        lowerName.endsWith('.doc')) {
        return parseDocx(fileBuffer);
    }
    else {
        throw new Error('Unsupported file format. Please upload PDF or DOCX.');
    }
}
function extractLinksFromPdfBuffer(buffer) {
    const content = buffer.toString('binary');
    const links = [];
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
        }
        catch (e) { }
    }
    return Array.from(new Set(links));
}

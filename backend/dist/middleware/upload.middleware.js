"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
// Use memory storage to process files directly from memory buffer without saving to disk
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];
        const hasAllowedExtension = /\.(pdf|doc|docx)$/i.test(file.originalname);
        if (allowedTypes.includes(file.mimetype) || hasAllowedExtension) {
            cb(null, true);
        }
        else {
            cb(new Error('Invalid file type. Only PDF and DOCX files are allowed.'));
        }
    },
});
exports.default = upload;

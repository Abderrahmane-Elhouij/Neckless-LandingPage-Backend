import { BadRequestException } from '@nestjs/common';
import { memoryStorage } from 'multer';

// Max 5MB images
export const IMAGE_MAX_SIZE = 5 * 1024 * 1024;

const allowedMime = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
]);

export const productImageMulterOptions = {
  storage: memoryStorage(),
  limits: { fileSize: IMAGE_MAX_SIZE },
  fileFilter: (
    _req: any,
    file: Express.Multer.File,
    cb: (error: any, acceptFile: boolean) => void,
  ) => {
    if (!allowedMime.has(file.mimetype)) {
      return cb(new BadRequestException('Unsupported image type'), false);
    }
    cb(null, true);
  },
};

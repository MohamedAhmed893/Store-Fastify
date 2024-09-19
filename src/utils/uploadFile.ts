

import path from 'path';
import fs from 'fs';
import { MultipartFile } from '@fastify/multipart';
import sharp from 'sharp';


export const handleFileUpload = async (file: MultipartFile, uploadDir: string): Promise<string> => {

  await fs.promises.mkdir(uploadDir, { recursive: true });

  const fileName = `${Date.now()}-${file.filename}`;
  const filePath = path.join(uploadDir, fileName);
  const buffer = await file.toBuffer();
  await sharp(buffer)
    .resize({ width: 3200, height: 3200, fit: 'inside' })
    .toFile(filePath);

  return fileName;
};





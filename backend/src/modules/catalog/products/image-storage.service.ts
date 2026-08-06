import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { extname, join } from 'path';
import { mkdir, writeFile, unlink } from 'fs/promises';

@Injectable()
export class ImageStorageService {
  constructor(private readonly configService: ConfigService) {}

  async saveProductImage(file: Express.Multer.File, productId: string): Promise<string> {
    if (!file || !file.buffer) {
      throw new BadRequestException('File ảnh không hợp lệ');
    }

    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    const extension = extname(file.originalname || '').toLowerCase();

    if (!allowedExtensions.includes(extension)) {
      throw new BadRequestException('Chỉ chấp nhận ảnh định dạng jpg, jpeg, png hoặc webp');
    }

    const uploadDir = this.configService.get<string>('UPLOAD_DIR', 'uploads');
    const productImageDir = join(process.cwd(), uploadDir, 'products');

    await mkdir(productImageDir, {
      recursive: true,
    });

    const fileName = `${productId}-${Date.now()}${extension}`;
    const filePath = join(productImageDir, fileName);

    await writeFile(filePath, file.buffer);

    return `/static/products/${fileName}`;
  }

  async deleteProductImage(imageUrl: string | null): Promise<void> {
    if (!imageUrl) return;
    if (!imageUrl.startsWith('/static/products/')) return;

    const fileName = imageUrl.split('/').pop();

    if (!fileName) return;

    const uploadDir = this.configService.get<string>('UPLOAD_DIR', 'uploads');
    const filePath = join(process.cwd(), uploadDir, 'products', fileName);

    await unlink(filePath).catch(() => {});
  }
}

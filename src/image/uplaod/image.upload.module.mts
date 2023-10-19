import { Module } from '@nestjs/common';
import { ImageUploadService } from './image.upload.service.mjs';

@Module({
  providers: [ImageUploadService],
})
export class ImageUploadModule {}

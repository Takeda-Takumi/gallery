import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { UploadController } from './upload.controller.mjs';
import { MediaFileModule } from '../mediaFile/mediaFile.module.mjs';
import { ImageUploadService } from '../image/uplaod/image.upload.service.mjs';
import { MediaFileService } from '../mediaFile/mediaFile.service.mjs';

@Module({
  imports: [
    MulterModule.register({
      limits: {
        fileSize: 30 * 1024 * 1024,
      },
    }),
    MediaFileModule,
  ],
  providers: [ImageUploadService],
  controllers: [UploadController],
})
export class UploadModule {}

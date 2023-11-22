import {
  Controller,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { MediaFile } from '../mediaFile/mediaFile.entity.mjs';
import { MediaFileService } from '../mediaFile/mediaFile.service.mjs';
import { ImageUploadService } from '../image/uplaod/image.upload.service.mjs';

@Controller('upload')
export class UploadController {
  constructor(
    private mediaFileService: MediaFileService,
    private imageUploadService: ImageUploadService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  public async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 30 * 1024 * 1024 })],
      }),
    )
    file: Express.Multer.File,
  ) {
    const uploadImage = await this.imageUploadService.parse(file.buffer);
    this.mediaFileService.insert(uploadImage);
  }
}

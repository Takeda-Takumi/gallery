import {
  Controller,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { InjectRepository } from '@nestjs/typeorm';
import { Express } from 'express';
import * as crypto from 'node:crypto';
import { MediaFile } from '../mediaFile/mediaFile.entity.mjs';
import { Repository } from 'typeorm';
import { MediaFileService } from '../mediaFile/mediaFile.service.mjs';
import { Image } from '../image/image.interface.mjs';
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

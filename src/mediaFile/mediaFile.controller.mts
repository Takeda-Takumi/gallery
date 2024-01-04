import {
  Controller,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { MediaFileService } from '../mediaFile/mediaFile.service.mjs';
import { MediaFileFactory } from '../mediaFile/mediaFile.factory.mjs';

@Controller('image')
export class MediaFileController {
  constructor(
    private mediaFileService: MediaFileService,
    private mediaFileFactory: MediaFileFactory,
  ) { }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  public async uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 30 * 1024 * 1024 })],
      }),
    )
    file: Express.Multer.File,
  ) {
    const mediaFile = await this.mediaFileFactory.parse(file.buffer);
    this.mediaFileService.insert(mediaFile);
  }
}


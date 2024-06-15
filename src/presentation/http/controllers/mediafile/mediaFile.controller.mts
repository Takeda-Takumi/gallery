import {
  Controller,
  Delete,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { MediaFileService } from '../../../../domain/mediafile/mediaFile.service.mjs';
import { MediaFileFactory } from '../../../../domain/mediafile/mediaFile.factory.mjs';
import { MediaFile } from '../../../../domain/mediafile/mediaFile.entity.mjs';

@Controller('images')
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

  @Get(':id')
  public async findOneById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<MediaFile> {
    return this.mediaFileService.findOne({ id: id });
  }

  @Delete('remove/:id')
  public async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    this.mediaFileService.remove(id);
    return;
  }
}

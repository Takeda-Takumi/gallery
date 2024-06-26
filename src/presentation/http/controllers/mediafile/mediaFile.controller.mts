import {
  Controller,
  Delete,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { FindOneUseCase } from '../../../../application/media-file/find-one.usecase.mjs';
import { UploadUseCase } from '../../../../application/media-file/upload.usecase.mjs';
import { RemoveUseCase } from '../../../../application/media-file/remove.usecase.mjs';

@Controller('images')
export class MediaFileController {
  constructor(
    private readonly findOneUseCase: FindOneUseCase,
    private readonly uploadUseCase: UploadUseCase,
    private readonly removeUseCase: RemoveUseCase
  ) { }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  public async upload(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 30 * 1024 * 1024 })],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.uploadUseCase.handle({ file: file.buffer })
  }

  @Get(':id')
  public async findOneById(
    @Param('id') id: string,
  ) {
    return this.findOneUseCase.handle({ id: id })
  }

  @Delete('remove/:id')
  public async remove(@Param('id') id: string): Promise<void> {
    await this.removeUseCase.handle({ id: id })
  }
}

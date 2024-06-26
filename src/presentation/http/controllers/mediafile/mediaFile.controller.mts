import {
  Controller,
  Delete,
  Get,
  Header,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express, Response } from 'express';
import { FindOneUseCase } from '../../../../application/media-file/find-one.usecase.mjs';
import { UploadUseCase } from '../../../../application/media-file/upload.usecase.mjs';
import { RemoveUseCase } from '../../../../application/media-file/remove.usecase.mjs';
import { GetImageUseCase } from '../../../../application/media-file/get-image.usecase.mjs';
import { Readable } from 'stream';

@Controller('images')
export class MediaFileController {
  constructor(
    private readonly findOneUseCase: FindOneUseCase,
    private readonly uploadUseCase: UploadUseCase,
    private readonly removeUseCase: RemoveUseCase,
    private readonly getImageUseCase: GetImageUseCase
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

  @Delete(':id')
  public async remove(@Param('id') id: string): Promise<void> {
    await this.removeUseCase.handle({ id: id })
  }


  // @Header('Content-Type', 'image/png')
  @Get('files/:id')
  public async getImage(@Param('id') mediaFileId: string, @Res({ passthrough: true }) res: Response): Promise<StreamableFile> {
    const image = await this.getImageUseCase.handle({ id: mediaFileId })
    const stream = Readable.from(image.file)

    res.set({
      'Content-Type': 'image/' + image.extension,
    })
    return new StreamableFile(stream)
  }
}

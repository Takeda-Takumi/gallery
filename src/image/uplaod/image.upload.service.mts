import { Injectable } from '@nestjs/common';
import { ImageUpload } from './image.upload.class.mjs';
import crypto from 'node:crypto';
import { fileTypeFromBuffer } from 'file-type';

@Injectable()
export class ImageUploadService {
  public async parse(file: Buffer): Promise<ImageUpload> {
    const md5 = this.generateMd5(file);
    const extension = await this.detectFileType(file);
    return new ImageUpload(md5, extension, file);
  }

  private generateMd5(file: Buffer): string {
    return crypto.createHash('md5').update(file).digest('hex');
  }

  private async detectFileType(file: Buffer): Promise<string> {
    const expectedFileType = ['jpg', 'png'];
    const fileTypeResult = await fileTypeFromBuffer(file);
    if (fileTypeResult === undefined) {
      throw new Error();
    }

    if (!expectedFileType.includes(fileTypeResult.ext)) {
      throw new Error('not image file');
    }
    return fileTypeResult.ext;
  }
}

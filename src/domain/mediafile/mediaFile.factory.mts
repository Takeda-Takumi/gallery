import { Injectable } from '@nestjs/common';
import { MediaFile } from './mediaFile.entity.mjs';
import crypto from 'node:crypto';
import { fileTypeFromBuffer } from 'file-type';

@Injectable()
export class MediaFileFactory {
  public async parse(file: Buffer): Promise<MediaFile> {
    const md5 = this.generateMd5(file);
    const extension = await this.detectFileType(file);
    return new MediaFile(null, md5, extension);
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

import { Image } from '../image.interface.mjs';

export class ImageUpload implements Image {
  public readonly md5: string;
  public readonly extension: string;
  public readonly file: string | Buffer;

  constructor(md5: string, extension: string, file: Buffer) {
    this.md5 = md5;
    this.extension = extension;
    this.file = file;
  }
}

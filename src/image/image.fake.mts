import type { Image } from './image.interface.mjs';

export class FakeImage implements Image {
  md5: string;
  extension: string;
  file;

  constructor(md5: string, extension: string, file: Buffer | string) {
    this.md5 = md5;
    this.extension = extension;
    this.file = file;
  }

  fileName(): string {
    return this.md5 + '.' + this.extension;
  }
}

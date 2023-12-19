import { MediaFile } from './mediaFile.entity.mjs';
export class MediaFileRepositoryMock {
  private mediaFileRepositoryMock: MediaFile[] = [];

  public async insert(image: MediaFile): Promise<void> {
    this.mediaFileRepositoryMock.push(image);
  }

  public async findOne(option: {
    where: { md5: string };
  }): Promise<MediaFile | null> {
    const ret = this.mediaFileRepositoryMock.find((value) => {
      if (option.where.md5 === undefined) return true;

      return value.md5 === option.where.md5;
    });
    if (ret === undefined) return null;
    return ret;
  }
  public async create(image: Partial<MediaFile>): Promise<Partial<MediaFile>> {
    return { md5: image.md5, extension: image.extension };
  }

  public async clear() {
    this.mediaFileRepositoryMock = [];
  }
}

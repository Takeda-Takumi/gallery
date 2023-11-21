import { Image } from '../image/image.interface.mjs';
export class MediaFileRepositoryMock {
  private mediaFileRepositoryMock: Image[] = [];

  public async insert(image: Image): Promise<void> {
    this.mediaFileRepositoryMock.push(image);
  }

  public async findOne(option: {
    where: { md5: string };
  }): Promise<Image | null> {
    const ret = this.mediaFileRepositoryMock.find((value) => {
      if (option.where.md5 === undefined) return true;

      return value.md5 === option.where.md5;
    });
    if (ret === undefined) return null;
    return ret;
  }
  public async create(image: Partial<Image>): Promise<Partial<Image>> {
    return { md5: image.md5, extension: image.extension };
  }

  public async clear() {
    this.mediaFileRepositoryMock = [];
  }
}

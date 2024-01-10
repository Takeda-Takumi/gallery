import { MediaFile } from './mediaFile.entity.mjs';
export class MediaFileRepositoryMock {
  private mediaFileRepositoryMock: MediaFile[] = [];

  public async insert(image: MediaFile): Promise<void> {
    this.mediaFileRepositoryMock.push(image);
  }

  public async findOne({
    where: { md5 = undefined, id = undefined },
  }: {
    where: { md5?: string; id?: number };
  }): Promise<MediaFile | null> {
    const result = this.mediaFileRepositoryMock.find((value) => {
      return (
        (typeof md5 === 'undefined' || value.md5 === md5) &&
        (typeof id === 'undefined' || value.id === id)
      );
    });
    if (typeof result === 'undefined') return null;
    return result;
  }
  public async create(image: Partial<MediaFile>): Promise<Partial<MediaFile>> {
    return { md5: image.md5, extension: image.extension };
  }

  public async clear() {
    this.mediaFileRepositoryMock = [];
  }
}

import { MediaFileId } from "../../domain/mediafile/media-file-id.mjs";
import { MediaFile } from "../../domain/mediafile/mediaFile.entity.mjs";

type Options = {
  where: {
    md5?: string;
    id?: MediaFileId;
  };
};

export class MediaFileRepositoryMock {
  private mediaFileRepositoryMock: MediaFile[] = [];

  public async insert(image: MediaFile): Promise<void> {
    this.mediaFileRepositoryMock.push(image);
  }

  async save(image: MediaFile): Promise<MediaFile> {
    this.mediaFileRepositoryMock.push(
      {
        id: new MediaFileId(String(this.mediaFileRepositoryMock.length)),
        ...image
      }
    );
    return this.mediaFileRepositoryMock.at(-1)
  }

  public async findOne({
    where: { md5 = undefined, id = undefined },
  }: Options): Promise<MediaFile | null> {
    const result = this.mediaFileRepositoryMock.find((value) => {
      return (
        (typeof md5 === 'undefined' || value.md5 === md5) &&
        (typeof id === 'undefined' || value.id.id === id.id)
      );
    });
    if (typeof result === 'undefined') return null;
    return result;
  }
  public create(image: Partial<MediaFile>): Partial<MediaFile>{
    return { md5: image.md5, extension: image.extension };
  }

  public async remove(mediaFile: Partial<MediaFile>): Promise<void> {
    const removed = await this.findOne({
      where: { md5: mediaFile.md5, id: mediaFile.id },
    });
    if (removed === null) return;
    this.mediaFileRepositoryMock = this.mediaFileRepositoryMock.filter(
      (value) => value.md5 !== removed.md5 || value.id.id !== removed.id.id,
    );
    return;
  }

  public async clear() {
    this.mediaFileRepositoryMock = [];
  }
}

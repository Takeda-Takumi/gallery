import { MediaFileId } from "../../../domain/mediafile/media-file-id.mjs";
import { MediaFile } from "../../../domain/mediafile/mediaFile.entity.mjs";

type Options = {
  where: {
    md5?: string;
    id?: MediaFileId;
  };
};

export class MediaFileRepositoryMock {
  private memory: MediaFile[] = [];

  public async insert(image: MediaFile): Promise<void> {
    this.memory.push(image);
  }

  async save(image: MediaFile): Promise<MediaFile> {
    this.memory.push(
      {
        id: new MediaFileId(String(this.memory.length)),
        ...image
      }
    );
    return this.memory.at(-1)
  }

  public async findOne({
    where: { md5 = undefined, id = undefined },
  }: Options): Promise<MediaFile | null> {
    const result = this.memory.find((value) => {
      return (
        (typeof md5 === 'undefined' || value.md5 === md5) &&
        (typeof id === 'undefined' || value.id.id === id.id)
      );
    });
    if (typeof result === 'undefined') return null;
    return result;
  }
  public create(image: Partial<MediaFile>): Partial<MediaFile> {
    return { md5: image.md5, extension: image.extension };
  }

  public async remove(mediaFile: Partial<MediaFile>): Promise<void> {
    const removed = await this.findOne({
      where: { md5: mediaFile.md5, id: mediaFile.id },
    });
    if (removed === null) return;
    this.memory = this.memory.filter(
      (value) => value.md5 !== removed.md5 || value.id.id !== removed.id.id,
    );
    return;
  }

  async existById({ where: { id } }: { where: { id: MediaFileId } }) {
    return this.memory.some((value) => value.id.id === id.id)
  }

  async existByHash({ where: { hash } }: { where: { hash: string } }) {
    return this.memory.some((value) => value.md5 === hash)
  }

  public async clear() {
    this.memory = [];
  }
}

import { FileStorage } from "../../domain/file.storage.interface.mjs";
import { MediaFileId } from "../../domain/mediafile/media-file-id.mjs";
import { MediaFile } from "../../domain/mediafile/mediaFile.entity.mjs";

export class InMemoryFileStorage implements FileStorage {
  private memory = new Map<string, Buffer>
  async store(mediaFile: MediaFile, file: Buffer) {
    this.memory.set(mediaFile.id.id, file)
  }
  async load(mediaFile: MediaFile) {
    return this.memory.get(mediaFile.id.id)
  }

  async clear() {
    this.memory.clear()
  }

  async exist(mediaFile: MediaFile): Promise<boolean> {
    return this.memory.has(mediaFile.id.id)
  }

  async remove(mediaFile: MediaFile) {
    this.memory.delete(mediaFile.id.id)
  }
}

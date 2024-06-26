import { MediaFileId } from "./media-file-id.mjs";
import { MediaFile } from "./mediaFile.entity.mjs";

export interface MediaFileRepository {
  findOneById: (id: MediaFileId) => Promise<MediaFile | null>
  existsByHash: (hash: string) => Promise<boolean>
  save: (mediaFile: MediaFile) => Promise<MediaFile>
  remove: (id: MediaFileId) => Promise<void>
}

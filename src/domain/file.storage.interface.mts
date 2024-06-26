import { MediaFileId } from "./mediafile/media-file-id.mjs"
import { MediaFile } from "./mediafile/mediaFile.entity.mjs"

export interface FileStorage {
  store: (id: MediaFile, file: Buffer) => Promise<void>
  load: (id: MediaFile) => Promise<Buffer>
  clear: () => Promise<void>
  exist: (id: MediaFile) => Promise<boolean>
  remove: (id: MediaFile) => Promise<void>
}

export const fileStorageToken = 'FILE_STORAGE_TOKEN'

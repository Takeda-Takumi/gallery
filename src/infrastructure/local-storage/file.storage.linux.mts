import { Injectable } from "@nestjs/common";
import { FileStorage } from "../../domain/file.storage.interface.mjs";
import { MediaFileId } from "../../domain/mediafile/media-file-id.mjs";
import fs from "fs/promises";
import path from "path";
import { MediaFile } from "../../domain/mediafile/mediaFile.entity.mjs";

@Injectable()
export class LinuxFileStorage implements FileStorage {

  private path(mediaFile: MediaFile) {
    const baseDirectory = 'public/data'
    const fileName = (mediaFile: MediaFile) => mediaFile.id.id + '.' + mediaFile.extension
    return path.join(baseDirectory, fileName(mediaFile))

  }
  async store(mediaFile: MediaFile, file: Buffer) {
    await fs.writeFile(this.path(mediaFile), file)
  }
  async load(mediaFile: MediaFile) {
    return await fs.readFile(this.path(mediaFile))
  }

  async exist(mediaFile: MediaFile) {
    try {
      await fs.access(this.path(mediaFile), fs.constants.R_OK)
      return true
    } catch {
      return false
    }
  }

  async clear() {
    throw new Error()
  }

  async remove(mediaFile: MediaFile) {
    await fs.unlink(this.path(mediaFile))
  }
}

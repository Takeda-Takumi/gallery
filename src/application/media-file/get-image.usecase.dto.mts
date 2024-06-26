import { MediaFile } from "../../domain/mediafile/mediaFile.entity.mjs"

export class GetImageInputDto {
  readonly id: string
}

export class GetImageOutputDto {
  readonly file: Buffer
  readonly extension: string
  constructor(file: Buffer, mediaFile: MediaFile) {
    this.file = file
    this.extension = mediaFile.extension
  }
}

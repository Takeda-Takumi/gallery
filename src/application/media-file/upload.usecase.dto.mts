import { MediaFile } from "../../domain/mediafile/mediaFile.entity.mjs"

export class UploadUseCaseInputDto {
  readonly file: Buffer
}

export class UploadUseCaseOutPutDto {
  readonly id: string
  readonly md5: string
  constructor(mediaFile: MediaFile) {
    this.id = String(mediaFile.id)
    this.md5 = mediaFile.md5
  }
}

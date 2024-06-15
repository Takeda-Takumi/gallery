import { MediaFile } from "../../../domain/mediafile/mediaFile.entity.mjs"
import { Tag } from "../../../domain/tag/tag.entity.mjs"

export type FindTagUseCaseInputDto = {
  readonly id: string
}

export class FindTagUseCaseOutputDto {
  readonly id: string
  readonly name: string
  readonly mediaFiles: MediaFile[]
  constructor(tag: Tag) {
    this.id = tag.id.id
    this.name = tag.name.name
    this.mediaFiles = tag.mediaFiles
  }
}

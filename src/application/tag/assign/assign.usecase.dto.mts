import { MediaFile } from "../../../domain/mediafile/mediaFile.entity.mjs"
import { Tag } from "../../../domain/tag/tag.entity.mjs"

export type AssignUsecaseInputDto = {
  readonly tagId: string
  readonly mediaFileId: string
}

export class AssignUsecaseOutputDto {
  readonly id: string
  readonly name: string
  readonly mediaFile: MediaFile[]

  constructor(tag: Tag) {
    this.id = tag.id.id
    this.name = tag.name.name
    this.mediaFile = tag.mediaFiles
  }
}


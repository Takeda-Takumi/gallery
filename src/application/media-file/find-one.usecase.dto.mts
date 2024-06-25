import { MediaFile } from "../../domain/mediafile/mediaFile.entity.mjs"
import { Tag } from "../../domain/tag/tag.entity.mjs"

export class FindOneUseCaseInputDto {
  readonly md5?: string
  readonly id?: string
}

export class FindOneUseCaseOutputDto {
  readonly id: string
  readonly md5: string
  readonly tags: Tag[]
  constructor(mediaFile: MediaFile) {
    this.id = mediaFile.id.id
    this.md5 = mediaFile.md5
    this.tags = mediaFile.tags
  }

}

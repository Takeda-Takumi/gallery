import { Tag } from "../../../domain/tag/tag.entity.mjs"

export type RemoveUsecaseInputDto = {
  readonly tagId: string
  readonly mediaFileId: string
}

export class RemoveUsecaseOutputDto {
  readonly id: string
  readonly name: string
  constructor(tag: Tag) {
    this.id = tag.id.id
    this.name = tag.name.name
  }
}



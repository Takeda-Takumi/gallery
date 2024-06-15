import { Tag } from "../../../domain/tag/tag.entity.mjs"

export type CreateTagUseCaseInputDto = {
  readonly name: string
}

export class CreateTagUseCaseOutputDto {
  readonly id: string
  readonly name: string

  constructor(tag: Tag) {
    this.id = tag.id.id
    this.name = tag.name.name
  }
}

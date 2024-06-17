import { TagNameIsNotEmptyException } from "./tag.exception.mjs"

export class TagName {
  public readonly name: string
  constructor(name: string) {
    if (name === '') throw new TagNameIsNotEmptyException()
    this.name = name
  }

  // equals(tagName: TagName) {
  //   return this.value === tagName.value
  // }
}


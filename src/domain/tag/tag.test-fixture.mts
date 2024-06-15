import { MediaFile } from "../mediafile/mediaFile.entity.mjs";
import { Tag } from "./tag.entity.mjs";
import { TagId } from "./tagId.mjs";
import { TagName } from "./tagName.mjs";

export class TagTestFixture {
  tagForTest({
    id = '1fe5dfe0-8ee4-43ef-919b-c8f6153e7343',
    name = 'name',
    mediaFiles = []
  }: {
    name?: string
    id?: string
    mediaFiles?: MediaFile[]
  } = {}) {
    const tag: Tag = new Tag(
      new TagId(id),
      new TagName(name),
      mediaFiles
    )
    return tag
  }

  mediaFileForTest() {
    return this.mediaFileForTest1()
  }

  mediaFileForTest1() {
    const mediaFile = new MediaFile(
      1,
      'md51',
      'extension1'
    )
    return mediaFile
  }

  mediaFileForTest2() {
    const mediaFile = new MediaFile(
      2,
      'md52',
      'extension2'
    )
    return mediaFile
  }
}

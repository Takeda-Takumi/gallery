import { MediaFile } from "../mediafile/mediaFile.entity.mjs";
import { Tag } from "./tag.entity.mjs";
import { TagId } from "./tagId.mjs";
import { TagName } from "./tagName.mjs";

export class TagTestFixture {
  tagForTest({
    id, name, mediaFiles
  }: {
    name?: string
    id?: string
    mediaFiles?: MediaFile[]
  } = {}) {
    return this.tagForTest1({ name: name, id: id, mediaFiles: mediaFiles })
  }

  tagForTest1({
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

  tagForTest2({
    id = 'b6d61734-867e-4ee3-baa3-05624756a05e',
    name = 'name2',
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

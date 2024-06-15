import { Tag } from "./tag.entity.mjs";
import { TagId } from "./tagId.mjs";
import { TagName } from "./tagName.mjs";

export class TagCommonTest {
  tagForTest() {
    const tag: Tag = new Tag(
      new TagId('1fe5dfe0-8ee4-43ef-919b-c8f6153e7343'),
      new TagName('test'),
      []
    )
    return tag
  }
}

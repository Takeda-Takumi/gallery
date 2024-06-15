import { Tag } from "./tag.entity.mjs";
import { TagId } from "./tagId.mjs";
import { TagName } from "./tagName.mjs";

export interface TagRepository {
  existsById: (id: TagId) => Promise<boolean>
  existsByName: (name: TagName) => Promise<boolean>
  nextIdentity: () => Promise<TagId>
  findOneById: (id: TagId) => Promise<Tag | null>
  findOneByName: (name: TagName) => Promise<Tag>
  save: (tag: Tag) => Promise<Tag>
  remove: (tag: Tag) => Promise<void>
}

export const TagRepositoryToken = 'TagRepositoryToken'

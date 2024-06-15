import { randomInt } from "node:crypto";
import { v4 as uuidv4 } from 'uuid'
import { Injectable } from "@nestjs/common";
import { TagId } from "../../domain/tag/tagId.mjs";
import { MediaFile } from "../../domain/mediafile/mediaFile.entity.mjs";
import { Tag } from "../../domain/tag/tag.entity.mjs";
import { TagName } from "../../domain/tag/tagName.mjs";

@Injectable()
export class TagFactory {
  constructor() {
    return
  }

  private generateId(): TagId {
    return new TagId(uuidv4())
  }

  public create(name: string, mediaFiles: MediaFile[] = []) {
    return new Tag(this.generateId(), new TagName(name), mediaFiles)
  }
}

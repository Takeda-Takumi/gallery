import { Injectable } from "@nestjs/common";
import { TagId } from "../../../domain/tag/tagId.mjs";
import { Tag } from "../../../domain/tag/tag.entity.mjs";
import { TagName } from "../../../domain/tag/tagName.mjs";
import { TagRepository } from "../../../domain/tag/tag.repository.interface.mjs";

const tagId = new TagId('1fe5dfe0-8ee4-43ef-919b-c8f6153e7343')

@Injectable()
export class InMemoryTagRepository implements TagRepository {
  private memory: Tag[] = []
  private index = 0
  async findOneById(id: TagId) {
    return this.memory.find(element => element.id.id === id.id)
  }

  async findOneByName(name: TagName) {
    return this.memory.find((element) => element.name.name === name.name)
  }

  async nextIdentity() {
    return new TagId(((this.index)++).toString())
  }

  async save(tag: Tag) {
    this.memory.push(tag); return await this.findOneById(tag.id)
  }

  async existsById(id: TagId) {
    return this.memory.some(value => value.id.id === id.id)
  }

  async existsByName(name: TagName) {
    return this.memory.some(value => value.name.name === name.name)
  }

  async remove(tag: Tag) {
    this.memory = this.memory.filter(value => value.id.id !== tag.id.id)
  }
  clear() { this.memory = [] }
}

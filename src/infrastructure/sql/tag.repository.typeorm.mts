import { Repository } from "typeorm";
import { Tag } from "../../domain/tag/tag.entity.mjs";
import { TagId } from "../../domain/tag/tagId.mjs";
import { TagName } from "../../domain/tag/tagName.mjs";
import { InjectRepository } from "@nestjs/typeorm";
import { v4 as uuidv4 } from "uuid"
import { TagRepository } from "../../domain/tag/tag.repository.interface.mjs";

export class TypeOrmTagRepository implements TagRepository {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>
  ) { }

  async existsById(id: TagId) {
    return await this.tagRepository.exist({ where: { id: id } })
  }

  async existsByName(name: TagName) {
    return await this.tagRepository.exist({ where: { name: name } })
  }
  async nextIdentity() {
    return new TagId(uuidv4())
  }

  async findOneById(id: TagId) {
    return await this.tagRepository.findOne({ relations: { mediaFiles: true }, where: { id: id } })
  }

  async findOneByName(name: TagName) {
    return this.tagRepository.findOne({ relations: { mediaFiles: true }, where: { name: name } })
  }
  async save(tag: Tag) {
    return await this.tagRepository.save(tag)
  }

  async remove(tag: Tag) {
    await this.tagRepository.remove(tag)
  }
}

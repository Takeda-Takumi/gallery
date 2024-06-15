import { TagId } from "../../../domain/tag/tagId.mjs";
import { UseCase } from "../../usacase.interface.mjs";
import { FindTagUseCaseInputDto, FindTagUseCaseOutputDto } from "./find-tag.usecase.dto.mjs";
import { TagService } from "../../../domain/tag/tag.service.mjs";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FindTagUseCase implements UseCase<FindTagUseCaseInputDto, FindTagUseCaseOutputDto | {}> {

  constructor(
    private readonly tagService: TagService
  ) { }

  async handle(inputDto: FindTagUseCaseInputDto) {
    const id = new TagId(inputDto.id)

    const tag = await this.tagService.findOne(id)

    if (tag === null) return {}

    return new FindTagUseCaseOutputDto(tag)
  }
}

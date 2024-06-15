import { Inject, Injectable } from "@nestjs/common";
import { CreateTagUseCaseInputDto, CreateTagUseCaseOutputDto } from "./create-tag.usecase.dto.mjs";
import { UseCase } from "../../usacase.interface.mjs";
import { TagName } from "../../../domain/tag/tagName.mjs";
import { TagService } from "../../../domain/tag/tag.service.mjs";

@Injectable()
export class CreateTagUseCase implements UseCase<CreateTagUseCaseInputDto, CreateTagUseCaseOutputDto> {
  constructor(
    private readonly tagService: TagService
  ) { }

  async handle(inputDto: CreateTagUseCaseInputDto) {
    const newTagName = new TagName(inputDto.name)

    const newTag = await this.tagService.create(newTagName)

    return new CreateTagUseCaseOutputDto(newTag)
  }
}

import { TagId } from "../../../domain/tag/tagId.mjs";
import { UseCase } from "../../usacase.interface.mjs";
import { TagService } from "../../../domain/tag/tag.service.mjs";
import { TagName } from "../../../domain/tag/tagName.mjs";
import { ChangeTagNameUsecaseInputDto, ChangeTagNameUsecaseOutputDto } from "./change-tag-name.usecase.dto.mjs";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ChangeTagNameUsecase implements UseCase<ChangeTagNameUsecaseInputDto, ChangeTagNameUsecaseOutputDto> {

  constructor(
    private readonly tagService: TagService
  ) { }

  async handle(inputDto: ChangeTagNameUsecaseInputDto) {
    const id = new TagId(inputDto.id)
    const name = new TagName(inputDto.name)

    const tag = await this.tagService.changeName(id, name)

    return new ChangeTagNameUsecaseOutputDto(tag)
  }
}


import { TagId } from "../../../domain/tag/tagId.mjs";
import { UseCase } from "../../usacase.interface.mjs";
import { TagService } from "../../../domain/tag/tag.service.mjs";
import { AssignUsecaseInputDto, AssignUsecaseOutputDto } from "./assign.usecase.dto.mjs";
import { Injectable } from "@nestjs/common";
import { MediaFileId } from "../../../domain/mediafile/media-file-id.mjs";

@Injectable()
export class AssignUseCase implements UseCase<AssignUsecaseInputDto, AssignUsecaseOutputDto> {

  constructor(
    private readonly tagService: TagService
  ) { }

  async handle(inputDto: AssignUsecaseInputDto) {
    const tagId = new TagId(inputDto.tagId)
    const mediaFileId = new MediaFileId(inputDto.mediaFileId)

    const tag = await this.tagService.assignTag(tagId, mediaFileId)

    return new AssignUsecaseOutputDto(tag)
  }
}


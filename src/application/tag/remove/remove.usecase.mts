import { TagId } from "../../../domain/tag/tagId.mjs";
import { UseCase } from "../../usacase.interface.mjs";
import { TagService } from "../../../domain/tag/tag.service.mjs";
import { RemoveUsecaseInputDto, RemoveUsecaseOutputDto } from "./remove.usecase.dto.mjs";
import { Injectable } from "@nestjs/common";
import { MediaFileId } from "../../../domain/mediafile/media-file-id.mjs";

@Injectable()
export class RemoveUseCase implements UseCase<RemoveUsecaseInputDto, RemoveUsecaseOutputDto> {

  constructor(
    private readonly tagService: TagService
  ) { }

  async handle(inputDto: RemoveUsecaseInputDto) {
    const tagId = new TagId(inputDto.tagId)
    const mediaFileId = new MediaFileId(inputDto.mediaFileId)

    const tag = await this.tagService.remove(tagId, mediaFileId)

    return new RemoveUsecaseOutputDto(tag)
  }
}



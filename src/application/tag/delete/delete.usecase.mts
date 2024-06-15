import { TagId } from "../../../domain/tag/tagId.mjs";
import { UseCase } from "../../usacase.interface.mjs";
import { TagService } from "../../../domain/tag/tag.service.mjs";
import { DeleteUseCaseInputDto, DeleteUseCaseOutputDto } from "./delete.usecase.dto.mjs";
import { Injectable } from "@nestjs/common";

@Injectable()
export class DeleteUseCase implements UseCase<DeleteUseCaseInputDto, DeleteUseCaseOutputDto> {

  constructor(
    private readonly tagService: TagService
  ) { }

  async handle(inputDto: DeleteUseCaseInputDto) {
    const id = new TagId(inputDto.id)

    await this.tagService.delete(id)
  }
}


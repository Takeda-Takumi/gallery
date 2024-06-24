import { Injectable } from "@nestjs/common";
import { MediaFileService } from "../../domain/mediafile/mediaFile.service.mjs";
import { UseCase } from "../usacase.interface.mjs";
import { RemoveUseCaseInputDto } from "./remove.usecase.dto.mjs";

@Injectable()
export class RemoveUseCase implements UseCase<RemoveUseCaseInputDto, void> {

  constructor(
    private readonly mediaFileService: MediaFileService
  ) { }

  async handle(input: RemoveUseCaseInputDto) {
    const id = Number(input.id)
    await this.mediaFileService.remove(id)
  }
}


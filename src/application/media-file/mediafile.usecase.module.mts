import { Module } from "@nestjs/common";
import { FindOneUseCase } from "./find-one.usecase.mjs";
import { UploadUseCase } from "./upload.usecase.mjs";
import { RemoveUseCase } from "./remove.usecase.mjs";
import { MediaFileModule } from "../../domain/mediafile/mediaFile.module.mjs";

@Module({
  imports: [
    MediaFileModule
  ],
  providers: [
    FindOneUseCase,
    UploadUseCase,
    RemoveUseCase
  ],
  exports: [
    FindOneUseCase,
    UploadUseCase,
    RemoveUseCase
  ]
})
export class MediaFileUseCaseModule { }

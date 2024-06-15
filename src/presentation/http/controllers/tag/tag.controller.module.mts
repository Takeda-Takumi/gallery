import { Module } from "@nestjs/common";
import { TagUsecaseModule } from "../../../../application/tag/tag.usecase.module.mjs";
import { TagController } from "./tag.controller.mjs";

@Module({
  imports: [TagUsecaseModule],
  controllers: [TagController]
})
export class TagControllerModule { }

import { Module } from "@nestjs/common";
import { TagUsecaseModule } from "../../../../application/tag/tag.usecase.module.mjs";
import { TagController } from "./tag.controller.mjs";
import { DomainExceptionFilter } from "../http-exception.filter.mjs";

@Module({
  imports: [TagUsecaseModule],
  controllers: [TagController],
  providers: [DomainExceptionFilter]
})
export class TagControllerModule { }

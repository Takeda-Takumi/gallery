import { Module } from '@nestjs/common';
import { DeleteUseCase } from './delete/delete.usecase.mjs';
import { RemoveUseCase } from './remove/remove.usecase.mjs';
import { AssignUseCase } from './assign/assign.usecase.mjs';
import { CreateTagUseCase } from './create-tag/create-tag.usecase.mjs';
import { FindTagUseCase } from './find-tag/find-tag.usecase.mjs';
import { TagModule } from '../../domain/tag/tag.module.mjs';
import { ChangeTagNameUsecase } from './change-tag-name/change-tag-name.usecase.mjs';

@Module({
  imports: [TagModule],
  providers: [DeleteUseCase, RemoveUseCase, AssignUseCase, ChangeTagNameUsecase, CreateTagUseCase, FindTagUseCase],
  exports: [DeleteUseCase, RemoveUseCase, AssignUseCase, ChangeTagNameUsecase, CreateTagUseCase, FindTagUseCase],
})
export class TagUsecaseModule { }



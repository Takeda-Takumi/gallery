import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseFilters } from '@nestjs/common';
import { FindTagUseCase } from '../../../../application/tag/find-tag/find-tag.usecase.mjs';
import { CreateTagUseCase } from '../../../../application/tag/create-tag/create-tag.usecase.mjs';
import { AssignUseCase } from '../../../../application/tag/assign/assign.usecase.mjs';
import { RemoveUseCase } from '../../../../application/tag/remove/remove.usecase.mjs';
import { DeleteUseCase } from '../../../../application/tag/delete/delete.usecase.mjs';
import { CreateTagRequestDto } from './create-tag.dto.mjs';
import { FindOneParams } from './find-one.params.mjs';
import { ChangeTagNameParams } from './change-tag-name.params.mjs';
import { AssignParams } from './assign.params.mjs';
import { RemoveParams } from './remove.params.mjs';
import { DeleteParams } from './delete.params.mjs';
import { ChangeTagNameUsecase } from '../../../../application/tag/change-tag-name/change-tag-name.usecase.mjs';
import { DomainExceptionFilter } from '../http-exception.filter.mjs';

@Controller('tags')
@UseFilters(new DomainExceptionFilter())
export class TagController {
  constructor(
    private readonly findTagUseCase: FindTagUseCase,
    private readonly createTagUseCase: CreateTagUseCase,
    private readonly changeTagNameUsecase: ChangeTagNameUsecase,
    private readonly assignUseCase: AssignUseCase,
    private readonly removeUseCase: RemoveUseCase,
    private readonly deleteUseCase: DeleteUseCase,
  ) { }

  @Get(':tagId')
  public async findOne(
    @Param() params: FindOneParams
  ) {
    const tagId = params.tagId
    return await this.findTagUseCase.handle({ id: tagId })
  }

  @Post('')
  public async create(@Body() body: CreateTagRequestDto) {
    const name = body.name
    return await this.createTagUseCase.handle({ name: name })
  }

  @Put(':tagId')
  public async changeTagName(@Param() params: ChangeTagNameParams, @Body('name') name: string) {
    const tagId = params.tagId
    return await this.changeTagNameUsecase.handle({ id: tagId, name: name })
  }

  @Put(':tagId/mediafiles/:mediaFileId')
  public async assign(@Param() params: AssignParams) {
    const tagId = params.tagId
    const mediaFileId = params.mediaFileId
    return await this.assignUseCase.handle({ tagId: tagId, mediaFileId: mediaFileId })
  }

  @Delete(':tagId/mediafiles/:mediaFileId')
  public async remove(@Param() params: RemoveParams) {
    const tagId = params.tagId
    const mediaFileId = params.mediaFileId
    return await this.removeUseCase.handle({ tagId: tagId, mediaFileId: mediaFileId })
  }

  @Delete(':tagId')
  public async delete(@Param() params: DeleteParams) {
    const tagId = params.tagId
    return this.deleteUseCase.handle({ id: tagId })
  }
}

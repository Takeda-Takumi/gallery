import { Transform, Type } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsNumberString, IsString } from 'class-validator'
import { TagId } from '../../../../domain/tag/tagId.mjs'

export class AssignParams {

  @IsNotEmpty()
  readonly tagId: string

  @IsNumberString()
  @IsNotEmpty()
  readonly mediaFileId: string
}

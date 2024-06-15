import { Transform, Type } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsNumberString, IsString, IsUUID, isString, isUUID } from 'class-validator'
import { TagId } from '../../../../domain/tag/tagId.mjs'

export class ChangeTagNameParams {

  @IsNotEmpty()
  @IsString()
  readonly tagId: string
}

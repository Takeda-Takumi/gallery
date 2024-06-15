import { IsNotEmpty, IsNumber, IsNumberString, IsString } from 'class-validator'

export class RemoveParams {

  @IsNotEmpty()
  readonly tagId: string

  @IsNumberString()
  @IsNotEmpty()
  readonly mediaFileId: string
}

import { IsNotEmpty } from 'class-validator'

export class FindOneParams {
  @IsNotEmpty()
  readonly tagId: string
}

import { IsNotEmpty } from 'class-validator'

export class DeleteParams {

  @IsNotEmpty()
  readonly tagId: string
}

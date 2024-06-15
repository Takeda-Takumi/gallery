import { IsNotEmpty, IsString } from 'class-validator'
export class CreateTagRequestDto {
  @IsNotEmpty()
  @IsString()
  name: string
}

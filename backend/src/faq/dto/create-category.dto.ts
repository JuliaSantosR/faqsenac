import { IsString, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @MinLength(2, { message: 'O rótulo deve ter no mínimo 2 caracteres.' })
  label: string;

  @IsString()
  @MinLength(10, { message: 'A descrição deve ter no mínimo 10 caracteres.' })
  description: string;
}

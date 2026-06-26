import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'O rótulo deve ter no mínimo 2 caracteres.' })
  label?: string;

  @IsOptional()
  @IsString()
  @MinLength(10, { message: 'A descrição deve ter no mínimo 10 caracteres.' })
  description?: string;
}

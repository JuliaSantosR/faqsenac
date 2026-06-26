import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateAnnouncementDto {
  @IsOptional()
  @IsString()
  @MinLength(5, { message: 'O título deve ter no mínimo 5 caracteres.' })
  title?: string;

  @IsOptional()
  @IsString()
  @MinLength(10, { message: 'A descrição deve ter no mínimo 10 caracteres.' })
  description?: string;
}

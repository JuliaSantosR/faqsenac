import { IsString, MinLength } from 'class-validator';

export class CreateAnnouncementDto {
  @IsString()
  @MinLength(5, { message: 'O título deve ter no mínimo 5 caracteres.' })
  title: string;

  @IsString()
  @MinLength(10, { message: 'A descrição deve ter no mínimo 10 caracteres.' })
  description: string;
}

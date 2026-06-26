import { IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class UpdateEntryDto {
  @IsOptional()
  @IsString()
  @MinLength(10, { message: 'A pergunta deve ter no mínimo 10 caracteres.' })
  question?: string;

  @IsOptional()
  @IsString()
  @MinLength(10, { message: 'A resposta deve ter no mínimo 10 caracteres.' })
  answer?: string;

  @IsOptional()
  @IsUUID('4', { message: 'O categoryId deve ser um UUID válido.' })
  categoryId?: string;
}

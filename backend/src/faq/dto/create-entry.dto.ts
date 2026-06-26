import { IsOptional, IsString, IsUrl, IsUUID, MinLength, ValidateIf } from 'class-validator';

export class CreateEntryDto {
  @IsString()
  @MinLength(10, { message: 'A pergunta deve ter no mínimo 10 caracteres.' })
  question: string;

  @IsString()
  @MinLength(10, { message: 'A resposta deve ter no mínimo 10 caracteres.' })
  answer: string;

  @IsUUID('4', { message: 'O categoryId deve ser um UUID válido.' })
  categoryId: string;

  @IsOptional()
  @IsString()
  @ValidateIf((_, value) => typeof value === 'string' && value.trim() !== '')
  @IsUrl({}, { message: 'A URL da imagem deve ser válida.' })
  imageUrl?: string;

  @IsOptional()
  @IsString()
  @ValidateIf((_, value) => typeof value === 'string' && value.trim() !== '')
  @IsUrl({}, { message: 'A URL do vídeo deve ser válida.' })
  videoUrl?: string;
}

import { IsString, IsUUID, MinLength } from 'class-validator';

export class CreateEntryDto {
  @IsString()
  @MinLength(10, { message: 'A pergunta deve ter no mínimo 10 caracteres.' })
  question: string;

  @IsString()
  @MinLength(10, { message: 'A resposta deve ter no mínimo 10 caracteres.' })
  answer: string;

  @IsUUID('4', { message: 'O categoryId deve ser um UUID válido.' })
  categoryId: string;
}

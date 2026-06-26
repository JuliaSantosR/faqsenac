import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FAQCategory, FAQEntry, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateEntryDto } from './dto/create-entry.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { UpdateEntryDto } from './dto/update-entry.dto';

type FAQEntryWithCategory = Prisma.FAQEntryGetPayload<{
  include: { category: true };
}>;

@Injectable()
export class FaqService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllCategories(): Promise<FAQCategory[]> {
    return this.prisma.fAQCategory.findMany({
      orderBy: { label: 'asc' },
    });
  }

  async createCategory(dto: CreateCategoryDto): Promise<FAQCategory> {
    const existing = await this.prisma.fAQCategory.findUnique({
      where: { label: dto.label },
    });
    if (existing) {
      throw new ConflictException(
        `Já existe uma categoria com o rótulo "${dto.label}".`,
      );
    }
    return this.prisma.fAQCategory.create({ data: dto });
  }

  async updateCategory(
    id: string,
    dto: UpdateCategoryDto,
  ): Promise<FAQCategory> {
    await this.findCategoryOrFail(id);
    return this.prisma.fAQCategory.update({ where: { id }, data: dto });
  }

  async deleteCategory(id: string): Promise<void> {
    await this.findCategoryOrFail(id);
    await this.prisma.fAQCategory.delete({ where: { id } });
  }

  async findAllEntries(): Promise<FAQEntryWithCategory[]> {
    return this.prisma.fAQEntry.findMany({
      orderBy: { question: 'asc' },
      include: { category: true },
    });
  }

  async searchEntries(query: string): Promise<FAQEntryWithCategory[]> {
    return this.prisma.fAQEntry.findMany({
      where: {
        OR: [
          { question: { contains: query, mode: 'insensitive' } },
          { answer: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: { category: true },
      orderBy: { question: 'asc' },
    });
  }

  async createEntry(dto: CreateEntryDto): Promise<FAQEntry> {
    await this.findCategoryOrFail(dto.categoryId);
    return this.prisma.fAQEntry.create({ data: dto });
  }

  async updateEntry(id: string, dto: UpdateEntryDto): Promise<FAQEntry> {
    await this.findEntryOrFail(id);
    if (dto.categoryId) {
      await this.findCategoryOrFail(dto.categoryId);
    }
    return this.prisma.fAQEntry.update({ where: { id }, data: dto });
  }

  async deleteEntry(id: string): Promise<void> {
    await this.findEntryOrFail(id);
    await this.prisma.fAQEntry.delete({ where: { id } });
  }

  private async findCategoryOrFail(id: string): Promise<FAQCategory> {
    const category = await this.prisma.fAQCategory.findUnique({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException(`Categoria com id "${id}" não encontrada.`);
    }
    return category;
  }

  private async findEntryOrFail(id: string): Promise<FAQEntry> {
    const entry = await this.prisma.fAQEntry.findUnique({ where: { id } });
    if (!entry) {
      throw new NotFoundException(`Entrada de FAQ com id "${id}" não encontrada.`);
    }
    return entry;
  }
}

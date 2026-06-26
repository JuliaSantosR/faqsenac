import { Injectable, NotFoundException } from '@nestjs/common';
import { Announcement } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';

@Injectable()
export class AnnouncementsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Announcement[]> {
    return this.prisma.announcement.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(dto: CreateAnnouncementDto): Promise<Announcement> {
    return this.prisma.announcement.create({ data: dto });
  }

  async update(id: string, dto: UpdateAnnouncementDto): Promise<Announcement> {
    await this.findOrFail(id);
    return this.prisma.announcement.update({ where: { id }, data: dto });
  }

  async delete(id: string): Promise<void> {
    await this.findOrFail(id);
    await this.prisma.announcement.delete({ where: { id } });
  }

  private async findOrFail(id: string): Promise<Announcement> {
    const announcement = await this.prisma.announcement.findUnique({
      where: { id },
    });
    if (!announcement) {
      throw new NotFoundException(`Comunicado com id "${id}" não encontrado.`);
    }
    return announcement;
  }
}

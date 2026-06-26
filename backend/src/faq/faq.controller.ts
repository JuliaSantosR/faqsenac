import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateEntryDto } from './dto/create-entry.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { UpdateEntryDto } from './dto/update-entry.dto';
import { FaqService } from './faq.service';

@Controller('faq')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @Get('categories')
  listCategories() {
    return this.faqService.findAllCategories();
  }

  @UseGuards(JwtAuthGuard)
  @Post('categories')
  createCategory(@Body() dto: CreateCategoryDto) {
    return this.faqService.createCategory(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('categories/:id')
  updateCategory(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.faqService.updateCategory(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('categories/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteCategory(@Param('id', ParseUUIDPipe) id: string) {
    return this.faqService.deleteCategory(id);
  }

  @Get('entries')
  listEntries() {
    return this.faqService.findAllEntries();
  }

  @Get('search')
  search(@Query('q') q: string) {
    return this.faqService.searchEntries(q ?? '');
  }

  @UseGuards(JwtAuthGuard)
  @Post('entries')
  createEntry(@Body() dto: CreateEntryDto) {
    return this.faqService.createEntry(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('entries/:id')
  updateEntry(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateEntryDto,
  ) {
    return this.faqService.updateEntry(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('entries/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteEntry(@Param('id', ParseUUIDPipe) id: string) {
    return this.faqService.deleteEntry(id);
  }
}

import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';
import { SupabaseStorageService } from '../storage/supabase-storage.service';
import { productImageMulterOptions } from '../config/multer.config';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly products: ProductsService,
    private readonly storage: SupabaseStorageService,
  ) {}

  private normalizeArrays(body: any) {
    const keys = ['features', 'materials', 'care'];
    for (const key of keys) {
      const val = body[key];
      if (val === undefined || val === null) continue;
      if (Array.isArray(val)) continue; // already array
      if (typeof val === 'string') {
        // Try JSON parse first
        try {
          const parsed = JSON.parse(val);
          if (Array.isArray(parsed)) {
            body[key] = parsed.map(String);
            continue;
          }
        } catch {
          // not JSON
        }
        // Fallback: comma separated
        body[key] = val.split(',').map((s) => s.trim()).filter(Boolean);
      }
    }
  }

  @Post()
  @UseInterceptors(FileInterceptor('image', productImageMulterOptions))
  async create(@Body() dto: CreateProductDto, @UploadedFile() file?: Express.Multer.File) {
    this.normalizeArrays(dto);
    let imageUrl: string | undefined;
    if (file) {
      imageUrl = await this.storage.uploadProductImage(file);
    }
    return this.products.create(dto, imageUrl);
  }

  @Get()
  findAll() {
    return this.products.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.products.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image', productImageMulterOptions))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    this.normalizeArrays(dto);
    let imageUrl: string | undefined;
    if (file) {
      imageUrl = await this.storage.uploadProductImage(file);
    }
    return this.products.update(id, dto, imageUrl);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.products.remove(id);
  }
}

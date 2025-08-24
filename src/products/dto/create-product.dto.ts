import { IsArray, IsNotEmpty, IsOptional, IsString, MaxLength, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(\d+)(\.\d{1,2})?$/, { message: 'price must be a number with up to 2 decimals' })
  price!: string; // accepts integer or decimal string (e.g. "249" or "249.99")

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  longDescription?: string;

  @Transform(({ value }) => transformArrayField(value))
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  features?: string[];

  @Transform(({ value }) => transformArrayField(value))
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  materials?: string[];

  @IsString()
  @IsOptional()
  dimensions?: string;

  @Transform(({ value }) => transformArrayField(value))
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  care?: string[];
}

// Helper used by Transform decorators (must be declared outside class)
function transformArrayField(value: any): string[] | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
    } catch {
      // not JSON
    }
    return value.split(',').map(s => s.trim()).filter(Boolean);
  }
  return undefined;
}

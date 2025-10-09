import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

export enum PriceLevelDTO {
  ONE = 'ONE',
  TWO = 'TWO',
  THREE = 'THREE',
  FOUR = 'FOUR',
}

function toArray(val?: string | string[]) {
  if (val === undefined || val === null) return undefined;
  if (Array.isArray(val))
    return val
      .map(String)
      .map((s) => s.trim())
      .filter(Boolean);
  if (typeof val === 'string')
    return val
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  return undefined;
}

function toIntArray(val?: string | string[]) {
  const arr = toArray(val);
  if (!arr) return undefined;
  const ints = arr
    .map((v) => parseInt(v, 10))
    .filter((v) => Number.isInteger(v));
  return ints.length ? ints : undefined;
}

export class SearchPlaceDto {
  @IsOptional()
  @IsString()
  @Length(2, 100)
  q?: string;

  @IsOptional()
  @Transform(({ value }) => toIntArray(value))
  categoryIds?: number[];

  @IsOptional()
  @Transform(({ value }) => toArray(value))
  categoryNames?: string[];

  @IsOptional()
  @Transform(({ value }) => toIntArray(value))
  tagIds?: number[];

  @IsOptional()
  @Transform(({ value }) => toArray(value))
  tagNames?: string[];

  @IsOptional()
  @Transform(({ value }) => toArray(value))
  @IsEnum(PriceLevelDTO, { each: true })
  priceLevels?: PriceLevelDTO[];

  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  sort?: 'name_asc' | 'name_desc' | 'price_asc' | 'price_desc' | 'rating_desc';
}

import { ApiProperty } from '@nestjs/swagger';
import { PriceLevel } from '@prisma/client';
import { IsInt, IsOptional, IsArray, IsEnum, IsNumber, IsString, IsUrl, } from 'class-validator';
export class CreatePlaceDto {
    @IsString()
    name: string;
    @IsOptional()
    @IsString()
    description?: string;
    @IsString()
    address: string;
    @IsOptional()
    @IsUrl()
    imageUrl?: string;
    @IsOptional()
    @IsUrl()
    siteUrl?: string;
    @IsInt()
    categoryId: number;
    @IsOptional()
    @IsString()
    phone?: string;
    @IsOptional()
    @IsNumber()
    latitude?: number;
    @IsOptional()
    @IsNumber()
    longitude?: number;
    @IsOptional()
    @IsEnum(PriceLevel)
    priceLevel?: PriceLevel;
    @IsOptional()
    @IsString()
    priceRange?: string;
    @IsOptional()
    @IsArray()
    tagNames?: string[];
    @IsOptional()
    @IsArray()
    photoUrls?: string[];
}

import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
export class FindPlacesDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number;
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(50)
    limit?: number;
    @IsOptional()
    @IsString()
    category?: string;
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    categoryId?: number;
    @IsOptional()
    @IsIn(['popular', 'nearby', 'rating'])
    sort?: 'popular' | 'nearby' | 'rating';
    @IsOptional()
    @IsString()
    search?: string;
}
export class SearchByNameResultDto {
    id: number;
    name: string;
    address: string;
    image: string | null;
    avgRating: number | null;
}

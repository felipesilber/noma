import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
export class SearchUserDto {
    @IsString()
    q: string;
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(50)
    limit?: number = 20;
}

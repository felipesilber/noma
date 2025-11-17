import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class CreateCategoryDto {
    @ApiProperty({
        description: 'Nome da categoria',
        example: 'Vegano',
    })
    @IsNotEmpty()
    name: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsUrl, IsArray, IsInt, } from 'class-validator';
export class CreateListDto {
    @ApiProperty({ description: 'Nome da lista', example: 'Bares em Pinheiros' })
    @IsString()
    @IsNotEmpty()
    name: string;
    @ApiProperty({ description: 'Descrição da lista', required: false })
    @IsOptional()
    @IsString()
    description?: string;
    @ApiProperty({
        description: 'URL da imagem de capa da lista',
        required: false,
    })
    @IsOptional()
    @IsUrl()
    imageUrl?: string;
    @ApiProperty({
        description: 'Array de IDs dos lugares para adicionar à lista',
        example: [1, 5, 12],
        required: false,
    })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    placeIds?: number[];
}

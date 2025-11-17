import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';
export class UpdateListDto {
    @ApiProperty({
        description: 'Novo nome da lista',
        example: 'Meus Bares Favoritos',
        required: false,
    })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    name?: string;
    @ApiProperty({ description: 'Nova descrição da lista', required: false })
    @IsOptional()
    @IsString()
    description?: string;
    @ApiProperty({
        description: 'Nova URL da imagem de capa da lista',
        required: false,
    })
    @IsOptional()
    @IsUrl()
    imageUrl?: string;
}

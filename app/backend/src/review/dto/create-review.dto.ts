import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, Max, IsOptional, IsString, IsNumber, } from 'class-validator';
export class CreateReviewDto {
    @ApiProperty({ description: 'Id do estabelecimento', example: 34 })
    @IsInt()
    placeId: number;
    @ApiProperty({
        description: 'Nota geral do estabelecimento (1-5)',
        example: 4,
    })
    @IsInt()
    @Min(1)
    @Max(5)
    generalRating: number;
    @ApiProperty({ description: 'Nota da comida (1-5)', example: 4 })
    @IsInt()
    @Min(1)
    @Max(5)
    foodRating: number;
    @ApiProperty({ description: 'Nota do serviço (1-5)', example: 4 })
    @IsInt()
    @Min(1)
    @Max(5)
    serviceRating: number;
    @ApiProperty({ description: 'Nota do ambiente (1-5)', example: 4 })
    @IsInt()
    @Min(1)
    @Max(5)
    environmentRating: number;
    @ApiProperty({ description: 'Preço pago', example: 54.9, required: false })
    @IsOptional()
    @IsNumber()
    pricePaid?: number;
    @ApiProperty({
        description: 'Número de pessoas',
        example: 2,
        required: false,
    })
    @IsOptional()
    @IsInt()
    numberOfPeople?: number;
    @ApiProperty({
        description: 'Comentário',
        example: 'Muito bom!',
        required: false,
    })
    @IsOptional()
    @IsString()
    comment?: string;
}

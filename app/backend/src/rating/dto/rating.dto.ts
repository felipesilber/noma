import { ApiProperty } from '@nestjs/swagger';
export class PlaceRatingsDto {
    @ApiProperty({ description: 'Nota média geral', example: 4.8 })
    overall: number;
    @ApiProperty({ description: 'Nota média da comida', example: 4.9 })
    food: number;
    @ApiProperty({ description: 'Nota média do serviço', example: 4.7 })
    service: number;
    @ApiProperty({ description: 'Nota média do ambiente', example: 4.8 })
    ambiance: number;
    @ApiProperty({
        description: 'Número total de avaliações gerais',
        example: 125,
    })
    totalReviews: number;
    @ApiProperty({
        description: 'Nota média dos amigos que avaliaram o lugar',
        example: 4.9,
        nullable: true,
    })
    friendsRating: number | null;
    @ApiProperty({
        description: 'Intervalo de preço por pessoa calculado a partir das avaliações (mín e máx)',
        example: { min: 25.5, max: 78.9 },
        nullable: true,
    })
    pricePerPersonInterval?: { min: number; max: number } | null;
}

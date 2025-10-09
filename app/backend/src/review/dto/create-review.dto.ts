import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, Max, IsOptional, IsString } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({
    description: 'Id do estabelecimento',
    example: 34,
  })
  @IsInt()
  placeId: number;

  @ApiProperty({
    description: 'Nota geral do estabelecimento',
    example: 4,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  generalRating: number;

  @ApiProperty({
    description: 'Nota da comida do estabelecimento',
    example: 4,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  foodRating: number;

  @ApiProperty({
    description: 'Nota do serviço do estabelecimento',
    example: 4,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  serviceRating: number;

  @ApiProperty({
    description: 'Nota do ambiente do estabelecimento',
    example: 4,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  environmentRating: number;

  @ApiProperty({
    description: 'Preço',
    example: 54.9,
    required: false,
  })
  @IsOptional()
  price?: number;

  @ApiProperty({
    description: 'Comentário',
    example: 'Muito bom!',
    required: false,
  })
  @IsOptional()
  @IsString()
  comment?: string;
}

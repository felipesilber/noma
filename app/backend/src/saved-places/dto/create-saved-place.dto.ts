import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';
export class CreateSavedPlaceDto {
    @ApiProperty({
        description: 'Id do usuário',
        example: '30',
    })
    @IsInt()
    @Min(1)
    userId: number;
    @ApiProperty({
        description: 'Id do estabelecimento',
        example: '12',
    })
    @IsInt()
    @Min(1)
    placeId: number;
}

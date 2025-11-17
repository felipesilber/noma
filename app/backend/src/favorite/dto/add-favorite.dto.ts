import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';
export class AddFavoriteDto {
    @ApiProperty({
        example: 123,
        description: 'ID do estabelecimento',
    })
    @IsInt()
    @Min(1)
    placeId: number;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';
export class CreateFollowDto {
    @ApiProperty({
        description: 'Id do usuário seguidor',
        example: '1',
    })
    @IsInt()
    @Min(1)
    followerId: number;
    @ApiProperty({
        description: 'Id do usuário seguindo',
        example: '2',
    })
    @IsInt()
    @Min(1)
    followedId: number;
}

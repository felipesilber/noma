import { Controller, Get, Post, Body, Param, Delete, Patch, UseGuards, Query, BadRequestException, ConflictException, } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags, ApiOperation, ApiBody, ApiParam } from '@nestjs/swagger';
import { UserId } from '../auth/decorators/auth-user.decorator';
import { FirebaseAuthGuard } from 'src/auth/firebase-auth.guard';
import { SearchUserDto } from './dto/search-user.dto';
@ApiTags('User')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }
    @ApiOperation({ summary: 'Create a new user' })
    @ApiBody({
        description: 'User creation',
        type: CreateUserDto,
        examples: {
            exemplo1: {
                summary: 'Usuário comum',
                value: {
                    name: 'João Silva',
                    email: 'joao@email.com',
                    password: 'senha123',
                },
            },
        },
    })
    @ApiOperation({ summary: 'Set logged user username' })
    @UseGuards(FirebaseAuthGuard)
    @Patch('me/username')
    async setMyUsername(
    @UserId()
    userId: number, 
    @Body()
    body: {
        username: string;
    }) {
        const username = (body?.username ?? '').trim();
        if (!username) {
			throw new BadRequestException('username is mandatory');
        }
        try {
            return await this.userService.updateUsername(userId, username);
        }
        catch (e: any) {
            if (e?.code === 'P2002') {
				throw new ConflictException('username already in use');
            }
            throw e;
        }
    }
    @ApiOperation({ summary: 'Get all users' })
    @Get()
    findAll() {
        return this.userService.findAll();
    }
    @ApiOperation({ summary: 'Delete all users' })
    @Delete()
    deleteAll() {
        return this.userService.deleteAll();
    }
    @ApiOperation({ summary: 'Search users by username (case-insensitive)' })
    @Get('search')
    search(
    @UserId()
    userId: number, 
    @Query()
    dto: SearchUserDto) {
        const { q, limit } = dto;
        return this.userService.searchUsersByUsername(userId, q, Number(limit ?? 20));
    }
    @ApiOperation({ summary: 'Busca sugestões de usuários aleatórios' })
    @UseGuards(FirebaseAuthGuard)
    @Get('suggestions')
    getSuggestions(
    @UserId()
    userId: number, 
    @Query('limit')
    limit?: string) {
        const limitNumber = Number(limit ?? 3);
        return this.userService.findRandomUsers(limitNumber, userId);
    }
    @ApiOperation({ summary: 'Busca os usuários mais ativos (mais avaliações)' })
    @UseGuards(FirebaseAuthGuard)
    @Get('active')
    findActive(
    @UserId()
    userId: number, 
    @Query('limit')
    limit?: string) {
        const limitNumber = Number(limit ?? 5);
        return this.userService.findActiveUsers(userId, limitNumber);
    }
}

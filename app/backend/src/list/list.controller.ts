import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards, } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ListService } from './list.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { UserId } from 'src/auth/decorators/auth-user.decorator';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
@ApiTags('Lists')
@UseGuards(FirebaseAuthGuard)
@Controller('lists')
export class ListController {
    constructor(private lists: ListService) { }
    @ApiOperation({ summary: 'Cria uma nova lista' })
    @Post()
    create(
    @UserId()
    userId: number, 
    @Body()
    dto: CreateListDto) {
        return this.lists.createList(userId, dto);
    }
    @ApiOperation({ summary: 'Busca as listas do usuário logado' })
    @Get()
    mine(
    @UserId()
    userId: number) {
        return this.lists.getMyLists(userId);
    }
    @ApiOperation({ summary: 'Busca os detalhes de uma lista específica' })
    @Get(':id')
    getOne(
    @UserId()
    userId: number, 
    @Param('id', ParseIntPipe)
    id: number) {
        return this.lists.getMyListById(userId, id);
    }
    @ApiOperation({ summary: 'Atualiza uma lista' })
    @Patch(':id')
    update(
    @UserId()
    userId: number, 
    @Param('id', ParseIntPipe)
    id: number, 
    @Body()
    dto: UpdateListDto) {
        return this.lists.updateList(userId, id, dto);
    }
    @ApiOperation({ summary: 'Adiciona um lugar a uma lista' })
    @Post(':id/places/:placeId')
    addPlace(
    @UserId()
    userId: number, 
    @Param('id', ParseIntPipe)
    id: number, 
    @Param('placeId', ParseIntPipe)
    placeId: number) {
        return this.lists.addPlace(userId, id, placeId);
    }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ListService } from './list.service';

@ApiTags('Lists')
@Controller('lists')
export class ListController {
  constructor(private lists: ListService) {}

  private getUserId(req: any): number {
    const id = req?.user?.id;
    if (!id) throw new Error('Invalid UserId)');
    return id;
  }

  @ApiOperation({ summary: 'Create list' })
  @Post()
  create(@Req() req: any, @Body() dto: { name: string; description?: string }) {
    return this.lists.createList(this.getUserId(req), dto);
  }

  @ApiOperation({ summary: 'Lists from the logged user' })
  @Get()
  mine(@Req() req: any) {
    return this.lists.getMyLists(this.getUserId(req));
  }

  @ApiOperation({ summary: 'List details' })
  @Get(':id')
  getOne(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.lists.getMyListById(this.getUserId(req), id);
  }

  @ApiOperation({ summary: 'Update list' })
  @Patch(':id')
  update(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: { name?: string; description?: string },
  ) {
    return this.lists.updateList(this.getUserId(req), id, dto);
  }

  @ApiOperation({ summary: 'Delete list' })
  @Delete(':id')
  remove(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.lists.deleteList(this.getUserId(req), id);
  }

  @ApiOperation({ summary: 'Add place to a list' })
  @Post(':id/places/:placeId')
  addPlace(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Param('placeId', ParseIntPipe) placeId: number,
  ) {
    return this.lists.addPlace(this.getUserId(req), id, placeId);
  }

  @ApiOperation({ summary: 'Remove place from a list' })
  @Delete(':id/places/:placeId')
  removePlace(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Param('placeId', ParseIntPipe) placeId: number,
  ) {
    return this.lists.removePlace(this.getUserId(req), id, placeId);
  }

  @ApiOperation({ summary: 'Order places from a list' })
  @Patch(':id/reorder')
  reorder(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { items: { placeId: number; order: number }[] },
  ) {
    return this.lists.reorder(this.getUserId(req), id, body.items ?? []);
  }
}

import { Controller, Post, Get, Delete, Body, Param } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ApiTags, ApiOperation, ApiBody, ApiParam } from '@nestjs/swagger';

//Category Controller
@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // Create a new category
  @Post()
  @ApiOperation({ summary: 'Create a new category' })
  @ApiBody({
    description: 'Category creation',
    type: CreateCategoryDto,
    examples: {
      exemplo1: {
        summary: 'Example',
        value: {
          name: 'Restaurante Italiano',
        },
      },
    },
  })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  // Get all categories
  @Get(':id')
  @ApiOperation({ summary: 'Get category by id' })
  @ApiParam({ name: 'id', type: Number, description: 'Category ID' })
  findById(@Param('id') id: string) {
    return this.categoryService.findById(Number(id));
  }

  // Get all categories
  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  findAll() {
    return this.categoryService.findAll();
  }

  // Delete all categories
  @Delete()
  @ApiOperation({ summary: 'Delete all categories' })
  deleteAll() {
    return this.categoryService.deleteAll();
  }
}

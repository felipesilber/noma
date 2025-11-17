import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
@Injectable()
export class CategoryService {
    constructor(private prisma: PrismaService) { }
    create(createCategoryDto: CreateCategoryDto) {
        return this.prisma.category.create({
            data: createCategoryDto,
        });
    }
    findAll() {
        return this.prisma.category.findMany();
    }
    findById(categoryId: number) {
        return this.prisma.category.findUnique({ where: { id: categoryId } });
    }
    deleteAll() {
        return this.prisma.category.deleteMany();
    }
}

import { Test } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
describe('CategoryController', () => {
    let controller: CategoryController;
    const service = {
        create: jest.fn(),
        findById: jest.fn(),
        findAll: jest.fn(),
        deleteAll: jest.fn(),
    };
    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [CategoryController],
            providers: [{ provide: CategoryService, useValue: service }],
        }).compile();
        controller = moduleRef.get(CategoryController);
        jest.clearAllMocks();
    });
    it('creates a category', async () => {
        const dto = { name: 'Italian' } as any;
        service.create.mockResolvedValue({ id: 1, ...dto });
        const res = await controller.create(dto);
        expect(service.create).toHaveBeenCalledWith(dto);
        expect(res).toEqual({ id: 1, name: 'Italian' });
    });
    it('gets by id', async () => {
        service.findById.mockResolvedValue({ id: 5, name: 'Bar' });
        const res = await controller.findById('5');
        expect(service.findById).toHaveBeenCalledWith(5);
        expect(res).toEqual({ id: 5, name: 'Bar' });
    });
    it('lists all', async () => {
        service.findAll.mockResolvedValue([{ id: 1 }]);
        const res = await controller.findAll();
        expect(service.findAll).toHaveBeenCalled();
        expect(res).toEqual([{ id: 1 }]);
    });
    it('deletes all', async () => {
        service.deleteAll.mockResolvedValue({ count: 2 });
        const res = await controller.deleteAll();
        expect(service.deleteAll).toHaveBeenCalled();
        expect(res).toEqual({ count: 2 });
    });
});

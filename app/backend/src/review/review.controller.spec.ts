import { Test } from '@nestjs/testing';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { FirebaseAuthGuard } from 'src/auth/firebase-auth.guard';
describe('ReviewController', () => {
    let controller: ReviewController;
    const service = {
        create: jest.fn(),
        findAll: jest.fn(),
        findByUser: jest.fn(),
        findByPlace: jest.fn(),
        delete: jest.fn(),
        deleteAll: jest.fn(),
    };
    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [ReviewController],
            providers: [{ provide: ReviewService, useValue: service }],
        })
            .overrideGuard(FirebaseAuthGuard)
            .useValue({ canActivate: () => true })
            .compile();
        controller = moduleRef.get(ReviewController);
        jest.clearAllMocks();
    });
    it('creates', async () => {
        const dto: any = { placeId: 3, rating: 5, price: 54.9, comment: 'Nice' };
        service.create.mockResolvedValue({ id: 1 });
        const res = await controller.create(dto, 10);
        expect(service.create).toHaveBeenCalledWith(10, dto);
        expect(res).toEqual({ id: 1 });
    });
    it('findAll', async () => {
        service.findAll.mockResolvedValue([{ id: 1 }]);
        const res = await controller.findAll();
        expect(service.findAll).toHaveBeenCalled();
        expect(res).toEqual([{ id: 1 }]);
    });
    it('findByUser', async () => {
        service.findByUser.mockResolvedValue([{ id: 2 }]);
        const res = await controller.findByUser('7');
        expect(service.findByUser).toHaveBeenCalledWith(7);
        expect(res).toEqual([{ id: 2 }]);
    });
    it('findByPlace', async () => {
        service.findByPlace.mockResolvedValue([{ id: 3 }]);
        const res = await controller.findByPlace('9');
        expect(service.findByPlace).toHaveBeenCalledWith(9);
        expect(res).toEqual([{ id: 3 }]);
    });
    it('delete', async () => {
        service.delete.mockResolvedValue({ id: 5 });
        const res = await controller.delete('5');
        expect(service.delete).toHaveBeenCalledWith(5);
        expect(res).toEqual({ id: 5 });
    });
    it('deleteAll', async () => {
        service.deleteAll.mockResolvedValue({ count: 4 });
        const res = await controller.deleteAll();
        expect(service.deleteAll).toHaveBeenCalled();
        expect(res).toEqual({ count: 4 });
    });
});

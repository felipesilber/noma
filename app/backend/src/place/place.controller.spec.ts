import { Test } from '@nestjs/testing';
import { PlaceController } from './place.controller';
import { PlaceService } from './place.service';
import { FirebaseAuthGuard } from 'src/auth/firebase-auth.guard';
describe('PlaceController', () => {
    let controller: PlaceController;
    const service = {
        create: jest.fn(),
        findAll: jest.fn(),
        getByCategory: jest.fn(),
        getVisitedByUser: jest.fn(),
        search: jest.fn(),
        searchAdvanced: jest.fn(),
        getDetails: jest.fn(),
        deleteAll: jest.fn(),
        topReviewedThisWeek: jest.fn(),
    };
    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [PlaceController],
            providers: [{ provide: PlaceService, useValue: service }],
        })
            .overrideGuard(FirebaseAuthGuard)
            .useValue({ canActivate: () => true })
            .compile();
        controller = moduleRef.get(PlaceController);
        jest.clearAllMocks();
    });
    it('creates', async () => {
        const dto: any = { name: 'Bar', categoryId: 1 };
        service.create.mockResolvedValue({ id: 1, ...dto });
        const res = await controller.create(dto);
        expect(service.create).toHaveBeenCalledWith(dto);
        expect(res).toEqual({ id: 1, ...dto });
    });
    it('findAll', async () => {
        service.findAll.mockResolvedValue([{ id: 1 }]);
        const res = await controller.findAll();
        expect(service.findAll).toHaveBeenCalled();
        expect(res).toEqual([{ id: 1 }]);
    });
    it('getByCategory', async () => {
        service.getByCategory.mockResolvedValue([{ id: 2 }]);
        const res = await controller.getByCategory('7');
        expect(service.getByCategory).toHaveBeenCalledWith(7);
        expect(res).toEqual([{ id: 2 }]);
    });
    it('getVisitedByUser', async () => {
        service.getVisitedByUser.mockResolvedValue([{ id: 3 }]);
        const res = await controller.getVisitedByUser('9');
        expect(service.getVisitedByUser).toHaveBeenCalledWith(9);
        expect(res).toEqual([{ id: 3 }]);
    });
    it('search with limit', async () => {
        service.search.mockResolvedValue([{ id: 1 }]);
        const res = await controller.search({ q: 'bar', limit: 5 } as any);
        expect(service.search).toHaveBeenCalledWith('bar', 5);
        expect(res).toEqual([{ id: 1 }]);
    });
    it('search without limit', async () => {
        service.search.mockResolvedValue([{ id: 2 }]);
        const res = await controller.search({ q: 'bar' } as any);
        expect(service.search).toHaveBeenCalledWith('bar', undefined);
        expect(res).toEqual([{ id: 2 }]);
    });
    it('searchFilter', async () => {
        const dto: any = { q: 'x', categoryIds: [1], sort: 'name_asc' };
        service.searchAdvanced.mockResolvedValue({
            data: [],
            pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
        });
        const res = await controller.searchFilter(dto);
        expect(service.searchAdvanced).toHaveBeenCalledWith(dto);
        expect(res).toEqual({
            data: [],
            pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
        });
    });
    it('getDetails without friends', async () => {
        service.getDetails.mockResolvedValue({ id: 10 });
        const res = await controller.getDetails('10');
        expect(service.getDetails).toHaveBeenCalledWith(10, undefined);
        expect(res).toEqual({ id: 10 });
    });
    it('getDetails with friends', async () => {
        service.getDetails.mockResolvedValue({ id: 10 });
        const res = await controller.getDetails('10', '1, 2 ,foo,3');
        expect(service.getDetails).toHaveBeenCalledWith(10, [1, 2, 3]);
        expect(res).toEqual({ id: 10 });
    });
    it('deleteAll', async () => {
        service.deleteAll.mockResolvedValue({ count: 4 });
        const res = await controller.deleteAll();
        expect(service.deleteAll).toHaveBeenCalled();
        expect(res).toEqual({ count: 4 });
    });
    it('rankingWeekly default', async () => {
        service.topReviewedThisWeek.mockResolvedValue([{ id: 1 }]);
        const res = await controller.rankingWeekly();
        expect(service.topReviewedThisWeek).toHaveBeenCalledWith(10);
        expect(res).toEqual([{ id: 1 }]);
    });
    it('rankingWeekly custom', async () => {
        service.topReviewedThisWeek.mockResolvedValue([{ id: 2 }]);
        const res = await controller.rankingWeekly('7');
        expect(service.topReviewedThisWeek).toHaveBeenCalledWith(7);
        expect(res).toEqual([{ id: 2 }]);
    });
});

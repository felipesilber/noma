import { Test } from '@nestjs/testing';
import { ListController } from './list.controller';
import { ListService } from './list.service';

describe('ListController', () => {
  let controller: ListController;
  const service = {
    createList: jest.fn(),
    getMyLists: jest.fn(),
    getMyListById: jest.fn(),
    updateList: jest.fn(),
    deleteList: jest.fn(),
    addPlace: jest.fn(),
    removePlace: jest.fn(),
    reorder: jest.fn(),
  };

  const req = (id: number | null) => (id ? { user: { id } } : {});

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ListController],
      providers: [{ provide: ListService, useValue: service }],
    }).compile();

    controller = moduleRef.get(ListController);
    jest.clearAllMocks();
  });

  it('create', async () => {
    service.createList.mockResolvedValue({ id: 1 });
    const res = await controller.create(req(10), { name: 'Favs' });
    expect(service.createList).toHaveBeenCalledWith(10, { name: 'Favs' });
    expect(res).toEqual({ id: 1 });
  });

  it('mine', async () => {
    service.getMyLists.mockResolvedValue([{ id: 1 }]);
    const res = await controller.mine(req(10));
    expect(service.getMyLists).toHaveBeenCalledWith(10);
    expect(res).toEqual([{ id: 1 }]);
  });

  it('getOne', async () => {
    service.getMyListById.mockResolvedValue({ id: 7 });
    const res = await controller.getOne(req(10), 7);
    expect(service.getMyListById).toHaveBeenCalledWith(10, 7);
    expect(res).toEqual({ id: 7 });
  });

  it('update', async () => {
    service.updateList.mockResolvedValue({ id: 7, name: 'New' });
    const res = await controller.update(req(10), 7, { name: 'New' });
    expect(service.updateList).toHaveBeenCalledWith(10, 7, { name: 'New' });
    expect(res).toEqual({ id: 7, name: 'New' });
  });

  it('remove', async () => {
    service.deleteList.mockResolvedValue({ ok: true });
    const res = await controller.remove(req(10), 7);
    expect(service.deleteList).toHaveBeenCalledWith(10, 7);
    expect(res).toEqual({ ok: true });
  });

  it('addPlace', async () => {
    service.addPlace.mockResolvedValue({ placeId: 55 });
    const res = await controller.addPlace(req(10), 7, 55);
    expect(service.addPlace).toHaveBeenCalledWith(10, 7, 55);
    expect(res).toEqual({ placeId: 55 });
  });

  it('removePlace', async () => {
    service.removePlace.mockResolvedValue({ ok: true });
    const res = await controller.removePlace(req(10), 7, 55);
    expect(service.removePlace).toHaveBeenCalledWith(10, 7, 55);
    expect(res).toEqual({ ok: true });
  });

  it('reorder', async () => {
    service.reorder.mockResolvedValue({ ok: true });
    const body = { items: [{ placeId: 1, order: 2 }] };
    const res = await controller.reorder(req(10), 7, body);
    expect(service.reorder).toHaveBeenCalledWith(10, 7, body.items);
    expect(res).toEqual({ ok: true });
  });

  it('throws on missing user id', () => {
    expect(() => controller.mine(req(null) as any)).toThrow('Invalid UserId)');
  });
});

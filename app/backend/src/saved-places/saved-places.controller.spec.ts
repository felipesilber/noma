// src/saved-places/saved-places.controller.spec.ts
import { Test } from '@nestjs/testing';
import { SavedPlaceController } from './saved-places.controller';
import { SavedPlaceService } from './saved-places.service';
import { FirebaseAuthGuard } from 'src/auth/firebase-auth.guard';

describe('SavedPlaceController', () => {
  let controller: SavedPlaceController;
  const service = {
    listMine: jest.fn(),
    isSaved: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [SavedPlaceController],
      providers: [{ provide: SavedPlaceService, useValue: service }],
    })
      .overrideGuard(FirebaseAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = moduleRef.get(SavedPlaceController);
    jest.clearAllMocks();
  });

  it('listMine', async () => {
    service.listMine.mockResolvedValue([{ id: 1 }]);
    const res = await controller.listMine(10);
    expect(service.listMine).toHaveBeenCalledWith(10);
    expect(res).toEqual([{ id: 1 }]);
  });

  it('isSaved', async () => {
    service.isSaved.mockResolvedValue({ saved: true });
    const res = await controller.isSaved('15', 10);
    expect(service.isSaved).toHaveBeenCalledWith(10, 15);
    expect(res).toEqual({ saved: true });
  });

  it('save', async () => {
    service.save.mockResolvedValue({ saved: true });
    const res = await controller.save('15', 10);
    expect(service.save).toHaveBeenCalledWith(10, 15);
    expect(res).toEqual({ saved: true });
  });

  it('remove', async () => {
    service.remove.mockResolvedValue({ saved: false });
    const res = await controller.remove('15', 10);
    expect(service.remove).toHaveBeenCalledWith(10, 15);
    expect(res).toEqual({ saved: false });
  });
});

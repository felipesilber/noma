import { Test } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  const service = {
    updateUsername: jest.fn(),
    findAll: jest.fn(),
    deleteAll: jest.fn(),
    searchUsersByUsername: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: service }],
    }).compile();
    controller = moduleRef.get(UserController);
    jest.clearAllMocks();
  });

  it('setMyUsername success', async () => {
    service.updateUsername.mockResolvedValue({ id: 1, username: 'ed' });
    const res = await controller.setMyUsername(10, { username: '  ed  ' });
    expect(service.updateUsername).toHaveBeenCalledWith(10, 'ed');
    expect(res).toEqual({ id: 1, username: 'ed' });
  });

  it('setMyUsername empty username', async () => {
    await expect(
      controller.setMyUsername(10, { username: '   ' }),
    ).rejects.toThrow('username is mandatory');
    expect(service.updateUsername).not.toHaveBeenCalled();
  });

  it('setMyUsername P2002', async () => {
    const err: any = new Error('dup');
    err.code = 'P2002';
    service.updateUsername.mockRejectedValue(err);
    await expect(
      controller.setMyUsername(10, { username: 'ed' }),
    ).rejects.toThrow('Already in use.');
  });

  it('findAll', async () => {
    service.findAll.mockResolvedValue([{ id: 1 }]);
    const res = await controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
    expect(res).toEqual([{ id: 1 }]);
  });

  it('deleteAll', async () => {
    service.deleteAll.mockResolvedValue({ count: 3 });
    const res = await controller.deleteAll();
    expect(service.deleteAll).toHaveBeenCalled();
    expect(res).toEqual({ count: 3 });
  });

  it('search default limit', async () => {
    service.searchUsersByUsername.mockResolvedValue([{ id: 2 }]);
    const res = await controller.search(7, { q: 'ed' } as any);
    expect(service.searchUsersByUsername).toHaveBeenCalledWith(7, 'ed', 20);
    expect(res).toEqual([{ id: 2 }]);
  });

  it('search custom limit', async () => {
    service.searchUsersByUsername.mockResolvedValue([{ id: 3 }]);
    const res = await controller.search(7, { q: 'ed', limit: '5' } as any);
    expect(service.searchUsersByUsername).toHaveBeenCalledWith(7, 'ed', 5);
    expect(res).toEqual([{ id: 3 }]);
  });
});

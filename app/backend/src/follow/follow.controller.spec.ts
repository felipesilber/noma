// src/follow/follow.controller.spec.ts
import { Test } from '@nestjs/testing';
import { FollowController } from './follow.controller';
import { FollowService } from './follow.service';
import { FirebaseAuthGuard } from 'src/auth/firebase-auth.guard';

describe('FollowController', () => {
  let controller: FollowController;
  const service = {
    follow: jest.fn(),
    unfollow: jest.fn(),
    isFollowing: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [FollowController],
      providers: [{ provide: FollowService, useValue: service }],
    })
      .overrideGuard(FirebaseAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = moduleRef.get(FollowController);
    jest.clearAllMocks();
  });

  it('follows', async () => {
    const res = await controller.follow('20', 10);
    expect(service.follow).toHaveBeenCalledWith(10, 20);
    expect(res).toEqual({ following: true });
  });

  it('unfollows', async () => {
    const res = await controller.unfollow('20', 10);
    expect(service.unfollow).toHaveBeenCalledWith(10, 20);
    expect(res).toEqual({ following: false });
  });

  it('status true', async () => {
    service.isFollowing.mockResolvedValue(true);
    const res = await controller.status('20', 10);
    expect(service.isFollowing).toHaveBeenCalledWith(10, 20);
    expect(res).toEqual({ following: true });
  });

  it('status false', async () => {
    service.isFollowing.mockResolvedValue(false);
    const res = await controller.status('20', 10);
    expect(res).toEqual({ following: false });
  });
});

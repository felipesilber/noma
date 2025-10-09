import { Test } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FirebaseAuthGuard } from './firebase-auth.guard';

describe('AuthController', () => {
  let controller: AuthController;
  const service = { validateOrCreateUser: jest.fn() };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: service }],
    })
      .overrideGuard(FirebaseAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = moduleRef.get(AuthController);
    jest.clearAllMocks();
  });

  it('me returns payload', () => {
    const user = { id: 1, firebaseUid: 'uid', name: 'Ed', email: 'ed@mail' };
    const fUser = {
      email_verified: true,
      firebase: { sign_in_provider: 'google.com' },
    };
    const res = controller.me(user as any, fUser as any);
    expect(res).toEqual({
      id: 1,
      firebaseUid: 'uid',
      name: 'Ed',
      email: 'ed@mail',
      emailVerified: true,
      provider: 'google.com',
    });
  });

  it('me defaults when fUser empty', () => {
    const user = { id: 2, firebaseUid: 'x', name: 'A', email: 'a@mail' };
    const res = controller.me(user as any, undefined as any);
    expect(res).toEqual({
      id: 2,
      firebaseUid: 'x',
      name: 'A',
      email: 'a@mail',
      emailVerified: false,
      provider: 'password',
    });
  });

  it('login delegates to service', async () => {
    const req: any = { user: { uid: 'u1' } };
    service.validateOrCreateUser.mockResolvedValue({ id: 1 });
    const out = await controller.login(req);
    expect(service.validateOrCreateUser).toHaveBeenCalledWith({ uid: 'u1' });
    expect(out).toEqual({ id: 1 });
  });
});

import { Test } from '@nestjs/testing';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { FirebaseAuthGuard } from 'src/auth/firebase-auth.guard';
describe('ProfileController', () => {
    let controller: ProfileController;
    const service = { getMyProfile: jest.fn() };
    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [ProfileController],
            providers: [{ provide: ProfileService, useValue: service }],
        })
            .overrideGuard(FirebaseAuthGuard)
            .useValue({ canActivate: () => true })
            .compile();
        controller = moduleRef.get(ProfileController);
        jest.clearAllMocks();
    });
    it('me', async () => {
        const profile = { id: 1, username: 'ed' } as any;
        service.getMyProfile.mockResolvedValue(profile);
        const res = await controller.me(10);
        expect(service.getMyProfile).toHaveBeenCalledWith(10);
        expect(res).toBe(profile);
    });
});

import { AuthService } from './auth.service';
type PrismaMock = {
    user: {
        findUnique: jest.Mock;
        create: jest.Mock;
    };
};
const makePrismaMock = (): PrismaMock => ({
    user: {
        findUnique: jest.fn(),
        create: jest.fn(),
    },
});
describe('AuthService', () => {
    let service: AuthService;
    let prisma: PrismaMock;
    beforeEach(() => {
        prisma = makePrismaMock();
        service = new AuthService(prisma as any);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('returns existing user', async () => {
        prisma.user.findUnique.mockResolvedValue({ id: 7, firebaseUid: 'uid' });
        const res = await service.validateOrCreateUser({
            uid: 'uid',
            email: 'a@mail',
            name: 'A',
        });
        expect(prisma.user.findUnique).toHaveBeenCalledWith({
            where: { firebaseUid: 'uid' },
        });
        expect(prisma.user.create).not.toHaveBeenCalled();
        expect(res).toEqual({ id: 7, firebaseUid: 'uid' });
    });
    it('creates when not found', async () => {
        prisma.user.findUnique.mockResolvedValue(null);
        prisma.user.create.mockResolvedValue({
            id: 8,
            firebaseUid: 'uid2',
            email: 'b@mail',
            username: 'B',
        });
        const res = await service.validateOrCreateUser({
            uid: 'uid2',
            email: 'b@mail',
            name: 'B',
        });
        expect(prisma.user.create).toHaveBeenCalledWith({
            data: { firebaseUid: 'uid2', email: 'b@mail', username: 'B' },
        });
        expect(res).toEqual({
            id: 8,
            firebaseUid: 'uid2',
            email: 'b@mail',
            username: 'B',
        });
    });
    it('creates with empty fallbacks', async () => {
        prisma.user.findUnique.mockResolvedValue(null);
        prisma.user.create.mockResolvedValue({
            id: 9,
            firebaseUid: 'u3',
            email: '',
            username: '',
        });
        const res = await service.validateOrCreateUser({ uid: 'u3' });
        expect(prisma.user.create).toHaveBeenCalledWith({
            data: { firebaseUid: 'u3', email: '', username: '' },
        });
        expect(res).toEqual({ id: 9, firebaseUid: 'u3', email: '', username: '' });
    });
});

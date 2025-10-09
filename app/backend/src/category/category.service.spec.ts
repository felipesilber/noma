import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';

type PrismaCategoryMock = {
  create: jest.Mock;
  findMany: jest.Mock;
  findUnique: jest.Mock;
  deleteMany: jest.Mock;
};

type PrismaMock = {
  category: PrismaCategoryMock;
};

const makePrismaMock = (): PrismaMock => ({
  category: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    deleteMany: jest.fn(),
  },
});

describe('CategoryService', () => {
  let service: CategoryService;
  let prismaMock: PrismaMock;

  beforeEach(() => {
    prismaMock = makePrismaMock();
    service = new CategoryService(prismaMock as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  describe('findById', () => {
    it('gets category by id', async () => {
      prismaMock.category.findUnique.mockResolvedValue({ id: 1, name: 'Bar' });

      const res = await service.findById(1);

      expect(res).toEqual({ id: 1, name: 'Bar' });
      expect(prismaMock.category.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaMock.category.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('returns null for non-existent id', async () => {
      prismaMock.category.findUnique.mockResolvedValue(null);

      const res = await service.findById(999);

      expect(res).toBeNull();
      expect(prismaMock.category.findUnique).toHaveBeenCalledWith({
        where: { id: 999 },
      });
    });

    it('returns primsa error', async () => {
      prismaMock.category.findUnique.mockRejectedValue(new Error('DB down'));

      await expect(service.findById(1)).rejects.toThrow('DB down');
    });
  });

  describe('create', () => {
    it('creates category', async () => {
      const dto: CreateCategoryDto = { name: 'Comida de Boteco' } as any;

      prismaMock.category.create.mockResolvedValue({ id: 7, ...dto });

      const res = await service.create(dto);

      expect(res).toEqual({ id: 7, ...dto });
      expect(prismaMock.category.create).toHaveBeenCalledTimes(1);
      expect(prismaMock.category.create).toHaveBeenCalledWith({
        data: dto,
      });
    });
  });

  describe('findAll', () => {
    it('lists all categories', async () => {
      const list = [
        { id: 1, name: 'Bar' },
        { id: 2, name: 'Restaurante' },
      ];
      prismaMock.category.findMany.mockResolvedValue(list);

      const res = await service.findAll();

      expect(res).toEqual(list);
      expect(prismaMock.category.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.category.findMany).toHaveBeenCalledWith();
    });
  });

  describe('deleteAll', () => {
    it('deletes all categories', async () => {
      prismaMock.category.deleteMany.mockResolvedValue({ count: 3 });

      const res = await service.deleteAll();

      expect(res).toEqual({ count: 3 });
      expect(prismaMock.category.deleteMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.category.deleteMany).toHaveBeenCalledWith();
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User, UserRole } from 'src/users/entities/users.entity';
import { Repository } from 'typeorm';
import { CreateRestaurantInput } from './dtos/createRestaurant.dto';
import { Category } from './entities/category.entity';
import { Restaurant } from './entities/restaurant.entity';
import { CategoryRepository } from './repositories/category.repository';
import { RestaurantsService } from './restaurants.service';

const mockRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  findOneOrFail: jest.fn(),
  delete: jest.fn(),
  getOrCreate: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const test_owner_user: User = {
  id: 1,
  role: UserRole.Owner,
  email: '',
  password: '',
  verified: true,
  restaurants: [],
  hashPassword: null,
  checkPassword: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const test_client_user: User = {
  id: 2,
  role: UserRole.Client,
  email: '',
  password: '',
  verified: true,
  restaurants: null,
  hashPassword: null,
  checkPassword: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const test_delivery_user: User = {
  id: 3,
  role: UserRole.Delivery,
  email: '',
  password: '',
  verified: true,
  restaurants: null,
  hashPassword: null,
  checkPassword: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const created_category: Category = {
  id: 1,
  name: '',
  coverImg: '',
  slug: '',
  restaurants: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const created_restaurant_not_owner: Restaurant = {
  id: 1,
  name: '',
  coverImg: '',
  address: '',
  category: created_category,
  owner: test_owner_user,
  ownerId: 2,
  createdAt: new Date(),
  updatedAt: new Date(),
};
const created_restaurant_owner: Restaurant = {
  id: 1,
  name: '',
  coverImg: '',
  address: '',
  category: created_category,
  owner: test_owner_user,
  ownerId: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
};

test_owner_user.restaurants.push(created_restaurant_owner);

describe('RestaurantsService', () => {
  let service: RestaurantsService;
  let restaurantsRepository: MockRepository<Restaurant>;
  let categoriesRepository: MockRepository<CategoryRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RestaurantsService,
        {
          provide: getRepositoryToken(Restaurant),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(CategoryRepository),
          useValue: mockRepository(),
        },
      ],
    }).compile();

    service = module.get<RestaurantsService>(RestaurantsService);
    restaurantsRepository = module.get(getRepositoryToken(Restaurant));
    categoriesRepository = module.get(getRepositoryToken(CategoryRepository));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createRestaurant', () => {
    const args: CreateRestaurantInput = {
      address: 'test_address',
      coverImg: 'test_coverImg',
      name: 'test_name',
      categoryName: '',
    };

    it('if throw error return false', async () => {
      restaurantsRepository.create.mockRejectedValue(new Error());
      const result = await service.createRestaurant(test_owner_user, args);
      expect(result).toEqual({
        ok: false,
        error: new Error(),
      });
    });
    it('if throw error when user not owner', async () => {
      const result = await service.createRestaurant(test_client_user, args);
      expect(result).toEqual({
        ok: false,
        error: expect.any(Error),
      });
    });
    it('should be create restaurant if category exist', async () => {
      restaurantsRepository.create.mockResolvedValue(args);
      categoriesRepository.findOne.mockResolvedValue({ slug: '' });
      categoriesRepository.create.mockReturnValue({ slug: '', name: '' });
      categoriesRepository.save.mockResolvedValue({ slug: '', name: '' });

      const result = await service.createRestaurant(test_owner_user, args);
      expect(result).toEqual({
        ok: true,
      });
    });
    it('should be create restaurant if category not exist', async () => {
      restaurantsRepository.create.mockResolvedValue(args);
      categoriesRepository.findOne.mockResolvedValue(undefined);
      categoriesRepository.create.mockReturnValue({ slug: '', name: '' });
      categoriesRepository.save.mockResolvedValue({ slug: '', name: '' });

      const result = await service.createRestaurant(test_owner_user, args);
      expect(result).toEqual({
        ok: true,
      });
    });
  });

  describe('editRestaurant', () => {
    const editArgs = {
      restaurantId: 1,
      name: 'new_name',
    };

    it('should be return false when restaurnat not exist', async () => {
      restaurantsRepository.findOne.mockResolvedValue(undefined);
      const result = await service.editRestaurant(test_owner_user, editArgs);
      expect(result).toEqual({
        ok: false,
        error: 'Restaurant not found',
      });
    });
    it('should be return false when restaurant is won owner', async () => {
      restaurantsRepository.findOne.mockResolvedValue(
        created_restaurant_not_owner,
      );
      const result = await service.editRestaurant(test_owner_user, editArgs);
      expect(result).toEqual({
        ok: false,
        error: "You can't edit this restaurant you don't won",
      });
    });
    it('should be return true', async () => {
      restaurantsRepository.findOne.mockResolvedValue(created_restaurant_owner);
      const result = await service.editRestaurant(test_owner_user, editArgs);
      expect(result).toEqual({
        ok: true,
      });
    });
    it('if throw error return false', async () => {
      restaurantsRepository.findOne.mockRejectedValue(new Error());
      const result = await service.editRestaurant(test_owner_user, editArgs);
      expect(result).toEqual({
        ok: false,
        error: new Error(),
      });
    });
  });

  describe('deleteRestaurant', () => {
    const args = {
      restaurantId: 1,
    };
    it('should return false when restaurant not found', async () => {
      restaurantsRepository.findOne.mockResolvedValue(undefined);
      const result = await service.deleteRestaurant(test_owner_user, args);
      expect(result).toEqual({
        ok: false,
        error: 'Restaurant not found',
      });
    });
    it("should return false when restaurant thar you dont't won", async () => {
      restaurantsRepository.findOne.mockResolvedValue(args);
      const result = await service.deleteRestaurant(test_owner_user, args);
      expect(result).toEqual({
        ok: false,
        error: "you cannot delete this restaurant that you don't own",
      });
    });
    it('should return true', async () => {
      restaurantsRepository.findOne.mockResolvedValue(created_restaurant_owner);
      const result = await service.deleteRestaurant(test_owner_user, args);
      expect(result).toEqual({
        ok: true,
      });
    });
    it('should return false when throw error', async () => {
      restaurantsRepository.findOne.mockResolvedValue(created_restaurant_owner);
      restaurantsRepository.delete.mockRejectedValue(new Error());
      const result = await service.deleteRestaurant(test_owner_user, args);
      expect(result).toEqual({
        ok: false,
        error: expect.any(Error),
      });
    });
  });
});

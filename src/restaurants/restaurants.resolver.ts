import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { User } from 'src/users/entities/users.entity';
import { AllCategoriesOutput } from './dtos/allCategories.dto';
import { CategoryInput, CategoryOutput } from './dtos/category.dto';
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from './dtos/createRestaurant.dto';
import {
  DeleteRestaurantInput,
  DeleteRestaurantOutput,
} from './dtos/deleteRestaurant.dto';
import {
  EditRestaurantInput,
  EditRestaurantOutput,
} from './dtos/editRestaurant.dto';
import {
  AllRestaurantsInput,
  AllRestaurantsOutput,
} from './dtos/allRestaurants.dto';
import { Category } from './entities/category.entity';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantsService } from './restaurants.service';
import { RestaurantInput, RestaurantOutput } from './dtos/restaurant.dto';
import {
  SearchRestaurantInput,
  SearchRestaurantOutput,
} from './dtos/search-restaurants.dto';
import { Dish } from './entities/dish.entity';
import { CreateDishInput, CreateDishOutput } from './dtos/createDish.dto';
import {
  DeleteDishInput,
  DeleteDishOutput as EditDishOutput,
} from './dtos/deleteDish.dto';
import { EditDishInput } from './dtos/editDish.dto';

@Resolver(() => Restaurant)
export class RestaurantsResolver {
  constructor(private readonly retaurantsService: RestaurantsService) {}

  @Mutation(() => CreateRestaurantOutput)
  @Role('Owner')
  async createRestaurant(
    @AuthUser() owner: User,
    @Args('input') createRestaurantInput: CreateRestaurantInput,
  ): Promise<CreateRestaurantOutput> {
    return this.retaurantsService.createRestaurant(
      owner,
      createRestaurantInput,
    );
  }

  @Mutation(() => EditRestaurantOutput)
  @Role('Owner')
  async editRestaurant(
    @AuthUser() owner: User,
    @Args('input') editRestaurantInput: EditRestaurantInput,
  ): Promise<EditRestaurantOutput> {
    return this.retaurantsService.editRestaurant(owner, editRestaurantInput);
  }

  @Mutation(() => DeleteRestaurantOutput)
  @Role('Owner')
  async deleteRestaurant(
    @AuthUser() owner: User,
    @Args('input') deleteRestaurantInput: DeleteRestaurantInput,
  ): Promise<DeleteRestaurantOutput> {
    return this.retaurantsService.deleteRestaurant(
      owner,
      deleteRestaurantInput,
    );
  }

  @Query(() => RestaurantOutput)
  async findRestaurantById(
    @Args('input') restaurantInput: RestaurantInput,
  ): Promise<RestaurantOutput> {
    return this.retaurantsService.findRestaurantById(restaurantInput);
  }

  @Query(() => SearchRestaurantOutput)
  async searchRestaurants(
    @Args('input') searchRestaurantInput: SearchRestaurantInput,
  ): Promise<SearchRestaurantOutput> {
    return this.retaurantsService.searchRestaurants(searchRestaurantInput);
  }
}

@Resolver(() => Category)
export class CategoriesResolver {
  constructor(private readonly retaurantsService: RestaurantsService) {}

  @ResolveField(() => Number)
  async restaurantCount(@Parent() category: Category): Promise<number> {
    return this.retaurantsService.restaurantCount(category);
  }

  @Query(() => AllCategoriesOutput)
  @Role('Any')
  async allCategories(): Promise<AllCategoriesOutput> {
    return this.retaurantsService.allCategories();
  }

  @Query(() => CategoryOutput)
  @Role('Any')
  category(
    @Args('input') categoryInput: CategoryInput,
  ): Promise<CategoryOutput> {
    return this.retaurantsService.findCategoryBySlug(categoryInput);
  }

  @Query(() => AllRestaurantsOutput)
  @Role('Any')
  async allRestaurants(
    @Args('input') restaurantsInput: AllRestaurantsInput,
  ): Promise<AllRestaurantsOutput> {
    return this.retaurantsService.allRestaurants(restaurantsInput);
  }
}

@Resolver(() => Dish)
export class DishResolver {
  constructor(private readonly retaurantsService: RestaurantsService) {}

  @Mutation(() => CreateDishOutput)
  @Role('Owner')
  async createDish(
    @AuthUser() owner: User,
    @Args('input') createDishInput: CreateDishInput,
  ): Promise<CreateDishOutput> {
    return this.retaurantsService.createDish(owner, createDishInput);
  }

  @Mutation(() => EditDishOutput)
  @Role('Owner')
  async deleteDish(
    @AuthUser() owner: User,
    @Args('input') deleteDishInput: DeleteDishInput,
  ): Promise<EditDishOutput> {
    return this.retaurantsService.deleteDish(owner, deleteDishInput);
  }

  @Mutation(() => EditDishOutput)
  @Role('Owner')
  async editDish(
    @AuthUser() owner: User,
    @Args('input') editDishInput: EditDishInput,
  ): Promise<EditDishOutput> {
    return this.retaurantsService.editDish(owner, editDishInput);
  }
}

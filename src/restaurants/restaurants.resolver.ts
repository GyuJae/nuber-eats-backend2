import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { User } from 'src/users/entities/users.entity';
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
import { RestaurantsService } from './restaurants.service';

@Resolver()
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
}

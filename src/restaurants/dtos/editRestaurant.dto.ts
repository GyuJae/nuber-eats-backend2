import { Field, InputType, ObjectType, PartialType } from '@nestjs/graphql';
import { CommonOutput } from 'src/common/dtos/commonOutput.dto';
import { CreateRestaurantInput } from './createRestaurant.dto';

@InputType()
export class EditRestaurantInput extends PartialType(CreateRestaurantInput) {
  @Field(() => Number)
  restaurantId: number;
}

@ObjectType()
export class EditRestaurantOutput extends CommonOutput {}

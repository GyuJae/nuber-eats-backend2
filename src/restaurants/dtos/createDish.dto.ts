import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CommonOutput } from 'src/common/dtos/commonOutput.dto';
import { Dish } from '../entities/dish.entity';

@InputType()
export class CreateDishInput extends PickType(Dish, [
  'name',
  'description',
  'price',
  'options',
]) {
  @Field(() => Number)
  restaurantId: number;
}

@ObjectType()
export class CreateDishOutput extends CommonOutput {}

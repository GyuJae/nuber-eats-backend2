import {
  Field,
  InputType,
  ObjectType,
  OmitType,
  PartialType,
} from '@nestjs/graphql';
import { CommonOutput } from 'src/common/dtos/commonOutput.dto';
import { CreateDishInput } from './createDish.dto';

@InputType()
export class EditDishInput extends OmitType(PartialType(CreateDishInput), [
  'restaurantId',
]) {
  @Field(() => Number)
  dishId: number;
}

@ObjectType()
export class EditDishOutput extends CommonOutput {}

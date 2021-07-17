import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CommonOutput } from 'src/common/dtos/commonOutput.dto';

@InputType()
export class DeleteRestaurantInput {
  @Field(() => Number)
  restaurantId: number;
}

@ObjectType()
export class DeleteRestaurantOutput extends CommonOutput {}

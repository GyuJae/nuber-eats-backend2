import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CommonOutput } from 'src/common/dtos/commonOutput.dto';
import { OrderItemOption } from '../entities/orderItem.entity';

@InputType()
class CreateOrderItemInput {
  @Field(() => Int)
  dishId: number;

  @Field(() => [OrderItemOption], { nullable: true })
  options?: OrderItemOption[];
}

@InputType()
export class CreateOrderInput {
  @Field(() => Number)
  restaurantId: number;

  @Field(() => [CreateOrderItemInput])
  items: CreateOrderItemInput[];
}

@ObjectType()
export class CreateOrderOutput extends CommonOutput {
  @Field(() => Number, { nullable: true })
  orderId?: number;
}

import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CommonOutput } from 'src/common/dtos/commonOutput.dto';
import { Order } from '../entities/order.entity';

@InputType()
export class GetOrderInput {
  @Field(() => Int)
  orderId: number;
}

@ObjectType()
export class GetOrderOutput extends CommonOutput {
  @Field(() => Order, { nullable: true })
  order?: Order;
}

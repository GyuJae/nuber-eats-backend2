import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { CommonOutput } from 'src/common/dtos/commonOutput.dto';
import { Order } from '../entities/order.entity';

@InputType()
export class EditOrderInput extends PickType(Order, ['status']) {
  @Field(() => Int)
  id: number;
}

@ObjectType()
export class EditOrderOutput extends CommonOutput {}

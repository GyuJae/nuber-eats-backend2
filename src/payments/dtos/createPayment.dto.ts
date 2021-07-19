import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CommonOutput } from 'src/common/dtos/commonOutput.dto';
import { Payment } from '../entities/payment.entity';

@InputType()
export class CreatePaymentInput extends PickType(Payment, ['transactionId']) {
  @Field(() => Number)
  restaurantId: number;
}

@ObjectType()
export class CreatePaymentOutput extends CommonOutput {}

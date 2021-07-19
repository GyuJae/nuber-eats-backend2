import { Field, ObjectType } from '@nestjs/graphql';
import { CommonOutput } from 'src/common/dtos/commonOutput.dto';
import { Payment } from 'src/payments/entities/payment.entity';

@ObjectType()
export class GetPaymentsOutput extends CommonOutput {
  @Field(() => [Payment], { nullable: true })
  payments?: Payment[];
}

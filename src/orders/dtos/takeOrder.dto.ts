import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CommonOutput } from 'src/common/dtos/commonOutput.dto';

@InputType()
export class TakeOrderInput {
  @Field(() => Int)
  id: number;
}

@ObjectType()
export class TakeOrderOutput extends CommonOutput {}

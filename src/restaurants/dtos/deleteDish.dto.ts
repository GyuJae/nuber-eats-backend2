import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CommonOutput } from 'src/common/dtos/commonOutput.dto';

@InputType()
export class DeleteDishInput {
  @Field(() => Number)
  dishId: number;
}

@ObjectType()
export class DeleteDishOutput extends CommonOutput {}

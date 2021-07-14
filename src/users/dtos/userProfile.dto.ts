import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CommonOutput } from 'src/common/dtos/commonOutput.dto';
import { User } from '../entities/users.entity';

@InputType()
export class UserProfileInput {
  @Field(() => Number)
  userId: number;
}

@ObjectType()
export class UserProfileOutput extends CommonOutput {
  @Field(() => User, { nullable: true })
  user?: User;
}

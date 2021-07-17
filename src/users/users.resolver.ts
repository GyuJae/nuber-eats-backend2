import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/createAccount.dto';
import { EditProfileInput, EditProfileOutput } from './dtos/editProfile.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { UserProfileInput, UserProfileOutput } from './dtos/userProfile.dto';
import { VerifyEmailInput, VerifyEmailOutput } from './dtos/verify-email.dto';
import { User } from './entities/users.entity';
import { UsersService } from './users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Role('Any')
  @Query(() => User)
  async me(@AuthUser() authUser: User) {
    return authUser;
  }

  @Role('Any')
  @Query(() => UserProfileOutput)
  async userProfile(
    @Args('input') userProfileInput: UserProfileInput,
  ): Promise<UserProfileOutput> {
    return this.usersService.userProfile(userProfileInput);
  }

  @Mutation(() => CreateAccountOutput)
  async createAccount(
    @Args('input') input: CreateAccountInput,
  ): Promise<CreateAccountOutput> {
    return this.usersService.createAccount(input);
  }

  @Mutation(() => LoginOutput)
  async login(@Args('input') input: LoginInput): Promise<LoginOutput> {
    return this.usersService.login(input);
  }

  @Role('Any')
  @Mutation(() => EditProfileOutput)
  async editProfile(
    @AuthUser() authUser: User,
    @Args('input') editProfileInput: EditProfileInput,
  ): Promise<EditProfileOutput> {
    return this.usersService.editProfile(authUser.id, editProfileInput);
  }

  @Mutation(() => VerifyEmailOutput)
  async verifyEmail(
    @Args('input') verifyEmailInput: VerifyEmailInput,
  ): Promise<VerifyEmailOutput> {
    return this.usersService.verifyEmail(verifyEmailInput);
  }
}

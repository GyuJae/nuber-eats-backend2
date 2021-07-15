import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from 'src/jwt/jwt.service';
import { MailService } from 'src/mail/mail.service';
import { Repository } from 'typeorm';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/createAccount.dto';
import { EditProfileInput, EditProfileOutput } from './dtos/editProfile.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { UserProfileInput, UserProfileOutput } from './dtos/userProfile.dto';
import { VerifyEmailInput, VerifyEmailOutput } from './dtos/verify-email.dto';
import { User } from './entities/users.entity';
import { Verification } from './entities/verification.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Verification)
    private readonly verifications: Repository<Verification>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async createAccount({
    email,
    password,
    role,
  }: CreateAccountInput): Promise<CreateAccountOutput> {
    try {
      const exists = await this.users.findOne({ email });
      if (exists) {
        return {
          ok: false,
          error: 'User already exists',
        };
      }
      const user = await this.users.save(
        this.users.create({ email, password, role }),
      );

      const verification = await this.verifications.save(
        this.verifications.create({ user }),
      );
      this.mailService.sendVerificationEmail(email, verification.code);
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    try {
      const user = await this.users.findOne(
        { email },
        { select: ['id', 'password'] },
      );
      if (!user) {
        return {
          ok: false,
          error: "User don't exits",
        };
      }
      const passwordCorrect = await user.checkPassword(password);
      if (!passwordCorrect) {
        return {
          ok: false,
          error: 'Password uncorrect',
        };
      }
      const token = await this.jwtService.sign(user.id);
      return {
        ok: true,
        token,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  async findById(id: number): Promise<User> {
    return await this.users.findOne({ id });
  }

  async userProfile({ userId }: UserProfileInput): Promise<UserProfileOutput> {
    try {
      const user = await this.findById(userId);
      if (!user) {
        throw Error();
      }

      return {
        ok: true,
        user,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  async editProfile(
    userId: number,
    { email, password }: EditProfileInput,
  ): Promise<EditProfileOutput> {
    try {
      const user = await this.users.findOne({ id: userId });
      if (email) {
        user.email = email;
        user.verified = false;
        const verification = await this.verifications.save(
          this.verifications.create({ user }),
        );
        this.mailService.sendVerificationEmail(user.email, verification.code);
      }
      if (password) {
        user.password = password;
      }
      await this.users.save(user);
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  async verifyEmail({ code }: VerifyEmailInput): Promise<VerifyEmailOutput> {
    try {
      const verifications = await this.verifications.findOne(
        { code },
        { relations: ['user'] },
      );
      if (verifications) {
        verifications.user.verified = true;
        await this.users.save(verifications.user);
        await this.verifications.delete(verifications.id);
        return {
          ok: true,
        };
      }
      throw new Error();
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }
}

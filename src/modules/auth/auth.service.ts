/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from '../user/dtos/create-user.dto';
import { CustomException } from 'src/core/custom.exception';
import * as bcrypt from 'bcrypt';
import * as argon2 from 'argon2';
import { User } from '../user/schemas/user.schema';
import { ExpiryUnit, generateJwtExpiry } from 'src/utils/util';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.userService.findOneByEmail(email);
    const isPasswordValid = await this.verifyPassword(user, pass);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const { password, ...result } = user['_doc'];
    return result;
  }

  async verifyPassword(user: User, password: string): Promise<boolean> {
    let isVerified = await argon2.verify(user.password, password);
    if (isVerified) return isVerified;

    isVerified = await bcrypt.compare(password, user.password);
    return isVerified;
  }

  private async hashPassword(password: string) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }

  async registerUser(user: CreateUserDto) {
    try {
      const pass = await this.hashPassword(user.password);
      const newUser = await this.userService.create({
        ...user,
        password: pass,
      });
      return newUser;
    } catch (err) {
      console.log(err);
      throw new CustomException(
        'users',
        `failed to create user`,
        `${err.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async validateLoggedInUser(id: string) {
    return await this.userService.findOneById(id);
  }

  async loginUser(user: Record<string, any>) {
    try {
      const validUser = await this.userService.findOneByEmail(user.email);
      if (validUser) {
        const { password, ...rest } = validUser.toObject();
        const payload = { email: rest.email, sub: rest._id.toString() };

        const configExp: string =
          this.configService.get('JWT_EXPIRATION').replace('_', ' ') ||
          '1 minute';
        const configExpDate = configExp.split(' ');

        const expires = generateJwtExpiry(
          Number(configExpDate[0]),
          configExpDate[1] as ExpiryUnit,
        );
        const token = this.jwtService.sign(payload, {
          expiresIn: configExp,
          secret: this.configService.get<string>('JWT_SECRET'),
        });
        return { rest, expires, token };
      } else {
        return null;
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

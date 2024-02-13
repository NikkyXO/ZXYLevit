/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  Controller,
  UseGuards,
  Post,
  Body,
  //   Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CreateUserDto } from '../user/dtos/create-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login-dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.loginUser(loginDto);
  }

  @Post('register')
  async register(@Body() user: CreateUserDto) {
    return await this.authService.registerUser(user);
  }
}

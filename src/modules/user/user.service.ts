/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dtos/create-user.dto';
import { CustomException } from 'src/core/custom.exception';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async create(params: CreateUserDto) {
    try {
      const user = new this.userModel(params);
      user.save();
      const { password, ...result } = user.toObject();
      return result;
    } catch (err) {
      throw new CustomException(
        'users',
        `${err.errors[0]?.message}`,
        `${err.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll() {
    return await this.userModel.find().exec();
  }

  async findOneById(id: string) {
    // .findById(id).exec();
    return await this.userModel.findOne({ id });
  }

  async findOneByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    return await this.userModel.findByIdAndUpdate(id, updateUserDto, {
      new: true,
    });
  }

  async updateUserPayment(id: string, isPaid: boolean = true) {
    return await this.userModel.findByIdAndUpdate(
      id,
      { paid: isPaid },
      {
        new: true,
      },
    );
  }

  async deleteUser(id: string) {
    return await this.userModel.deleteOne({ _id: id });
  }
}

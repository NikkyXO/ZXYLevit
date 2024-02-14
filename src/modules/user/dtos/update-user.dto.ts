import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'The username of the user',
    type: String,
  })
  @IsString()
  @IsOptional()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  lastName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  address: string;

  @ApiProperty()
  @IsOptional()
  @IsEmail()
  email: string;
}

import { IsEmail, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class StripePaymentDto {
  @ApiProperty({
    description: 'The id of the user',
    type: String,
  })
  @IsUUID()
  userId: string;

  @ApiProperty()
  @IsString()
  subName: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  @IsEmail()
  email: string;
}

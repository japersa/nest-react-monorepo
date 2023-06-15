import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ForgottenPasswordDto {
  @ApiProperty()
  @IsEmail()
  readonly email: string;
}

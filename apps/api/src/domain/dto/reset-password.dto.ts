import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly token: string;
  @ApiProperty()
  @IsNotEmpty()
  readonly newPassword: string;
}

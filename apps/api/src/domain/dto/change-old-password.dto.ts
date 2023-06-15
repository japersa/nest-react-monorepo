import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ChangeOldPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly newPassword: string;
  @ApiProperty()
  @IsNotEmpty()
  readonly oldPassword: string;
}

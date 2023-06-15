import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly token: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Exclude } from 'class-transformer';

export class SessionDto {
  @ApiProperty()
  @IsNotEmpty()
  idUser: number;
  @ApiProperty()
  @IsNotEmpty()
  token: string;
  @ApiProperty()
  @IsNotEmpty()
  refreshToken: string;
  @ApiProperty({
    required: false,
  })
  @Exclude()
  createdAt: Date;
  @ApiProperty({
    required: false,
  })
  @Exclude()
  updatedAt: Date;
}

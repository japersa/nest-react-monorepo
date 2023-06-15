import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class OauthDto {
  @ApiProperty({
    required: false,
  })
  readonly grant_type: string;
  @ApiProperty({
    required: false,
  })
  readonly client_id: string;
  @ApiProperty({
    required: false,
  })
  readonly client_secret: string;
  @ApiProperty({
    required: false,
  })
  readonly username: string;
  @ApiProperty()
  @IsNotEmpty()
  readonly password: string;
}

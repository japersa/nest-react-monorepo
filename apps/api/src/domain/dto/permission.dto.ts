import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class PermissionDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly name: string;
  @ApiProperty({
    required: false,
  })
  readonly description: string;
}

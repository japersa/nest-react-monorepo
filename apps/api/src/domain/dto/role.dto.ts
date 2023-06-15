import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RoleDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly name: string;
  @ApiProperty({
    required: false,
  })
  readonly description: string;
  @ApiProperty({
    required: false,
  })
  permissions: Array<any>;
}

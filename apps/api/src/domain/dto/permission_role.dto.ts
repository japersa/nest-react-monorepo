import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class PermissionRoleDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly idPermission: number;
  @ApiProperty()
  @IsNotEmpty()
  readonly idRole: number;
}

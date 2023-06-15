import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, ValidateIf } from 'class-validator';

export class UserDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly firstName: string;
  @ApiProperty({
    required: false,
  })
  readonly secondName: string;
  @ApiProperty()
  @IsNotEmpty()
  readonly lastName: string;
  @ApiProperty({
    required: false,
  })
  readonly secondLastName: string;
  @ApiProperty()
  @IsNotEmpty()
  readonly documentNumber: string;
  @ApiProperty({
    required: true,
  })
  @IsEmail()
  readonly email: string;
  @ApiProperty({
    required: false,
  })
  readonly phone: string;
  @ApiProperty()
  @IsNotEmpty()
  readonly password: string;
  @ApiProperty()
  @IsNotEmpty()
  readonly idRole: number;
  @ApiProperty({
    required: false,
  })
  readonly userName: string;
}

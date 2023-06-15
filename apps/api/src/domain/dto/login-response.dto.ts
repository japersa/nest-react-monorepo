import { ApiResponseProperty } from '@nestjs/swagger';
import { PayloadDto } from './payload.dto';
import { UserDto } from './user.dto';

export class LoginResponseDto {
  @ApiResponseProperty()
  readonly user: UserDto;
  @ApiResponseProperty()
  readonly payload: PayloadDto;
}

import { ApiResponseProperty } from '@nestjs/swagger';

export class PayloadDto {
  @ApiResponseProperty()
  readonly type: string;
  @ApiResponseProperty()
  readonly accessToken: string;
  @ApiResponseProperty()
  readonly refreshToken: string;
}

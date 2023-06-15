import { ApiProperty } from '@nestjs/swagger';

export class ValidateCodeDto {
  @ApiProperty()
  readonly code: string;
}

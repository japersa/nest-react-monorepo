import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from 'src/domain/services/auth.service';
import { ResetPasswordDto } from 'src/domain/dto/reset-password.dto';
import { LoginDto } from 'src/domain/dto/login.dto';
import { ValidateCodeDto } from 'src/domain/dto/validate-code.dto';
import { ForgottenPasswordDto } from 'src/domain/dto/forgottenpassword.dto';
import { RefreshTokenDto } from '../../domain/dto/refresh-token.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginResponseDto } from 'src/domain/dto/login-response.dto';
import { UserDto } from 'src/domain/dto/user.dto';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { PaginateOptions } from 'src/domain/services/crud.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   *
   * @returns {LoginResponseDto{}} Returns user authentication variables
   * @param res
   * @param loginDto
   */
  @ApiOperation({ summary: 'User authentication' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns user authentication variables',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid username or password',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @Post()
  public async validateLogin(@Response() res, @Body() loginDto: LoginDto) {
    const user = await this.authService.validateLogin(loginDto);
    return res.status(HttpStatus.OK).json(user);
  }

  /**
   *
   * @returns {{}} ending successful email forgot password
   * @param res
   * @param forgottenPasswordDto
   */
  @ApiOperation({ summary: 'Forgot Password' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Sending successful email forgot password',
    type: ForgottenPasswordDto,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'User not registered',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @Post('/forgot-password')
  public async forgotPassword(
    @Response() res,
    @Body() forgottenPasswordDto: ForgottenPasswordDto,
  ) {
    const user = await this.authService.forgotPassword(forgottenPasswordDto);
    return res.status(HttpStatus.OK).json(user);
  }

  /**
   *
   * @returns {{}} Returns forgotten password
   * @param res
   * @param validateCode
   */
  @ApiOperation({ summary: 'Validate Forgot Password' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns forgotten password',
    type: ForgottenPasswordDto,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Token not exist',
  })
  @Post('/validate-code')
  public async validateCodeForgotPassword(
    @Response() res,
    @Body() validateCode: ValidateCodeDto,
  ) {
    const user = await this.authService.validateCodeForgotPassword(
      validateCode,
    );
    return res.status(HttpStatus.OK).json(user);
  }

  /**
   *
   * @returns {{}} Returns reset password
   * @param res
   * @param resetPasswordDto
   */
  @ApiOperation({ summary: 'Reset Password' })
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'Returns reset password and Sending successful email reset password',
    type: ResetPasswordDto,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'User not registered',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Token not exist',
  })
  @Post('/reset-password')
  public async resetPassword(
    @Response() res,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    const user = await this.authService.resetPassword(resetPasswordDto);
    return res.status(HttpStatus.OK).json(user);
  }

  /**
   *
   * @returns {{}} Returns user by change password
   * @param param
   * @param res
   * @param body
   * @param req
   */
  @ApiOperation({ summary: 'Change Password' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns user by change password',
    type: UserDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'User not registered',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @UseGuards(JwtAuthGuard)
  @Patch('/change-password/:id')
  public async changePassword(
    @Param() param,
    @Response() res,
    @Body() body,
    @Request() req,
  ) {
    const user = await this.authService.changePassword(param.id, body);
    if (req.user.idUser == Number(param.id)) {
      return res.status(HttpStatus.OK).json(user);
    } else {
      return res
        .status(HttpStatus.OK)
        .json({ user: user, message: 'Users are equals' });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('/change-password')
  public async changePasswordFromOldPassword(
    @Param() param,
    @Response() res,
    @Body() body,
    @Request() req,
  ) {
    const user = await this.authService.changeOldPassword(
      req.user.idUser,
      body,
    );
    return res.status(HttpStatus.OK).json(user);
  }

  /**
   *
   * @returns {{}} Returns user authentication variables
   * @param res
   * @param refreshTokenDto
   */
  @ApiOperation({ summary: 'Refresh Token' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns user authentication variables',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Refresh token expired or Refresh token malformed',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @Post('/refresh')
  public async refreshToken(
    @Response() res,
    @Body() refreshTokenDto: RefreshTokenDto,
  ) {
    const user = await this.authService.refreshToken(refreshTokenDto);
    return res.status(HttpStatus.OK).json(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/validate-token')
  public async validateToken(
    @Response() res,
    @Query() options: PaginateOptions,
    @Request() req,
  ) {
    return res.status(HttpStatus.OK).json(req.user);
  }
}

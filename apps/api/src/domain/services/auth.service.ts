import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { MailService } from './mail.service';
import { SendMailDto } from '../dto/send-mail.dto';
import { ForgottenPassword } from '../entities/forgottenpassword.entity';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { LoginDto } from '../dto/login.dto';
import { JWTService } from './jwt.service';
import { ValidateCodeDto } from '../dto/validate-code.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { ForgottenPasswordDto } from '../dto/forgottenpassword.dto';
import { ChangeOldPasswordDto } from '../dto/change-old-password.dto';
import { Raw } from 'typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    @Inject('ForgottenPasswordRepository')
    private readonly forgottenPasswordRepository: typeof ForgottenPassword,
    @Inject('UserRepository')
    private readonly userRepository: typeof User,
    private readonly mailService: MailService,
    private readonly jwtService: JWTService,
  ) {}

  async validateLogin(loginDto: LoginDto) {
    const checkUser = await this.userRepository.findOne<User>({
      relations: [
        'role',
        'role.permissionsRoles',
        'role.permissionsRoles.permission',
      ],
      where: [
        {
          email: Raw(
            (alias) => `LOWER(${alias}) = '${loginDto.username.toLowerCase()}'`,
          ),
        },
        {
          userName: Raw(
            (alias) => `LOWER(${alias}) = '${loginDto.username.toLowerCase()}'`,
          ),
        },
      ],
    });

    if (checkUser) {
      const isValidPass = await bcrypt.compare(
        loginDto.password,
        checkUser.password,
      );

      if (isValidPass) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { ['password']: remove, ...user } = checkUser;
        const payload = await this.jwtService.createAccessTokenAndRefreshToken(
          user,
        );

        return {
          user,
          payload,
        };
      } else {
        throw new HttpException(
          'Invalid username or password',
          HttpStatus.UNAUTHORIZED,
        );
      }
    } else {
      throw new HttpException(
        'Invalid username or password',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async forgotPassword(
    createForgottenPasswordDto: ForgottenPasswordDto,
  ): Promise<ForgottenPassword> {
    const checkUser = await this.userRepository.findOne<User>({
      where: { email: createForgottenPasswordDto.email },
    });

    if (checkUser) {
      const checkForgottenPassword =
        await this.forgottenPasswordRepository.findOne<ForgottenPassword>({
          where: { email: createForgottenPasswordDto.email },
        });

      if (checkForgottenPassword) {
        await this.sendMailForgotPassword(
          checkUser.firstName,
          checkUser.lastName,
          createForgottenPasswordDto.email,
          checkForgottenPassword.newPasswordToken,
        );

        return checkForgottenPassword;
      } else {
        const forgottenPassword = new ForgottenPassword();
        forgottenPassword.idUser = checkUser.idUser;
        forgottenPassword.email = createForgottenPasswordDto.email;
        forgottenPassword.newPasswordToken = await this.createResetToken();

        await this.sendMailForgotPassword(
          checkUser.firstName,
          checkUser.lastName,
          createForgottenPasswordDto.email,
          forgottenPassword.newPasswordToken,
        );

        return forgottenPassword.save();
      }
    } else {
      throw new HttpException('User not registered', HttpStatus.FORBIDDEN);
    }
  }

  async createResetToken() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    return crypto.createHash('sha256').update(resetToken).digest('hex');
  }

  async sendMailForgotPassword(firstName, lastName, email, newPasswordToken) {
    await this.mailService.sendMail({
      to: email,
      subject: 'Password recovery',
      html: `
        Dear ${firstName} ${lastName} <br> <br>
        Your account password was recently requested to change. <br> <br>
        If you requested this password change, click the following link to set a new password: <br>
        <a href="http://${process.env.APP_HOST}/recover-password/${newPasswordToken}">
          Click here to change your password
        </a>
        `,
    });
  }

  async validateCodeForgotPassword(
    validateCode: ValidateCodeDto,
  ): Promise<ForgottenPassword> {
    const checkForgottenPassword =
      await this.forgottenPasswordRepository.findOne<ForgottenPassword>({
        where: { newPasswordToken: validateCode.code },
      });

    if (checkForgottenPassword) {
      return checkForgottenPassword;
    } else {
      throw new HttpException(
        'Token not exist',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<User> {
    const checkForgottenPassword =
      await this.forgottenPasswordRepository.findOne<ForgottenPassword>({
        where: { newPasswordToken: resetPasswordDto.token },
      });

    if (checkForgottenPassword) {
      const checkUser = await this.userRepository.findOne<User>({
        where: { idUser: checkForgottenPassword.idUser },
      });

      if (checkUser) {
        checkUser.password = await bcrypt.hash(
          resetPasswordDto.newPassword,
          10,
        );

        const email: SendMailDto = {
          to: checkForgottenPassword.email,
          subject: 'Successful password change',
          html: `
          Dear $ {checkUser.firstName} $ {checkUser.lastName} <br> <br>Your password change was successful<br><br> 
          `,
        };

        await this.mailService.sendMail(email);

        await this.forgottenPasswordRepository.delete({
          email: checkUser.email,
        });

        return checkUser.save();
      } else {
        throw new HttpException('User not registered', HttpStatus.FORBIDDEN);
      }
    } else {
      throw new HttpException(
        'Token not exist',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async changePassword(
    ID: number,
    changePassword: ChangePasswordDto,
  ): Promise<User> {
    const checkUser = await this.userRepository.findOne<User>({
      where: { idUser: Number(ID) },
    });

    if (checkUser) {
      checkUser.password = await bcrypt.hash(changePassword.newPassword, 10);
      return checkUser.save();
    } else {
      throw new HttpException('User not registered', HttpStatus.FORBIDDEN);
    }
  }

  async changeOldPassword(
    ID: number,
    changePassword: ChangeOldPasswordDto,
  ): Promise<User> {
    const checkUser = await this.userRepository.findOne<User>({
      where: { idUser: ID },
    });

    if (checkUser) {
      const isValidPass = await bcrypt.compare(
        changePassword.oldPassword,
        checkUser.password,
      );

      if (isValidPass) {
        checkUser.password = await bcrypt.hash(changePassword.newPassword, 10);
        return checkUser.save();
      } else {
        throw new HttpException(
          'User password do not match',
          HttpStatus.BAD_REQUEST,
        );
      }
    } else {
      throw new HttpException('User not registered', HttpStatus.FORBIDDEN);
    }
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    return this.jwtService.createAccessTokenFromRefreshToken(
      refreshTokenDto.token,
    );
  }
}

import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/domain/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: typeof User,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRETORKEY,
    });
  }

  async validate(payload: any) {
    const checkUser = await this.userRepository.findOne({
      relations: [
        'role',
        'role.permissionsRoles',
        'role.permissionsRoles.permission',
      ],
      where: {
        idUser: payload.subject,
      },
    });

    if (!checkUser) {
      throw new UnauthorizedException();
    }

    const { ['password']: remove, ...user } = checkUser;

    return user;
  }
}

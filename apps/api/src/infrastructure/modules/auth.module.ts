import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { AuthController } from '../../app/controllers/auth.controller';
import { AuthService } from '../../domain/services/auth.service';
import { ForgottenPasswordProvider } from '../providers/forgottenpassword.provider';
import { LoggerMiddleware } from '../../app/middlewares/logger.middleware';
import { MailModule } from './mail.module';
import { MailService } from 'src/domain/services/mail.service';
import { UserProvider } from '../providers/user.provider';
import { JWTService } from 'src/domain/services/jwt.service';
import { JwtStrategy } from 'src/app/strategies/jwt.strategy';
import { RefreshTokenProvider } from '../providers/refreshToken.provider';
import { SessionService } from 'src/domain/services/session.service';
import { SessionProvider } from '../providers/session.provider';

@Module({
  imports: [DatabaseModule, MailModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    MailService,
    JWTService,
    JwtStrategy,
    SessionService,
    ...SessionProvider,
    ...ForgottenPasswordProvider,
    ...UserProvider,
    ...RefreshTokenProvider,
  ],
  exports: [...ForgottenPasswordProvider],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('auth');
  }
}

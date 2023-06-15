import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { UserController } from '../../app/controllers/user.controller';
import { UserProvider } from '../providers/user.provider';
import { UserService } from '../../domain/services/user.service';
import { LoggerMiddleware } from '../../app/middlewares/logger.middleware';
import { MailModule } from './mail.module';
import { MailService } from 'src/domain/services/mail.service';
import { PermissionRoleService } from 'src/domain/services/permission_role.service';
import { PermissionRoleProvider } from '../providers/permission_role.provider';

@Module({
  imports: [DatabaseModule, MailModule],
  controllers: [UserController],
  providers: [
    UserService,
    MailService,
    PermissionRoleService,
    ...PermissionRoleProvider,
    ...UserProvider,
  ],
  exports: [...UserProvider],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('users');
  }
}

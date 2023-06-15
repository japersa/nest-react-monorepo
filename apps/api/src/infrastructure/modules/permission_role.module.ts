import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { LoggerMiddleware } from '../../app/middlewares/logger.middleware';
import { PermissionRoleController } from '../../app/controllers/permission_role.controller';
import { PermissionRoleService } from '../../domain/services/permission_role.service';
import { PermissionRoleProvider } from '../providers/permission_role.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [PermissionRoleController],
  providers: [PermissionRoleService, ...PermissionRoleProvider],
  exports: [...PermissionRoleProvider],
})
export class PermissionRoleModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('permissionsRoles');
  }
}

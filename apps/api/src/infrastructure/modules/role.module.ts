import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { LoggerMiddleware } from '../../app/middlewares/logger.middleware';
import { RoleController } from '../../app/controllers/role.controller';
import { RoleService } from '../../domain/services/role.service';
import { RoleProvider } from '../providers/role.provider';
import { PermissionRoleService } from 'src/domain/services/permission_role.service';
import { PermissionRoleModule } from './permission_role.module';

@Module({
  imports: [DatabaseModule, PermissionRoleModule],
  controllers: [RoleController],
  providers: [RoleService, PermissionRoleService, ...RoleProvider],
  exports: [...RoleProvider],
})
export class RoleModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('roles');
  }
}

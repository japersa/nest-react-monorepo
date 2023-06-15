import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { LoggerMiddleware } from '../../app/middlewares/logger.middleware';
import { PermissionController } from '../../app/controllers/permission.controller';
import { PermissionService } from '../../domain/services/permission.service';
import { PermissionProvider } from '../providers/permission.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [PermissionController],
  providers: [PermissionService, ...PermissionProvider],
  exports: [...PermissionProvider],
})
export class PermissionModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('permissions');
  }
}

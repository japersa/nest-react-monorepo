import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import configuration from '../config/configuration';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './infrastructure/modules/user.module';
import { AuthModule } from './infrastructure/modules/auth.module';
import { RoleModule } from './infrastructure/modules/role.module';
import { PermissionModule } from './infrastructure/modules/permission.module';
import { PermissionRoleModule } from './infrastructure/modules/permission_role.module';
import { SessionModule } from './infrastructure/modules/session.module';
import { TasksService } from './schedule/TasksService';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    AuthModule,
    UserModule,
    RoleModule,
    PermissionModule,
    PermissionRoleModule,
    SessionModule,
  ],
  providers: [AppService, TasksService],
})
export class AppModule {}

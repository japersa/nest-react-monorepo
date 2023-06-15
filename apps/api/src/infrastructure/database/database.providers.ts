import { ConfigService } from '@nestjs/config';
import { createConnection } from 'typeorm';
import { User } from 'src/domain/entities/user.entity';
import { ForgottenPassword } from 'src/domain/entities/forgottenpassword.entity';
import { RefreshToken } from 'src/domain/entities/refreshToken.entity';
import { Role } from 'src/domain/entities/role.entity';
import { Permission } from 'src/domain/entities/permission.entity';
import { PermissionRole } from 'src/domain/entities/permission_role.entity';
import { Session } from 'src/domain/entities/session.entity';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      return await createConnection({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.database'),
        entities: [
          User,
          ForgottenPassword,
          RefreshToken,
          Role,
          Permission,
          PermissionRole,
          Session,
        ],
        synchronize: true,
        logging: true,
      });
    },
  },
];

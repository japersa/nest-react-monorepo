import { Connection } from 'typeorm';
import { Permission } from '../../domain/entities/permission.entity';

export const PermissionProvider = [
  {
    provide: 'PermissionRepository',
    useFactory: (connection: Connection) =>
      connection.getRepository(Permission),
    inject: ['DATABASE_CONNECTION'],
  },
];

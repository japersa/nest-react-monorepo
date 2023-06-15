import { Connection } from 'typeorm';
import { PermissionRole } from '../../domain/entities/permission_role.entity';

export const PermissionRoleProvider = [
  {
    provide: 'PermissionRoleRepository',
    useFactory: (connection: Connection) =>
      connection.getRepository(PermissionRole),
    inject: ['DATABASE_CONNECTION'],
  },
];

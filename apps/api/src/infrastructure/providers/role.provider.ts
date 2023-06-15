import { Connection } from 'typeorm';
import { Role } from '../../domain/entities/role.entity';

export const RoleProvider = [
  {
    provide: 'RoleRepository',
    useFactory: (connection: Connection) => connection.getRepository(Role),
    inject: ['DATABASE_CONNECTION'],
  },
];

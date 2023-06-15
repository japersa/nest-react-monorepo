import { Connection } from 'typeorm';
import { User } from '../../domain/entities/user.entity';

export const UserProvider = [
  {
    provide: 'UserRepository',
    useFactory: (connection: Connection) => connection.getRepository(User),
    inject: ['DATABASE_CONNECTION'],
  },
];

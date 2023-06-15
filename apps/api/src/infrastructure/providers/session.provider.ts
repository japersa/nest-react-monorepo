import { Connection } from 'typeorm';
import { Session } from '../../domain/entities/session.entity';

export const SessionProvider = [
  {
    provide: 'SessionRepository',
    useFactory: (connection: Connection) => connection.getRepository(Session),
    inject: ['DATABASE_CONNECTION'],
  },
];

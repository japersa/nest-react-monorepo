import { Connection } from 'typeorm';
import { ForgottenPassword } from '../../domain/entities/forgottenpassword.entity';

export const ForgottenPasswordProvider = [
  {
    provide: 'ForgottenPasswordRepository',
    useFactory: (connection: Connection) =>
      connection.getRepository(ForgottenPassword),
    inject: ['DATABASE_CONNECTION'],
  },
];

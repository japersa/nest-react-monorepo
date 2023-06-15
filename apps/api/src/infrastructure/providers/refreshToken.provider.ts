import { Connection } from 'typeorm';
import { RefreshToken } from '../../domain/entities/refreshToken.entity';

export const RefreshTokenProvider = [
  {
    provide: 'RefreshTokenRepository',
    useFactory: (connection: Connection) =>
      connection.getRepository(RefreshToken),
    inject: ['DATABASE_CONNECTION'],
  },
];

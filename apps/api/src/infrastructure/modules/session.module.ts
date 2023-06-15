import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { LoggerMiddleware } from '../../app/middlewares/logger.middleware';
import { SessionController } from '../../app/controllers/session.controller';
import { SessionService } from '../../domain/services/session.service';
import { SessionProvider } from '../providers/session.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [SessionController],
  providers: [SessionService, ...SessionProvider],
  exports: [...SessionProvider],
})
export class SessionModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('sessions');
  }
}

import { Module } from '@nestjs/common';
import { MailService } from 'src/domain/services/mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('mail.mail_host'),

          port: configService.get<number>('mail.mail_port'),
          secure: false,
          auth: {
            user: configService.get<string>('mail.mail_username'),
            pass: configService.get<string>('mail.mail_password'),
          },
          pool: true,
          maxConnections: 1,
          rateDelta: 20000,
          rateLimit: 5,
        },
        defaults: {
          from: configService.get<string>('mail.mail_from'),
        },
        template: {
          dir: process.cwd() + '/templates/hbs/',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
})
export class MailModule {}

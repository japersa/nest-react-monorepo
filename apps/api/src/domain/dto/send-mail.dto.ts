export class SendMailDto {
  readonly to: string;
  readonly subject: string;
  readonly html?: string;
  readonly template?: string;
  readonly context?: any;
}

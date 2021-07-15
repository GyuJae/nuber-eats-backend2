import { Inject, Injectable } from '@nestjs/common';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { MailModuleOptions } from './main.interfaces';
import * as mailgun from 'mailgun-js';

@Injectable()
export class MailService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions,
  ) {}

  private async sendEmail(subject: string, text: string) {
    const mg = mailgun({
      apiKey: this.options.apiKey,
      domain: this.options.domain,
    });
    const data = {
      from: `Nuber Eats <${this.options.fromEmail}>`,
      to: `wjdrbwo1206@naver.com`,
      subject,
      text,
    };
    try {
      mg.messages().send(data, (error, body) => {
        console.log(error, body);
      });
    } catch (error) {
      console.log(error);
    }
  }

  sendVerificationEmail(email: string, code: string) {
    this.sendEmail(`Welecome, ${email}`, `code: ${code}`);
  }
}

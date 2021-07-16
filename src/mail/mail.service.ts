import { Inject, Injectable } from '@nestjs/common';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { MailModuleOptions } from './main.interfaces';
import * as mailgun from 'mailgun-js';

@Injectable()
export class MailService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions,
  ) {}

  async sendEmail(subject: string, text: string): Promise<boolean> {
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
      mg.messages().send(data);
      return true;
    } catch (error) {
      return false;
    }
  }

  sendVerificationEmail(email: string, code: string) {
    this.sendEmail(`Welecome, ${email}`, `code: ${code}`);
  }
}

import { Test } from '@nestjs/testing';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { MailService } from './mail.service';
import * as mailgun from 'mailgun-js';

jest.mock('mailgun-js', () => {
  const mMailgun = {
    messages: jest.fn().mockReturnThis(),
    send: jest.fn(),
  };
  return jest.fn(() => mMailgun);
});

const TEST_APIKEY = 'test_apikey';
const TEST_DOMAIN = 'test_domain';
const TEST_FROMEMAIL = 'test_fromemail@test.com';

describe('MailService', () => {
  let service: MailService;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: CONFIG_OPTIONS,
          useValue: {
            apiKey: TEST_APIKEY,
            domain: TEST_DOMAIN,
            fromEmail: TEST_FROMEMAIL,
          },
        },
      ],
    }).compile();
    service = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendVerificationEmail', () => {
    it('should be call sendEmail', () => {
      const sendVerificationEmailArgs = {
        email: 'tset_email',
        code: 'test_code',
      };
      jest.spyOn(service, 'sendEmail').mockImplementation(async () => true);
      service.sendVerificationEmail(
        sendVerificationEmailArgs.email,
        sendVerificationEmailArgs.code,
      );

      expect(service.sendEmail).toHaveBeenCalledTimes(1);
      expect(service.sendEmail).toHaveBeenCalledWith(
        `Welecome, ${sendVerificationEmailArgs.email}`,
        `code: ${sendVerificationEmailArgs.code}`,
      );
    });
  });

  describe('sendEmail', () => {
    const sendEmailArgs = {
      subject: 'test_subject',
      text: 'test_text',
    };
    it('send email', async () => {
      const ok = await service.sendEmail(
        sendEmailArgs.subject,
        sendEmailArgs.text,
      );

      expect(mailgun).toHaveBeenCalledTimes(1);
      expect(mailgun).toHaveBeenLastCalledWith({
        apiKey: TEST_APIKEY,
        domain: TEST_DOMAIN,
      });

      const mg = mailgun({
        apiKey: TEST_APIKEY,
        domain: TEST_DOMAIN,
      });

      const data = {
        from: `Nuber Eats <${TEST_FROMEMAIL}>`,
        to: `wjdrbwo1206@naver.com`,
        subject: sendEmailArgs.subject,
        text: sendEmailArgs.text,
      };

      expect(mg.messages().send).toHaveBeenCalledTimes(1);
      expect(mg.messages().send).toHaveBeenCalledWith(data);

      expect(ok).toEqual(true);
    });
    it('fails on error', async () => {
      const mg = mailgun({
        apiKey: TEST_APIKEY,
        domain: TEST_DOMAIN,
      });
      jest.spyOn(mg, 'messages').mockImplementation(() => {
        throw new Error();
      });
      const ok = await service.sendEmail(
        sendEmailArgs.subject,
        sendEmailArgs.text,
      );
      expect(ok).toEqual(false);
    });
  });
});

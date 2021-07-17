import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getConnection, Repository } from 'typeorm';
import { User } from 'src/users/entities/users.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Verification } from 'src/users/entities/verification.entity';

const GRAPHQL_ENDPOINT = '/graphql';

const testUser = {
  email: 'test@test.com',
  password: 'test',
};

const testRestaurant = {
  name: 'test_name',
  address: 'test_address',
  coverImg: 'test_coverImg',
  categoryName: 'test_categoryName',
};

jest.mock('mailgun-js', () => {
  const mMailgun = {
    messages: jest.fn().mockReturnThis(),
    send: jest.fn(),
  };
  return jest.fn(() => mMailgun);
});

describe('app (e2e)', () => {
  let app: INestApplication;
  let usersRepository: Repository<User>;
  let verificationsRepository: Repository<Verification>;
  let jwtToken: string;

  const baseTest = () => request(app.getHttpServer()).post(GRAPHQL_ENDPOINT);
  const publicTest = (query: string) => baseTest().send({ query });
  const privateTest = (query: string) =>
    baseTest().set('X-JWT', jwtToken).send({ query });

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
    verificationsRepository = module.get<Repository<Verification>>(
      getRepositoryToken(Verification),
    );
    await app.init();
  });

  afterAll(async () => {
    await getConnection().dropDatabase();
    app.close();
  });

  describe('createAccount', () => {
    it('should be create account', () => {
      return publicTest(
        `mutation {
          createAccount(input:{
            email:"${testUser.email}",
            password:"${testUser.password}",
            role:Owner
          }) {
            ok
            error
          }
        }`,
      )
        .expect(200)
        .expect((res) => {
          expect(res.body.data.createAccount.ok).toBe(true);
          expect(res.body.data.createAccount.error).toBe(null);
        });
    });
    it('should fail if account already exists', () => {
      return publicTest(
        `mutation {
          createAccount(input:{
            email:"${testUser.email}",
            password:"${testUser.password}",
            role:Owner
          }) {
            ok
            error
          }
        }`,
      )
        .expect(200)
        .expect((res) => {
          expect(res.body.data.createAccount.ok).toBe(false);
          expect(res.body.data.createAccount.error).toEqual(expect.any(String));
        });
    });
  });

  describe('login', () => {
    it('should login with correct credentials', () => {
      return publicTest(`
          mutation {
          login(input:{
            email:"${testUser.email}",
            password:"${testUser.password}"
          }){
            ok
            error
            token
          }
        }`)
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: { login },
            },
          } = res;
          expect(login.ok).toBe(true);
          expect(login.error).toBe(null);
          expect(login.token).toEqual(expect.any(String));
          jwtToken = login.token;
        });
    });
    it('should not able login with wrong credentials', () => {
      return publicTest(`mutation {
          login(input:{
            email:"${testUser.email}+wrong",
            password:"${testUser.password}+wrong"
          }){
            ok
            error
            token
          }
        }`)
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: { login },
            },
          } = res;
          expect(login.ok).toBe(false);
          expect(login.error).toEqual(expect.any(String));
          expect(login.token).toBe(null);
        });
    });
  });

  describe('userProfile', () => {
    let userId: number;
    beforeAll(async () => {
      const [user] = await usersRepository.find();
      userId = user.id;
    });

    it('should see a one user profile', () => {
      return privateTest(`
          {
            userProfile(input:{userId:${userId}}){
              ok
              error
              user{
                email
              }
            }
          }
        `)
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                userProfile: {
                  ok,
                  error,
                  user: { email },
                },
              },
            },
          } = res;
          expect(ok).toBe(true);
          expect(error).toBe(null);
          expect(email).toBe(testUser.email);
        });
    });
    it('should not find user profile', () => {
      return privateTest(`
          {
            userProfile(input:{userId:999}){
              ok
              error
              user{
                email
              }
            }
          }
        `)
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                userProfile: { ok, error },
              },
            },
          } = res;
          expect(ok).toBe(false);
          expect(error).toEqual(expect.any(String));
        });
    });
  });
  describe('me', () => {
    it('should not allow logged out user', () => {
      return publicTest(`
        {
          me {
            email
          }
        }
        `)
        .expect(200)
        .expect((res) => {
          const {
            body: { errors },
          } = res;
          const [error] = errors;
          expect(error.message).toBe('Forbidden resource');
        });
    });
    it('should find my profile', () => {
      return privateTest(`
        {
          me {
            email
          }
        }
        `)
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                me: { email },
              },
            },
          } = res;
          expect(email).toBe(testUser.email);
        });
    });
  });
  describe('editProfile', () => {
    const NEW_EMAIL = 'newemail@test.com';
    it('should change email', () => {
      return privateTest(`
          mutation {
            editProfile(input:{
              email:"${NEW_EMAIL}"
            }){
              ok
              error
            }
          }
          `)
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                editProfile: { ok, error },
              },
            },
          } = res;
          expect(ok).toBe(true);
          expect(error).toBe(null);
        });
    });
    it('should have new email', () => {
      return privateTest(`
          {
            me {
              email
            }
          }
        `)
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                me: { email },
              },
            },
          } = res;
          expect(email).toBe(NEW_EMAIL);
        });
    });
  });
  describe('verifyEmail', () => {
    let verificationCode: string;
    beforeAll(async () => {
      const [verification] = await verificationsRepository.find();
      verificationCode = verification.code;
    });
    it('should verify email', () => {
      return publicTest(
        `
          mutation {
            verifyEmail(input:{
              code:"${verificationCode}"
            }){
              ok
              error
            }
          }
        `,
      )
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                verifyEmail: { ok, error },
              },
            },
          } = res;
          expect(ok).toBe(true);
          expect(error).toBe(null);
        });
    });
    it('should fail on verification code not found', () => {
      return publicTest(`
          mutation {
            verifyEmail(input:{
              code:"xxxxx"
            }){
              ok
              error
            }
          }
        `)
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                verifyEmail: { ok, error },
              },
            },
          } = res;
          expect(ok).toBe(false);
          expect(error).toBe('Verification not found.');
        });
    });
  });

  describe('createRestaurant', () => {
    it('should create restaurant', () => {
      return privateTest(
        `
        mutation {
          createRestaurant(input:{
            name:"${testRestaurant.name}",
            address:"${testRestaurant.address}",
            coverImg: "${testRestaurant.coverImg}",
            categoryName: "${testRestaurant.categoryName}"
          }) {
            ok
            error
          }
        }
        `,
      )
        .expect(200)
        .expect((res) => {
          expect(res.body.data.createRestaurant).toStrictEqual({
            ok: true,
            error: null,
          });
        });
    });
    it('not auth create restaurant', () => {
      return publicTest(
        `
        mutation {
          createRestaurant(input:{
            name:"${testRestaurant.name}",
            address:"${testRestaurant.address}",
            coverImg: "${testRestaurant.coverImg}",
            categoryName: "${testRestaurant.categoryName}"
          }) {
            ok
            error
          }
        }
        `,
      )
        .expect(200)
        .expect((res) => {
          const {
            body: { errors },
          } = res;
          const [error] = errors;
          expect(error.message).toBe('Forbidden resource');
        });
    });
  });

  describe('editRestaurant', () => {
    it('should edit restaurant', () => {
      return privateTest(
        `
        mutation {
          editRestaurant(input: {
            restaurantId: 1,
            name: "new_edit_test_name"
          }) {
            ok
            error
          }
        }
        `,
      )
        .expect(200)
        .expect((res) => {
          expect(res.body.data.editRestaurant).toStrictEqual({
            ok: true,
            error: null,
          });
        });
    });
  });

  describe('deleteRestaurant', () => {
    it('should delete restaurant', () => {
      return privateTest(
        `
        mutation {
          deleteRestaurant(input:{
            restaurantId:1
          }){
            ok
            error
          }
        }
        `,
      )
        .expect(200)
        .expect((res) => {
          expect(res.body.data.deleteRestaurant).toStrictEqual({
            ok: true,
            error: null,
          });
        });
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/components/users/entities/user.entity';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let usersRepository: Repository<User>;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    usersRepository = moduleFixture.get<Repository<User>>(
      getRepositoryToken(User),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    const testUser = new User();
    testUser.email = 'test@email.com';
    testUser.password = 'test-password';
    await usersRepository.save(testUser);
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@email.com', password: 'test-password' });
    authToken = response.body.access_token;
  });

  afterEach(async () => {
    await usersRepository.delete({});
  });

  describe('/users (POST) register user', () => {
    it('register successfully', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({ email: 'createTest@email.com', password: 'test-password' })
        .expect(201);
    });

    it('/users (POST)', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({ email: 'test@email.com', password: 'test-password' })
        .expect(400);
    });
  });

  describe('/auth/login (POST) authenticate user', () => {
    it('login successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'test@email.com', password: 'test-password' });

      expect(response.status).toEqual(200);
      expect(response.body.access_token).toBeTruthy();
    });

    it('login unsuccessful', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'test@email.com', password: 'testpassword' })
        .expect(401);
    });
  });

  describe('/users (GET) get all users', () => {
    it('get all users successfully', async () => {
      const response = await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', 'bearer ' + authToken);

      expect(response.status).toEqual(200);
      expect(response.body.length).toEqual(1);
    });
  });

  describe('/me (GET) get user profile', () => {
    it('get all users successfully', async () => {
      const response = await request(app.getHttpServer())
        .get('/users/me')
        .set('Authorization', 'bearer ' + authToken);

      expect(response.status).toEqual(200);
      expect(response.body.email).toEqual('test@email.com');
    });
  });
});

import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './app.module';

describe('Cls Middleware E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('컨트롤러와 데코레이터에서 cls 컨텍스트에 접근 가능', async () => {
    const res = await request(app.getHttpServer()).get('/pass');
    expect(res.body).toEqual({ ENTITY_MANAGER: 'CLS_VALUE', isActive: true });
  });
});

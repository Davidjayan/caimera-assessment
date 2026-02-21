import request from 'supertest';
import { createApp } from '../../app/app';

describe('Health Check', () => {
  const app = createApp();

  it('GET /health → 200 { status: "ok" }', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });
});

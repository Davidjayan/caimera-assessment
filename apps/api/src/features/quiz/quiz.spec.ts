import request from 'supertest';
import { createApp } from '../../app/app';

describe('Quiz REST API', () => {
  const app = createApp();

  it('GET /quiz/leaderboard → 200 with leaderboard array', async () => {
    const response = await request(app).get('/quiz/leaderboard');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('leaderboard');
    expect(Array.isArray(response.body.leaderboard)).toBe(true);
  });
});

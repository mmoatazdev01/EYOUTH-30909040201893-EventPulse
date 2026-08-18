const jwt = require('jsonwebtoken');
const request = require('supertest');
const User = require('../../models/User');

jest.mock('../../models/User');

const app = require('../../app');

beforeEach(() => {
  User.findById.mockResolvedValue({
    _id: '507f1f77bcf86cd799439011',
    name: 'Admin Test',
    email: 'admin@test.com',
    role: 'admin'
  });
});

describe('EventPulse API', () => {
  it('GET /api/events returns 200 and a list', async () => {
    const res = await request(app).get('/api/events');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('POST /api/events without auth returns 401', async () => {
    const res = await request(app).post('/api/events').send({
      title: 'Unauthorized event',
      category: '507f1f77bcf86cd799439012',
      date: '2026-11-15T18:00:00.000Z',
      city: 'Cairo',
      venue: 'Test Venue',
      capacity: 10
    });

    expect(res.statusCode).toBe(401);
  });

  it('POST /api/events with invalid payload returns 422', async () => {
    const token = jwt.sign({ userId: '507f1f77bcf86cd799439011', role: 'admin' }, 'fallback_secret', { expiresIn: '1h' });

    const res = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: '',
        category: 'not-a-valid-id',
        date: 'invalid-date',
        capacity: 0
      });

    expect(res.statusCode).toBe(422);
    expect(res.body.errors).toBeDefined();
  });
});

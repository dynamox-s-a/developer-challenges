const request = require('supertest');
import app from '../src/app';

describe('Backend Home responding', () => {
  it('Should respond with 200', (done) => {
    request(app).get('/').expect(200, done);
  });
});

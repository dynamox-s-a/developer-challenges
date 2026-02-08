import request from 'supertest';
import { app } from '../app';

describe('Auth', () => {
    it('should login with seeded credentials', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({ email: 'admin@dynamox.com', password: '123456' });

        expect(res.status).toBe(200);
        expect(res.body.accessToken).toBeTruthy();
        expect(res.body.user.email).toBe('admin@dynamox.com');
    });

    it('should fail login with wrong password', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({ email: 'admin@dynamox.com', password: 'wrong' });

        expect(res.status).toBe(401);
    });
});

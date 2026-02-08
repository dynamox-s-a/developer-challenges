import request from 'supertest';
import { app } from '../app';

async function login(): Promise<string> {
    const res = await request(app)
        .post('/auth/login')
        .send({ email: 'admin@dynamox.com', password: '123456' });
    return res.body.accessToken as string;
}

describe('Monitoring points list', () => {
    it('should paginate with max 5 items per page', async () => {
        const token = await login();

        const res = await request(app)
            .get(
                '/monitoring-points?page=1&pageSize=5&sort=machineName&dir=asc',
            )
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.pageSize).toBe(5);
        expect(Array.isArray(res.body.items)).toBe(true);
        expect(res.body.items.length).toBeLessThanOrEqual(5);
    });
});

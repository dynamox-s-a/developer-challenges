import request from 'supertest';
import { app } from '../app';

async function login(): Promise<string> {
    const res = await request(app)
        .post('/auth/login')
        .send({ email: 'admin@dynamox.com', password: '123456' });

    return res.body.accessToken as string;
}

describe('Business rule: Pump sensor restriction', () => {
    it('should block TcAg/TcAs on Pump machines', async () => {
        const token = await login();

        // create Pump machine
        const m = await request(app)
            .post('/machines')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Pump 1', type: 'Pump' });

        expect(m.status).toBe(201);

        // create MP
        const mp = await request(app)
            .post('/monitoring-points')
            .set('Authorization', `Bearer ${token}`)
            .send({ machineId: m.body.id, name: 'MP-1' });

        expect(mp.status).toBe(201);

        // try attach forbidden sensor
        const s = await request(app)
            .post(`/monitoring-points/${mp.body.id}/sensor`)
            .set('Authorization', `Bearer ${token}`)
            .send({ uid: 'SENS-LOCK-1', model: 'TcAg' });

        expect(s.status).toBe(400);
    });
});

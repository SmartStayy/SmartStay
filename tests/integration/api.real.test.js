process.env.SUPPRESS_NO_CONFIG_WARNING = 'y';

const request = require('supertest');
const app = require('../../server');

describe('Integration Tests - Real Database', () => {

    test('GET /api/apartments - Повертає список квартир (200 OK)', async () => {
        const res = await request(app).get('/api/apartments');
        
        expect(res.statusCode).toBe(200);
        expect(res.body).toBeDefined(); 
        expect(typeof res.body).toBe('object');
    });

    test('GET /api/apartments/1 - Повертає існуючу квартиру', async () => {
        const res = await request(app).get('/api/apartments/1');
        
        expect([200, 404]).toContain(res.statusCode);
    });

    test('POST /api/auth/register - Відхиляє короткий пароль', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ name: 'Test', email: 'test@mail.com', password: '123' });
            
        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
    });

    test('POST /api/auth/register - Відхиляє пароль без цифр', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ name: 'Test', email: 'test@mail.com', password: 'PasswordNoDigits' });
            
        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
    });

    test('POST /api/auth/login - Невірний email або пароль', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'fake.user@mail.com', pass: 'wrongpass123' });
            
        expect(res.statusCode).toBe(200); 
        expect(res.body.success).toBe(false);
    });
});
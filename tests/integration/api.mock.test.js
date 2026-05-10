process.env.SUPPRESS_NO_CONFIG_WARNING = 'y';

const request = require('supertest');
const app = require('../../server');
const pool = require('../../model/db');

jest.mock('../../model/db', () => ({
    execute: jest.fn(),
    query: jest.fn()
}));

describe('Integration Tests - Mocked Database', () => {

    test('GET /api/apartments (MOCKED)', async () => {
        const mockApartments = [
            { id: 99, title: 'Mocked Apartment 1', city: 'Київ' },
            { id: 100, title: 'Mocked Apartment 2', city: 'Львів' }
        ];
        
        pool.execute.mockResolvedValue([mockApartments, []]);
        pool.query.mockResolvedValue([mockApartments, []]);

        const res = await request(app).get('/api/apartments');

        expect(res.statusCode).toBe(200);
        expect(res.body).toBeDefined(); 
    });
});
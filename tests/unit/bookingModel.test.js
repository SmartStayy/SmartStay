const BookingModel = require('../../model/bookingModel');
const pool = require('../../model/db');

jest.mock('../../model/db', () => ({
    query: jest.fn()
}));

describe('BookingModel Unit Tests', () => {
    test('isAvailable_ApartmentIsFree_ReturnsTrue', async () => {
        pool.query.mockResolvedValue([[]]); 

        const result = await BookingModel.isAvailable(10);

        expect(result).toBe(true);
    });
});
const User = require('../../model/userModel');
const pool = require('../../model/db');

jest.mock('../../model/db', () => ({
    execute: jest.fn(),
    query: jest.fn()
}));

describe('UserModel Unit Tests (AAA Pattern)', () => {
    
    test('findByEmail_UserExists_ReturnsUserObject', async () => {
        const mockUser = { id: 1, email: 'test@example.com', name: 'Dmytro' };
        pool.execute.mockResolvedValue([[mockUser], []]); 

        const result = await User.findByEmail('test@example.com');

        expect(result).toEqual(mockUser);
        expect(pool.execute).toHaveBeenCalledWith(
            expect.stringContaining('SELECT * FROM users WHERE email = ?'),
            ['test@example.com']
        );
    });

    test('create_ValidData_ReturnsInsertId', async () => {
        const mockResult = { insertId: 123 };
        pool.execute.mockResolvedValue([mockResult, []]);

        const result = await User.create('Dmytro', 20, 'dmytro@test.com', 'hashed_pass');

        expect(result.insertId).toBe(123);
        expect(pool.execute).toHaveBeenCalledWith(
            expect.stringContaining('INSERT INTO users'),
            ['Dmytro', 20, 'dmytro@test.com', 'hashed_pass']
        );
    });
});
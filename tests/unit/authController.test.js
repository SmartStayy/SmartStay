jest.mock('config', () => ({
    get: jest.fn().mockReturnValue({}),
    has: jest.fn().mockReturnValue(true)
}));

jest.mock('../../model/userModel');
jest.mock('../../utils/logger');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

const authController = require('../../controllers/authController');

describe('AuthController Unit Tests (AAA Pattern)', () => {
    
    test('registerUser_PasswordTooShort_Returns400', async () => {
        const req = { 
            body: { password: '123' },
            ip: '127.0.0.1',
            connection: { remoteAddress: '127.0.0.1' } 
        };
        const res = { 
            status: jest.fn().mockReturnThis(), 
            json: jest.fn() 
        };

        await authController.registerUser(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Пароль має містити мінімум 8 символів'
        }));
    });

    test('loginUser_InvalidCredentials_ReturnsError', async () => {
        const req = { 
            body: { email: 'test@mail.com', pass: 'wrong' },
            ip: '127.0.0.1',
            connection: { remoteAddress: '127.0.0.1' }
        };
        const res = { json: jest.fn() };
        
        const User = require('../../model/userModel');
        User.findByEmail.mockResolvedValue(null); 

        await authController.loginUser(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            success: false,
            message: 'Невірний email або пароль!'
        }));
    });
});
const pool = require('./db');

class User {

    static async findByEmail(email) {
        const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    }

    static async findById(id) {
        try {
            const query = 'SELECT id, name, email, age FROM users WHERE id = ?';
            const [rows] = await pool.query(query, [id]);
            
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error('Помилка в UserModel.findById:', error);
            throw error;
        }
    }

    static async create(name, age, email, password) {
        const [result] = await pool.execute(
            'INSERT INTO users (name, age, email, password) VALUES (?, ?, ?, ?)',
            [name, age || 0, email, password]
        );
        return result;
    }

    static async getBookings(userId) {
        const query = `
        SELECT 
            b.id AS booking_id, b.booking_date, 
            a.title, a.city, a.price_per_night,
            p.image_url AS main_image
        FROM bookings b
        JOIN apartments a ON b.apartment_id = a.id
        LEFT JOIN apartment_photos p ON a.id = p.apartment_id AND p.is_main = TRUE
        WHERE b.user_id = ?
        ORDER BY b.booking_date DESC
    `;
        const [rows] = await pool.query(query, [userId]);
        return rows;
    }
}

module.exports = User;
const pool = require('./db');

class BookingModel {

    static async isAvailable(apartmentId) {
        const query = 'SELECT id FROM bookings WHERE apartment_id = ?';
        const [rows] = await pool.query(query, [apartmentId]);
        return rows.length === 0;
    }

    static async delete(bookingId, userId) {
        const query = 'DELETE FROM bookings WHERE id = ? AND user_id = ?';
        const [result] = await pool.query(query, [bookingId, userId]);
        return result.affectedRows > 0;
    }

    static async create(userId, apartmentId) {
        try {
            const query = 'INSERT INTO bookings (user_id, apartment_id) VALUES (?, ?)';
            const [result] = await pool.query(query, [userId, apartmentId]);
            return result.insertId;
        } catch (error) {
            console.error('Помилка виконання запиту в BookingModel.create:', error);
            throw error;
        }
    }
}

module.exports = BookingModel;
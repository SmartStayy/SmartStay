const pool = require('./db');

class Amenity {
    static async getAll() {
        try {
            const [rows] = await pool.execute('SELECT id, name FROM amenities ORDER BY name ASC');
            return rows;
        } catch (error) {
            console.error('Помилка в AmenityModel.getAll:', error);
            throw error;
        }
    }
}

module.exports = Amenity;
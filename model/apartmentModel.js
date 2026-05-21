const pool = require('./db');

class ApartmentModel {

    static async getAll(filters = {}) {
        let query = `
        SELECT 
            a.id, a.title, a.property_type, a.price_per_night, a.rooms, a.rating, a.city,
            p.image_url AS main_image
        FROM apartments a
        LEFT JOIN apartment_photos p ON a.id = p.apartment_id AND p.is_main = TRUE
    `;

        const conditions = [];
        const values = [];

        if (filters.city) {
            conditions.push('a.city LIKE ?');
            values.push(`%${filters.city}%`);
        }
        if (filters.property_type) {
            conditions.push('a.property_type = ?');
            values.push(filters.property_type);
        }
        if (filters.price_min) {
            conditions.push('a.price_per_night >= ?');
            values.push(Number(filters.price_min));
        }
        if (filters.price_max) {
            conditions.push('a.price_per_night <= ?');
            values.push(Number(filters.price_max));
        }
        
        if (filters.rooms) {
            conditions.push('a.rooms >= ?');
            values.push(Number(filters.rooms));
        }

        if (filters.rating) {
            conditions.push('a.rating >= ?');
            values.push(Number(filters.rating));
        }

        if (filters.amenities && Array.isArray(filters.amenities) && filters.amenities.length > 0) {
            const amenityIds = filters.amenities.map(id => Number(id));
            const placeholders = amenityIds.map(() => '?').join(',');

            conditions.push(`
            a.id IN (
                SELECT apartment_id 
                FROM apartment_amenities 
                WHERE amenity_id IN (${placeholders})
                GROUP BY apartment_id 
                HAVING COUNT(DISTINCT amenity_id) = ?
            )
        `);
            values.push(...amenityIds, amenityIds.length);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        const [rows] = await pool.execute(query, values);
        return rows;
    }

    static async getById(id) {
        try {
            const [apartmentRows] = await pool.execute('SELECT * FROM apartments WHERE id = ?', [id]);
            if (apartmentRows.length === 0) return null;
            const apartment = apartmentRows[0];

            const [photos] = await pool.execute(
                'SELECT image_url, is_main FROM apartment_photos WHERE apartment_id = ?',
                [id]
            );

            const [amenities] = await pool.execute(`
            SELECT am.name, am.icon_name 
            FROM amenities am
            JOIN apartment_amenities aa ON am.id = aa.amenity_id
            WHERE aa.apartment_id = ?
        `, [id]);

            return {
                ...apartment,
                photos,
                amenities
            };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = ApartmentModel;
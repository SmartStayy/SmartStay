const pool = require('./db'); 

class User {
    
    static async findByEmail(email) {
        const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0]; 
    }

    static async create(name, age, email, password) {
        const [result] = await pool.execute(
            'INSERT INTO users (name, age, email, password) VALUES (?, ?, ?, ?)',
            [name, age || 0, email, password]
        );
        return result;
    }
}

module.exports = User;
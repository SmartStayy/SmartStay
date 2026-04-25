
const API = {
    async sendJSON(url, data) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify(data) 
            });
            
            return await response.json(); 
            
        } catch (error) {
            console.error("Помилка запиту до сервера:", error);
            return { success: false, message: "Помилка з'єднання з сервером" };
        }
    },

    async login(email, password) {
        return await this.sendJSON('/login', { 
            email: email, 
            pass: password 
        });
    },

    async register(userData) {
        return await this.sendJSON('/register', userData);
    },
};
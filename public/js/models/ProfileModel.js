export default class ProfileModel {

    async fetchProfile() {
        try {
            const response = await fetch('/api/profile');
            const result = await response.json();
            return result.success ? result.data : null;
        } catch (error) {
            console.error("Помилка API профілю:", error);
            return null;
        }
    }

    // НОВИЙ МЕТОД: Оновлення даних (FormData)
    async updateProfile(formData) {
        try {
            const response = await fetch('/api/profile', {
                method: 'PUT', // або PATCH, залежить від вашого бекенду
                // Заголовок 'Content-Type' не ставимо! Браузер сам додасть multipart/form-data
                body: formData
            });
            
            if (response.status === 401 || (response.redirected && response.url.includes('/login'))) {
                return { success: false, status: 401, message: 'Потрібна авторизація' };
            }

            return await response.json();
        } catch (error) {
            console.error("Помилка при оновленні профілю:", error);
            return { success: false, message: "Помилка мережі. Перевірте з'єднання." };
        }
    }

    async cancelBooking(bookingId) {
        try {
            const response = await fetch(`/api/bookings/${bookingId}`, {
                method: 'DELETE'
            });
            
            if (response.status === 401) {
                return { success: false, status: 401, message: 'Потрібна авторизація' };
            }

            return await response.json();
        } catch (error) {
            console.error("Помилка при скасуванні:", error);
            return { success: false, message: "Помилка мережі" };
        }
    }
}
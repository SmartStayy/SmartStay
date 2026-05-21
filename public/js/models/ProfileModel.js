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

    async cancelBooking(bookingId) {
    try {
        const response = await fetch(`/api/bookings/${bookingId}`, {
            method: 'DELETE'
        });
        
        if (response.status === 401) {
            window.location.href = '/login';
            return { success: false, message: 'Потрібна авторизація' };
        }

        return await response.json();
    } catch (error) {
        console.error("Помилка при скасуванні:", error);
        return { success: false, message: "Помилка мережі" };
    }
}
}
export default class ApartmentModel {

    async fetchAmenities() {
        try {
            const response = await fetch('/api/amenities');
            const result = await response.json();
            return result.success ? result.data : [];
        } catch (error) {
            console.error("Помилка завантаження зручностей з API:", error);
            return [];
        }
    }

    async fetchApartments(filters = {}) {
        const params = new URLSearchParams();

        for (const key in filters) {
            if (Array.isArray(filters[key])) {
                filters[key].forEach(value => params.append(key, value));
            } else if (filters[key] !== '') {
                params.append(key, filters[key]);
            }
        }

        const url = `/api/apartments?${params.toString()}`;
        const response = await fetch(url);
        const result = await response.json();
        return result.success ? result.data : [];
    }

    async fetchApartmentById(id) {
        try {
            const response = await fetch(`/api/apartments/${id}`);
            const result = await response.json();

            if (result.success) {
                return result.data;
            }

            console.error('Помилка сервера:', result.message);
            return null;
        } catch (error) {
            console.error("Помилка запиту до API:", error);
            return null;
        }
    }

    async bookApartment(apartmentId) {
        try {
            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ apartmentId })
            });
            
            if (response.status === 401 || (response.redirected && response.url.includes('/login'))) {
                return { success: false, status: 401, message: 'Потрібна авторизація' };
            }

            return await response.json();
        } catch (error) {
            console.error("Помилка бронювання:", error);
            return { success: false, message: "Помилка з'єднання з сервером" };
        }
    }
}
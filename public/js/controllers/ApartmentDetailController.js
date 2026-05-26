import ModalManager from '../ModalManager.js';

export default class ApartmentDetailController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.modal = new ModalManager();
        this.init();
    }

    async init() {
        if (!this.view.container) return;

        const urlParams = new URLSearchParams(window.location.search);
        const apartmentId = urlParams.get('id');

        if (!apartmentId) {
            window.location.href = '/search';
            return;
        }

        const apartmentData = await this.model.fetchApartmentById(apartmentId);
        this.view.render(apartmentData);
        
        this.view.bindBookApartment(() => this.handleBooking(apartmentId));
    }

    async handleBooking(apartmentId) {
        // Кажемо View показати стан завантаження
        this.view.setBookingButtonState('loading');

        // Звертаємось до Моделі
        const result = await this.model.bookApartment(apartmentId);

        if (result.success) {
            this.view.setBookingButtonState('success');
            await this.modal.alert('Успіх!', 'Житло успішно заброньовано. Ви можете переглянути деталі у своєму профілі.');
            return;
        }

        // Обробка помилок
        if (result.status === 401) {
            // Скидаємо кнопку до початкового стану
            this.view.setBookingButtonState('reset');
            
            // Запитуємо користувача через наш крутий попап
            const goLogin = await this.modal.confirm(
                'Потрібна авторизація', 
                'Щоб забронювати житло, вам необхідно увійти в систему. Перейти на сторінку входу?'
            );
            
            if (goLogin) {
                window.location.href = '/login';
            }
        } 
        else if (result.message === 'Це житло вже заброньовано.') {
            this.view.setBookingButtonState('already_booked');
            await this.modal.alert('Увага', result.message);
        } 
        else {
            this.view.setBookingButtonState('reset');
            await this.modal.alert('Помилка', result.message || 'Виникла помилка під час бронювання.');
        }
    }
}
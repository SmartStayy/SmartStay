import ModalManager from '../ModalManager.js';

export default class ProfileController {

    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.modal = new ModalManager(); 
        this.init();
    }

    async init() {
        if (!this.view.isProfilePage()) return;

        await this.loadProfileData();
        
        // Зв'язуємо обидва обробники: і скасування броні, і збереження профілю
        this.view.bindEvents(
            this.handleCancelBooking.bind(this),
            this.handleProfileSave.bind(this)
        );
    }

    async loadProfileData() {
        const data = await this.model.fetchProfile();
        if (data) {
            this.view.render(data);
        } else {
            window.location.href = '/login';
        }
    }

    // НОВИЙ МЕТОД: Обробка збереження профілю
    async handleProfileSave(result) {
        // Якщо в'юшка знайшла помилку у валідації (порожні поля або паролі)
        if (result.error) {
            await this.modal.alert('Помилка валідації', result.error);
            return;
        }

        const btnSave = document.getElementById('btn-save');
        const originalText = btnSave.innerHTML;
        btnSave.innerHTML = 'Збереження...';
        btnSave.disabled = true;

        // Відправляємо FormData в модель
        const response = await this.model.updateProfile(result.data);

        btnSave.innerHTML = originalText;
        btnSave.disabled = false;

        if (response.status === 401) {
            window.location.href = '/login';
            return;
        }

        if (response.success) {
            await this.modal.alert('Успіх', 'Дані профілю успішно оновлено!');
            this.view.toggleEditMode(false);
            await this.loadProfileData(); // Перемальовуємо сторінку з новими даними
        } else {
            await this.modal.alert('Помилка', response.message || 'Не вдалося оновити профіль.');
        }
    }

    async handleCancelBooking(bookingId) {
        const isConfirmed = await this.modal.confirm(
            'Скасування бронювання',
            'Ви дійсно хочете скасувати це бронювання? Дію неможливо відмінити.'
        );

        if (isConfirmed) {
            this.view.setButtonLoadingState(bookingId, true);
            const result = await this.model.cancelBooking(bookingId);
            
            if (result.status === 401) {
                window.location.href = '/login';
                return;
            }

            if (result.success) {
                await this.loadProfileData(); 
            } else {
                await this.modal.alert('Помилка', result.message || 'Не вдалося скасувати бронювання.');
                this.view.setButtonLoadingState(bookingId, false);
            }
        }
    }
}
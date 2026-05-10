export default class ApartmentDetailController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
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
        this.setupBookingButton(apartmentId);
    }

    setupBookingButton(apartmentId) {
        const bookBtn = document.getElementById('btn-book-apartment');
        if (!bookBtn) return;

        bookBtn.addEventListener('click', async () => {
            const originalText = bookBtn.innerHTML;
            bookBtn.innerHTML = 'Обробка...';
            bookBtn.disabled = true;
            bookBtn.classList.add('loading');

            const result = await this.model.bookApartment(apartmentId);

            if (result.success) {
                bookBtn.innerHTML = 'Заброньовано';
                bookBtn.classList.remove('loading');
                bookBtn.classList.add('success');
            } else {
                bookBtn.classList.remove('loading');

                if (result.message === 'Це житло вже заброньовано.') {
                    bookBtn.innerHTML = 'Вже заброньовано';
                    bookBtn.disabled = true;
                    bookBtn.style.background = '#6c757d';
                } else {
                    alert(result.message || 'Виникла помилка під час бронювання.');
                    bookBtn.innerHTML = originalText;
                    bookBtn.disabled = false;
                }
            }
        });
    }
}
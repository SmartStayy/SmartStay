export default class ProfileView {
    get infoContainer() { return document.getElementById('user-info-card'); }
    get bookingsGrid() { return document.getElementById('bookings-grid'); }

    render(data) {
        if (!this.infoContainer || !data) return;

        this.infoContainer.innerHTML = `
            <h1>Профіль: ${data.user.name}</h1>
            <div class="user-details">
                <p><b>Email:</b> ${data.user.email}</p>
                <p><b>Вік:</b> ${data.user.age} років</p>
            </div>
        `;

        if (data.bookings.length === 0) {
            this.bookingsGrid.innerHTML = '<p class="empty-msg">У вас ще немає заброньованих об\'єктів.</p>';
            return;
        }

        this.bookingsGrid.innerHTML = data.bookings.map(b => `
            <div class="card">
            <div class="card-images">
            <img src="${b.main_image || '/images/default.jpg'}" alt="${b.title}">
             </div>
            <div class="card-content">
            <h3>${b.title}</h3>
            <p><b>Місто:</b> ${b.city}</p>
            <p><b>Ціна:</b> ${b.price_per_night} грн/ніч</p>
            <span class="status-tag">Підтверджено</span>
            <p class="date-info">Дата: ${new Date(b.booking_date).toLocaleDateString()}</p>
            <button class="btn btn-cancel" data-id="${b.booking_id}">Скасувати бронь</button>
            </div>
            </div>
        `).join('');
    }

    isProfilePage() {
        return document.getElementById('user-info-card') !== null;
    }

    bindCancelBooking(handler) {
        const grid = document.getElementById('bookings-grid');
        if (!grid) return;

        grid.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-cancel')) {
                const bookingId = e.target.dataset.id;
                handler(bookingId); 
            }
        });
    }

    setButtonLoadingState(bookingId, isLoading) {
        const btn = document.querySelector(`.btn-cancel[data-id="${bookingId}"]`);
        if (!btn) return;

        if (isLoading) {
            btn.dataset.originalText = btn.innerHTML; 
            btn.innerHTML = 'Скасування...';
            btn.disabled = true;
        } else {
            btn.innerHTML = btn.dataset.originalText || 'Скасувати бронь';
            btn.disabled = false;
        }
    }
}
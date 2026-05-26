export default class ProfileView {
    get bookingsGrid() { return document.getElementById('bookings-grid'); }

    render(data) {
        if (!data) return;

        // 1. Оновлюємо текстові поля
        document.getElementById('display-name').textContent = data.user.name || 'Не вказано';
        document.getElementById('display-email').textContent = data.user.email || 'Не вказано';
        document.getElementById('display-age').textContent = data.user.age || 'Не вказано';

        // 2. Оновлюємо поля інпутів
        document.getElementById('input-name').value = data.user.name || '';
        document.getElementById('input-email').value = data.user.email || '';
        document.getElementById('input-age').value = data.user.age || '';

        // 3. Оновлюємо аватар
        const avatarImg = document.getElementById('avatar-img');
        if (avatarImg && data.user.avatar) {
            avatarImg.src = data.user.avatar;
        } else {
            // Дефолтна картинка, якщо немає ави
            avatarImg.src = "/images/avatars/default-avatar.png";
        }

        // 4. Рендер бронювань або заглушки
        if (data.bookings.length === 0) {
            this.bookingsGrid.innerHTML = `
                <div class="empty-bookings-card" style="grid-column: 1 / -1;">
                    <h3>У вас ще немає активних бронювань</h3>
                    <p>Знайдіть ідеальне місце для вашої наступної поїздки серед тисяч варіантів.</p>
                    <button class="btn btn-primary" onclick="window.location.href='/search'">Перейти до пошуку житла</button>
                </div>
            `;
            this.bookingsGrid.style.display = 'block'; // Знімаємо грід, щоб картка була на всю ширину
            return;
        }

        this.bookingsGrid.style.display = 'grid'; // Повертаємо грід
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
                    <p class="date-info">Дата: ${new Date(b.booking_date).toLocaleDateString('uk-UA')}</p>
                    <button class="btn btn-danger-outline btn-cancel" data-id="${b.booking_id}">
                        Скасувати бронь
                    </button>
                </div>
            </div>
        `).join('');
    }

    isProfilePage() {
        return document.getElementById('user-info-card') !== null;
    }

    toggleEditMode(isActive) {
        const viewMode = document.getElementById('view-mode');
        const editMode = document.getElementById('edit-mode');
        
        if (isActive) {
            viewMode.style.display = 'none';
            editMode.classList.add('active');
        } else {
            editMode.classList.remove('active');
            viewMode.style.display = 'block';
            // Очищаємо поля паролів при виході
            document.getElementById('input-old-password').value = '';
            document.getElementById('input-new-password').value = '';
        }
    }

    // Збираємо дані і робимо валідацію
    getFormData() {
        const name = document.getElementById('input-name').value.trim();
        const email = document.getElementById('input-email').value.trim();
        const age = document.getElementById('input-age').value.trim();
        const oldPwd = document.getElementById('input-old-password').value;
        const newPwd = document.getElementById('input-new-password').value;
        const avatarFile = document.getElementById('avatar-input').files[0];

        // ПРАВИЛО 1: Хоча б одне поле (ім'я, імейл, вік) має бути заповнене
        if (!name && !email && !age) {
            return { error: 'Хоча б одне поле (Ім\'я, Email або Вік) має бути заповнене.' };
        }

        // ПРАВИЛО 2: Якщо ввели один пароль, інший теж має бути
        if ((oldPwd && !newPwd) || (!oldPwd && newPwd)) {
            return { error: 'Для зміни пароля необхідно заповнити обидва поля (поточний та новий пароль).' };
        }

        // Формуємо FormData для відправки файлу + тексту
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('age', age);
        
        if (oldPwd && newPwd) {
            formData.append('oldPassword', oldPwd);
            formData.append('newPassword', newPwd);
        }
        if (avatarFile) {
            formData.append('avatar', avatarFile);
        }

        return { data: formData };
    }

    bindEvents(cancelBookingHandler, saveProfileHandler) {
        // Логіка скасування броні (як було)
        if (this.bookingsGrid) {
            this.bookingsGrid.addEventListener('click', (e) => {
                const btn = e.target.closest('.btn-cancel');
                if (btn) cancelBookingHandler(btn.dataset.id);
            });
        }

        // Перемикання режимів
        document.getElementById('btn-edit-mode')?.addEventListener('click', () => this.toggleEditMode(true));
        document.getElementById('btn-cancel')?.addEventListener('click', () => {
            this.toggleEditMode(false);
            // Тут в ідеалі треба повернути інпутам старі значення з display-елементів,
            // але простіше просто зробити повторний render() через контролер
        });

        // Вибір фото
        const avatarContainer = document.getElementById('avatar-container');
        const avatarInput = document.getElementById('avatar-input');
        const avatarImg = document.getElementById('avatar-img');

        if (avatarContainer && avatarInput) {
            avatarContainer.addEventListener('click', () => avatarInput.click());
            
            avatarInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => avatarImg.src = ev.target.result;
                    reader.readAsDataURL(file);
                }
            });
        }

        // Збереження профілю
        document.getElementById('btn-save')?.addEventListener('click', () => {
            const result = this.getFormData();
            saveProfileHandler(result);
        });
    }

    setButtonLoadingState(bookingId, isLoading) {
        const btn = document.querySelector(`.btn-cancel[data-id="${bookingId}"]`);
        if (!btn) return;
        if (isLoading) {
            btn.dataset.originalText = btn.innerHTML; 
            btn.innerHTML = 'Скасування...';
            btn.disabled = true;
            btn.style.opacity = '0.7';
        } else {
            btn.innerHTML = btn.dataset.originalText || 'Скасувати бронь';
            btn.disabled = false;
            btn.style.opacity = '1';
        }
    }
}
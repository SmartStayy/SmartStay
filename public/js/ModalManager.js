export default class ModalManager {
    constructor() {
        this.modal = document.getElementById('custom-modal');
        this.titleEl = document.getElementById('modal-title');
        this.textEl = document.getElementById('modal-text');
        this.btnNo = document.getElementById('modal-btn-no');
        this.btnYes = document.getElementById('modal-btn-yes');
    }

    // Режим "Вопрос" (две кнопки)
    confirm(title, text) {
        return this._show(title, text, 'confirm');
    }

    // Режим "Информация/Ошибка" (одна кнопка)
    alert(title, text) {
        return this._show(title, text, 'alert');
    }

    _show(title, text, type) {
        return new Promise((resolve) => {
            this.titleEl.textContent = title;
            this.textEl.textContent = text;
            
            // Настраиваем кнопки в зависимости от типа
            if (type === 'alert') {
                this.btnNo.style.display = 'none';
                this.btnYes.textContent = 'Зрозуміло'; 
            } else {
                this.btnNo.style.display = 'block';
                this.btnYes.textContent = 'Так'; 
                this.btnNo.textContent = 'Закрити';
            }

            // Показываем окно
            this.modal.classList.add('show');

            // Функция очистки обработчиков (чтобы не было утечек памяти)
            const cleanup = () => {
                this.modal.classList.remove('show');
                this.btnYes.onclick = null;
                this.btnNo.onclick = null;
                this.modal.onclick = null;
            };

            // Обработка клика "Так/Зрозуміло"
            this.btnYes.onclick = () => {
                cleanup();
                resolve(true);
            };

            // Обработка клика "Ні/Скасувати"
            this.btnNo.onclick = () => {
                cleanup();
                resolve(false);
            };

            // Обработка клика по темному фону (закрытие = отмена)
            this.modal.onclick = (e) => {
                if (e.target === this.modal) {
                    cleanup();
                    resolve(false);
                }
            };
        });
    }
}
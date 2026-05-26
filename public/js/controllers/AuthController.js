export default class AuthController {

    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.init();
    }

    init() {
        this.setupLoginHandler();
        this.setupRegisterHandler();
        this.setupNavigation();
    }

    setupLoginHandler() {
        const form = this.view.loginForm;
        if (!form) return;

        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const messageEl = this.view.loginMessage;
            if (messageEl) messageEl.textContent = "";

            const { email, password } = this.view.getLoginData();

            if (!email || !password) {
                this.view.showMessage(messageEl, "Будь ласка, заповніть усі поля.");
                return;
            }

            try {
                const result = await this.model.login(email, password);

                if (result.success) {
                    this.view.clearLoginInputs();
                    this.view.navigateTo('/search');
                } else {
                    this.view.showMessage(messageEl, result.message);
                }
            } catch (err) {
                console.error('Критична помилка:', err);
                this.view.showMessage(messageEl, "Сталася помилка на сервері.");
            }
        });
    }

    setupRegisterHandler() {
        const form = this.view.registerForm;
        if (!form) return;

        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const messageEl = this.view.registerMessage;
            if (messageEl) messageEl.textContent = "";

            const userData = this.view.getRegisterData();

            if (!userData.name || !userData.email || !userData.password) {
                this.view.showMessage(messageEl, "Будь ласка, заповніть усі поля.");
                return;
            }

            try {
                const result = await this.model.register(userData);

                if (result.success) {
                    this.view.navigateTo('/search');
                } else {
                    this.view.showMessage(messageEl, result.message);
                }
            } catch (err) {
                console.error('Помилка реєстрації:', err);
                this.view.showMessage(messageEl, "Сталася помилка з'єднання.");
            }
        });
    }

    setupNavigation() {
        const actions = [
            { id: 'btn_go_to_login', url: '/search' },
            { id: 'btn_back_to_home', url: '/' },
            { id: 'btn_search', url: '/results' }
        ];

        actions.forEach(action => {
            const btn = document.getElementById(action.id);
            if (btn) {
                btn.addEventListener('click', () => this.view.navigateTo(action.url));
            }
        });
    }
    
}
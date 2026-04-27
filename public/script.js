
const buttonTologin = document.querySelector('#btn_go_to_login');
if (buttonTologin) {
    buttonTologin.addEventListener('click', (e) => {
        window.location.href = 'api/auth/login';
    });
}

const buttonBackToHome = document.querySelector('#btn_back_to_home');
if (buttonBackToHome) {
    buttonBackToHome.addEventListener('click', (e) => {
        window.location.href = '/';
    });
}

const buttonToSearch = document.querySelector('#btn_search');
if (buttonToSearch) {
    buttonToSearch.addEventListener('click', (e) => {
        window.location.href = '/results';
    });
}

(function() {

    // ==== Log in ====

    const initLogin = () => {

        const loginForm = document.getElementById('loginForm');
        const message = document.getElementById("loginMessage");

        if (!loginForm) return;

        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const emailInput = document.getElementById("loginEmail");
            const passwordInput = document.getElementById("loginPassword");

            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();

            if (email === "" || password === "") {
                if (message) {
                    message.style.color = "#c62828";
                    message.textContent = "Будь ласка, заповніть усі поля.";
                }
                return; 
            }

            const submitBtn = loginForm.querySelector('button');
            if (message) message.textContent = ""; 

            try {
                const result = await API.login(email, password);

                if (result.success) {
                    emailInput.value = "";
                    passwordInput.value = "";
                    window.location.href = '/search';
                }

                else {
                    if (message) {
                        message.style.color = "#c62828";
                        message.textContent = result.message;
                    }
                }

            } catch (err) {
                console.error('Критична помилка:', err);
                if (message) {
                    message.style.color = "#c62828";
                    message.textContent = "Сталася помилка на сервері.";
                }
            }
        });
    };

    // ==== Registration ====

    const initRegister = () => {

    const regForm = document.getElementById('registerForm');
    const message = document.getElementById("registerMessage");

    if (!regForm) return;

    regForm.addEventListener('submit', async (event) => {
        event.preventDefault(); 

        const nameInput = document.getElementById("registerName");
        const emailInput = document.getElementById("registerEmail");
        const passwordInput = document.getElementById("registerPassword");
        const ageInput = document.getElementById("registerAge"); 

        const name = nameInput.value.trim();
        const email = emailInput.value.trim().toLowerCase();
        const password = passwordInput.value.trim();
        const age = ageInput ? ageInput.value.trim() : "0";

        if (name === "" || email === "" || password === "") {
            message.style.color = "#c62828";
            message.textContent = "Будь ласка, заповніть усі поля.";
            return;
        }

        const submitBtn = regForm.querySelector('button');
        message.textContent = "";

        try {
            const userData = { name, email, password, age };
            const result = await API.register(userData);

            if (result.success) {
                window.location.href = '/search';

            } else {
                message.style.color = "#c62828";
                message.textContent = result.message;
            }
        } catch (err) {
            console.error('Помилка:', err);
            message.textContent = "Сталася помилка з'єднання.";
        }
    });
};

   document.addEventListener('DOMContentLoaded', () => {
    if (typeof initLogin === 'function') {
        initLogin();
        initRegister();
    } 
});
    
})();

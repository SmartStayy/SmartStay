export default class AuthView {
   
    get loginForm() { return document.getElementById('loginForm'); }
    get loginMessage() { return document.getElementById('loginMessage'); }
    get loginEmailInput() { return document.getElementById("loginEmail"); }
    get loginPasswordInput() { return document.getElementById("loginPassword"); }

    get registerForm() { return document.getElementById('registerForm'); }
    get registerMessage() { return document.getElementById("registerMessage"); }
    get registerNameInput() { return document.getElementById("registerName"); }
    get registerEmailInput() { return document.getElementById("registerEmail"); }
    get registerPasswordInput() { return document.getElementById("registerPassword"); }
    get registerAgeInput() { return document.getElementById("registerAge"); }

    getLoginData() {
        return {
            email: this.loginEmailInput?.value.trim(),
            password: this.loginPasswordInput?.value.trim()
        };
    }

    getRegisterData() {
        return {
            name: this.registerNameInput?.value.trim(),
            email: this.registerEmailInput?.value.trim().toLowerCase(),
            password: this.registerPasswordInput?.value.trim(),
            age: this.registerAgeInput ? this.registerAgeInput.value.trim() : "0"
        };
    }

    showMessage(element, text, isError = true) {
        if (element) {
            element.style.color = isError ? "#c62828" : "#2e7d32";
            element.textContent = text;
        }
    }

    clearLoginInputs() {
        if (this.loginEmailInput) this.loginEmailInput.value = "";
        if (this.loginPasswordInput) this.loginPasswordInput.value = "";
    }

    navigateTo(url) {
        window.location.href = url;
    }
    
}
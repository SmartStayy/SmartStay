export default class ProfileController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.init();
    }

    async init() {
        if (!this.view.isProfilePage()) return;

        await this.loadProfileData();
        
        this.view.bindCancelBooking(this.handleCancelBooking.bind(this));
    }

    async loadProfileData() {
        const data = await this.model.fetchProfile();
        
        if (data) {
            this.view.render(data);
        } else {
            window.location.href = '/login';
        }
    }

    async handleCancelBooking(bookingId) {
        if (confirm('Ви дійсно хочете скасувати це бронювання? Дію неможливо відмінити.')) {
            
            this.view.setButtonLoadingState(bookingId, true);

            const result = await this.model.cancelBooking(bookingId);
            
            if (result.success) {
                await this.loadProfileData();
            } else {
                alert(result.message);
                this.view.setButtonLoadingState(bookingId, false);
            }
        }
    }
}
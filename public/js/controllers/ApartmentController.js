export default class ApartmentController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.init();
    }

    async init() {
        if (!this.view.gridElement) return;
        await this.loadApartments();
        this.bindEvents();
    }

    async loadApartments() {
        const filters = this.view.getFiltersData(); // Зібрали дані з HTML
        const apartments = await this.model.fetchApartments(filters); // Відправили на сервер
        this.view.renderApartments(apartments); // Намалювали результат
    }

    bindEvents() {
        const btnMainSearch = document.getElementById('btn-main-search');
        if (btnMainSearch) {
            btnMainSearch.addEventListener('click', () => this.loadApartments());
        }

        const filterForm = document.getElementById('filter-form');
        if (filterForm) {
            filterForm.addEventListener('submit', (e) => {
                e.preventDefault(); 
                this.loadApartments();
            });
        }

        const btnReset = document.getElementById('btn-reset-filters');
        if (btnReset) {
            btnReset.addEventListener('click', async () => {
                this.view.clearFilters(); 
                await this.loadApartments(); 
            });
        }
    } 
}
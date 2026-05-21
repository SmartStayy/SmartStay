export default class ApartmentController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.init();
    }

    async init() {
        if (!this.view.gridElement) return;
        await this.loadAmenities();
        await this.loadApartments();
        this.bindEvents();
    }

    async loadAmenities() {
        const amenities = await this.model.fetchAmenities();
        this.view.renderAmenities(amenities);
    }

    async loadApartments() {
        const filters = this.view.getFiltersData();
        const apartments = await this.model.fetchApartments(filters);
        this.view.renderApartments(apartments); 
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

        const resetButton = 'btn-reset-filters';
        const btn = document.getElementById(resetButton);
        if (btn) {
            btn.addEventListener('click', async () => {
            this.view.clearFilters(); 
            await this.loadApartments(); 
            });
        }
    } 
}
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
        if (this.view.validateDates(filters.checkin, filters.checkout)) {
            const apartments = await this.model.fetchApartments(filters);
            this.view.renderApartments(apartments); 
        }
    }

    bindEvents() {
        const btnMainSearch = document.getElementById('btn-main-search');
        const filters = this.view.getFiltersData();
        if (btnMainSearch) {
            btnMainSearch.addEventListener('click', () => {
                this.loadApartments();
            });
        }

        const filterForm = document.getElementById('filter-form');
        if (filterForm) {
            filterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.loadApartments();
            });
        }

        const btnResetSidebar = document.getElementById('btn-reset-filters');
        if (btnResetSidebar) {
            btnResetSidebar.addEventListener('click', async () => {
                this.view.clearSidebarFilters(); 
                await this.loadApartments(); 
            });
        }

        const btnResetTop = document.getElementById('btn-reset-top');
        if (btnResetTop) {
            btnResetTop.addEventListener('click', async () => {
                this.view.clearTopSearch(); 
                await this.loadApartments(); 
            });
        }
    } 
}
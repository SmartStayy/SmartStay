export default class ApartmentView {

    get gridElement() { return document.getElementById('apartments-grid'); }
    get emptyState() { return document.getElementById('empty-state'); }

    getFiltersData() {
        const amenityCheckboxes = document.querySelectorAll('input[name="amenity"]:checked');
        const selectedAmenities = Array.from(amenityCheckboxes).map(cb => cb.value);

        return {
            city: document.getElementById('search-city')?.value.trim() || '',
            price_min: document.getElementById('filter-price-min')?.value || '',
            price_max: document.getElementById('filter-price-max')?.value || '',
            property_type: document.getElementById('filter-type')?.value || '',
            rooms: document.getElementById('filter-rooms')?.value || '',
            rating: document.getElementById('filter-rating')?.value || '',
            amenities: selectedAmenities
        };
    }

    clearFilters() {
        const ids = ['search-city', 'filter-price-min', 'filter-price-max', 'filter-type', 'filter-rooms', 'filter-rating'];
        ids.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
        document.querySelectorAll('input[name="amenity"]').forEach(cb => cb.checked = false);
    }

    renderApartments(apartments) {
        const grid = this.gridElement;
        const empty = this.emptyState;

        if (!grid) return;

        if (apartments.length === 0) {
            grid.style.display = 'none';
            if (empty) empty.style.display = 'block';
            return;
        }

        grid.style.display = 'grid';
        if (empty) empty.style.display = 'none';

        grid.innerHTML = apartments.map(apt => `
            <div class="card">
                <div class="card-images">
                    <img src="${apt.main_image || '/images/default.jpg'}" alt="${apt.title}">
                </div>
                <h3>${apt.title}</h3>
                <p><b>Ціна:</b> ${apt.price_per_night} грн / ніч</p>
                <p><b>Кімнат:</b> ${apt.rooms}</p>
                <p><b>Оцінка:</b> ${apt.rating} / 10</p>
                <p><b>Місто:</b> ${apt.city}</p>
                <button class="btn" onclick="window.location.href='/apartment?id=${apt.id}'">Детальніше</button>
            </div>
        `).join('');
    }
}
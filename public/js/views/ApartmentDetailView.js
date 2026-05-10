export default class ApartmentDetailView {
    get container() { return document.querySelector('.detail-container'); }

    render(apartment) {
        if (!this.container) return; 

        if (!apartment) {
            this.container.innerHTML = '<h1>Помилка завантаження даних. Можливо, квартира була видалена.</h1>';
            return;
        }

        document.getElementById('apt-title').textContent = apartment.title;
        document.getElementById('apt-city').textContent = apartment.city;
        document.getElementById('apt-address').textContent = apartment.address;
        document.getElementById('apt-rating').textContent = apartment.rating;
        document.getElementById('apt-description').textContent = apartment.description;
        document.getElementById('apt-price').textContent = apartment.price_per_night;

        const mainPhotoEl = document.getElementById('main-photo');
        const thumbnailsContainer = document.getElementById('thumbnails');
        
        if (apartment.photos && apartment.photos.length > 0) {
            const mainPhoto = apartment.photos.find(p => p.is_main) || apartment.photos[0];
            mainPhotoEl.src = mainPhoto.image_url;

            thumbnailsContainer.innerHTML = apartment.photos.map(photo => `
                <img src="${photo.image_url}" class="thumbnail" alt="Фото">
            `).join('');

            const thumbElements = thumbnailsContainer.querySelectorAll('.thumbnail');
            thumbElements.forEach(thumb => {
                thumb.addEventListener('click', (e) => {
                    mainPhotoEl.src = e.target.src;
                });
            });
        }

        const amenitiesList = document.getElementById('amenities-list');
        if (apartment.amenities && apartment.amenities.length > 0) {
            amenitiesList.innerHTML = apartment.amenities.map(am => `
                <li>✔️ ${am.name}</li>
            `).join('');
        } else {
            amenitiesList.innerHTML = '<li>Зручності не вказані</li>';
        }
    }
}
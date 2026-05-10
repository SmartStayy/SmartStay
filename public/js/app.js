import AuthModel from './models/AuthModel.js';
import AuthView from './views/AuthView.js';
import AuthController from './controllers/AuthController.js';

import ApartmentModel from './models/ApartmentModel.js';
import ApartmentView from './views/ApartmentView.js';
import ApartmentController from './controllers/ApartmentController.js';

import ApartmentDetailView from './views/ApartmentDetailView.js';
import ApartmentDetailController from './controllers/ApartmentDetailController.js';

import ProfileModel from './models/ProfileModel.js';
import ProfileView from './views/ProfileView.js';
import ProfileController from './controllers/ProfileController.js';

function initApp() {
   
    const authModel = new AuthModel();
    const authView = new AuthView();
    new AuthController(authModel, authView);

    const apartmentModel = new ApartmentModel();
    const apartmentView = new ApartmentView();
    new ApartmentController(apartmentModel, apartmentView);

    const detailView = new ApartmentDetailView();
    new ApartmentDetailController(apartmentModel, detailView);

    const profileModel = new ProfileModel();
    const profileView = new ProfileView();
    new ProfileController(profileModel, profileView);

}

document.addEventListener('DOMContentLoaded', initApp);
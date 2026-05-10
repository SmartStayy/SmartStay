const express = require('express');
const router = express.Router();
const apartmentController = require('../controllers/apartmentController');

router.get('/', apartmentController.getApartments);
router.get('/:id', apartmentController.getApartmentById);

module.exports = router;
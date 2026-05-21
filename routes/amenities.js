const express = require('express');
const router = express.Router();
const amenityController = require('../controllers/amenityController');

router.get('/', amenityController.getAllAmenities);

module.exports = router;
const Apartment = require('../model/apartmentModel');
const logEvent = require('../utils/logger'); 

exports.getApartments = async (req, res) => {
    try {
        const filters = {
            city: req.query.city,
            property_type: req.query.property_type,
            price_min: req.query.price_min,
            price_max: req.query.price_max,
            rooms: req.query.rooms,
            rating: req.query.rating,
            amenities: req.query.amenities ? (Array.isArray(req.query.amenities) ? req.query.amenities : [req.query.amenities]) : []
        };

        const apartments = await Apartment.getAll(filters);
        return res.status(200).json({ success: true, data: apartments });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Помилка сервера' });
    }
};

exports.getApartmentById = async (req, res) => {
    try {
        const id = req.params.id;
        const apartment = await Apartment.getById(id);
        
        if (!apartment) {
            return res.status(404).json({ 
                success: false, 
                message: 'Об\'єкт не знайдено' 
            });
        }

        res.status(200).json({ success: true, data: apartment });
    } catch (error) {
        console.error('Помилка отримання деталей:', error);
        res.status(500).json({ success: false, message: 'Помилка сервера' });
    }
};
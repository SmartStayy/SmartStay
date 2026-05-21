const Amenity = require('../model/amenityModel');

exports.getAllAmenities = async (req, res) => {
    try {
        const amenities = await Amenity.getAll();
        
        res.status(200).json({ 
            success: true, 
            data: amenities 
        });
    } catch (error) {
        console.error('Помилка контролера при отриманні зручностей:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Помилка сервера при завантаженні зручностей' 
        });
    }
};
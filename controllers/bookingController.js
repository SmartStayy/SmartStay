const Booking = require('../model/bookingModel');

exports.createBooking = async (req, res) => {
    try {
        const userId = req.user.id; 
        const { apartmentId } = req.body;

        if (!apartmentId) {
            return res.status(400).json({ 
                success: false, 
                message: 'ID квартири обов’язкове' 
            });
        }

        const isAvailable = await Booking.isAvailable(apartmentId);
        if (!isAvailable) {
            return res.status(400).json({ 
                success: false, 
                message: 'Це житло вже заброньовано.' 
            });
        }

        const bookingId = await Booking.create(userId, apartmentId);
        
        res.status(201).json({ 
            success: true, 
            message: 'Житло успішно заброньовано', 
            bookingId 
        });
    } catch (error) {
        console.error('Помилка в createBooking:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Помилка на сервері при створенні бронювання' 
        });
    }
};

exports.cancelBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const userId = req.user.id;

        const deleted = await Booking.delete(bookingId, userId);
        if (deleted) {
            res.status(200).json({ success: true, message: 'Бронювання скасовано' });
        } else {
            res.status(403).json({ success: false, message: 'Не вдалося видалити або ви не є власником бронювання' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Помилка сервера' });
    }
};
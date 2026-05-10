const User = require('../model/userModel');

exports.getProfileData = async (req, res) => {
    try {
        const userId = req.user.id; 
        const user = await User.findById(userId); 
        const bookings = await User.getBookings(userId);

        res.status(200).json({
            success: true,
            data: { user, bookings } 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Помилка завантаження профілю" });
    }
};
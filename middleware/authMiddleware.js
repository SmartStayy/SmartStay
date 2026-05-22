const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    const token = req.cookies.token; 

    if (!token) {
        return res.status(401).redirect('/login'); 
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 
        // req.user = { 
        //     id: 44, 
        //     email: 'test@example.com' 
        // }
        next(); 

    } catch (err) {
        res.clearCookie('token'); 
        return res.status(401).redirect('/login');
    }
};
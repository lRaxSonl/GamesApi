const jwt = require('jsonwebtoken');
const JWT_SECRET = require('../config/config');

function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) {
        return res.redirect('/login')
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.redirect('/login');
        }
        req.user = user;
        next();
    });
}


function isAdmin(req, res, next) {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Требуется роль администратора' });
    }
    next();
}

module.exports = { authenticateToken, isAdmin };

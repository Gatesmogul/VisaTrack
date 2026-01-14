const jwt = require('jsonwebtoken');
const User = require('../models/User');

const isAuthenticated = (req, res, next) => {
    let token = req.cookies.authToken;
    if (!token) {
        const authHeader = req.header('Authorization') || req.header('authorization');
        if (authHeader) token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    }
    if (!token) return res.status(401).redirect('/login');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
        req.user = decoded;
        return next();
    } catch (ex) {
        res.clearCookie('authToken');
        return res.status(401).redirect('/login');
    }
};

const isAdmin = async (req, res, next) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Access denied.' });
        }
        const user = await User.findById(req.user.id);
        if (!user || !user.isAdmin) {
            return res.status(403).json({ message: 'Access denied. Not an admin.' });
        }
        return next();
    } catch (error) {
        return res.status(500).json({ message: 'Server error.' });
    }
};

module.exports = {
    isAuthenticated,
    isAdmin,
};
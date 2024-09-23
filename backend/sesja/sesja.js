const jwt = require('jsonwebtoken');



const sesja = (req, res, next) => {
    const token = req.header('x-auth-token');

    if (!token) {
        return res.status(401).json({ message: 'Brak tokenu, autoryzacja odrzucona' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded.userId; // Ustawienie ID użytkownika
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token jest nieprawidłowy' });
    }
};

module.exports = sesja;


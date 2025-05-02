import jwt from 'jsonwebtoken';
export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = req.cookies?.token ||
        (authHeader && authHeader.startsWith('Bearer ')
            ? authHeader.split(' ')[1]
            : undefined);
    if (!token) {
        res.status(401).json({ message: 'Токен отсутствует' });
        return;
    }
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET не задан в переменных окружения');
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error('Ошибка верификации:', err.message);
            res.status(403).json({ message: 'Недействительный токен' });
            return;
        }
        if (!decoded) {
            res.status(403).json({ message: 'Недействительный токен' });
            return;
        }
        req.user = decoded;
        next();
    });
};

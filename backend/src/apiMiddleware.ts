import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
  user?: JwtPayload | string;
}

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
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

  jwt.verify(
    token, 
    process.env.JWT_SECRET, 
    (err: VerifyErrors | null, decoded: JwtPayload | string | undefined) => {
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
    }
  );
};
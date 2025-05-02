import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '../models/user.js';

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload | string;
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = getTokenFromRequest(req);
    
    if (!token) {
      console.warn('Попытка доступа без токена', {
        path: req.path,
        ip: req.ip
      });
      res.status(401).json({ message: 'Требуется авторизация' });
      return;
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET не настроен');
      throw new Error('Ошибка конфигурации сервера');
    }

    const decoded = await verifyToken(token, process.env.JWT_SECRET);
    const user = await User.findByPk((decoded as JwtPayload).userId);
    if (!user) {
      console.warn('Пользователь из токена не найден', { 
        userId: (decoded as JwtPayload).userId 
      });
      res.status(401).json({ message: 'Пользователь не существует' });
      return;
    }
    req.user = decoded;
    console.log('Успешная аутентификация', { 
      userId: (decoded as JwtPayload).userId,
      route: req.path 
    });
    
    next();
  } catch (error) {
    handleAuthError(error, res, req);
  }
};

function getTokenFromRequest(req: Request): string | null {
  return req.cookies?.token || 
  req.headers['x-access-token'] || 
         (req.headers.authorization?.startsWith('Bearer ') 
          ? req.headers.authorization.split(' ')[1] 
          : null);
}
async function verifyToken(token: string, secret: string): Promise<string | JwtPayload> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, secret, (err, decoded) => {
        if (err || !decoded) {
          const errorDetails = {
            errorType: 'JWT_VERIFICATION_FAILED',
            errorMessage: err?.message,
            tokenPreview: token.substring(0, 10) + '...',
            tokenLength: token.length,
            verificationTime: new Date().toISOString(),
            commonIssues: {
              malformed: 'Токен поврежден или имеет неправильный формат',
              expired: 'Токен просрочен',
              invalidSignature: 'Неверная подпись токена'
            }
          };
          
          console.error('Ошибка верификации токена:', errorDetails);
          reject(err || new Error('Invalid token'));
        } else {
          console.debug('Токен успешно верифицирован', {
            decoded: {
              id: (decoded as JwtPayload).userId,
              iat: (decoded as JwtPayload).iat,
              exp: (decoded as JwtPayload).exp
            },
            verificationTime: new Date().toISOString()
          });
          resolve(decoded);
        }
      });
    });
  }
  function handleAuthError(
    error: unknown,
    res: Response,
    req: Request  
  ): void {
    if (error instanceof jwt.JsonWebTokenError) {
      if (error.message.includes('malformed')) {
        console.error('Ошибка формата токена (jwt malformed)', {
          details: {
            reason: 'Токен имеет неправильный формат или поврежден',
            possibleCauses: [
              'Токен был изменен клиентом',
              'Токен не был правильно сформирован при создании',
              'Проблемы с кодировкой/декодировкой'
            ],
            receivedToken: getTokenFromRequest(req)?.substring(0, 15) + '...',
            timestamp: new Date().toISOString(),
            path: req.path,
            method: req.method,
            ip: req.ip
          }
        });
        
        res.status(401).json({ 
          message: 'Неверный формат токена',
          solution: 'Попробуйте войти снова или очистите куки'
        });
        return;
      }
    }
  }
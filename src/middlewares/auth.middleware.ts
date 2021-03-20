import { NextFunction, Response } from 'express';
import { authReq } from '../interfaces/token.interface';
import { decodeToken } from '../utils/encryption';

export default function authMiddleware(req: authReq, res: Response, next: NextFunction) {
    const token = req.headers.authorization;

    if (token) {
        try {
            const decodedToken = decodeToken(token);
            req.decodedToken = decodedToken;
        } catch {}
    }
    console.log(req.hostname, req.originalUrl, req.path, req.body, req.method, req.headers);

    next();
}

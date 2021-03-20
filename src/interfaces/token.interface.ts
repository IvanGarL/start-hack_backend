import { Request } from 'express';

export interface DecodedToken {
    _id: string;
    email: string;
    exp: Date;
}

export interface authReq extends Request {
    decodedToken: DecodedToken;
}

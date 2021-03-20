import { Request, Response } from 'express';
import { EntityManager } from 'typeorm';
import { getConnection } from '../database/db';

export const asyncRunner = async (
    req: Request,
    res: Response,
    asyncFunction: (Request, Response, db: EntityManager) => Promise<any>,
) => {
    try {
        const db = await getConnection();
        await asyncFunction(req, res, db);
    } catch (e) {
        console.log('error', e);
        res.status(e.status ? e.status : 500).send({ error: e.message });
    }
};

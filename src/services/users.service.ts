import { Request, Response } from 'express';
import { EntityManager } from 'typeorm';
import { User } from '../entities/User';
import HttpError from '../exceptions/HttpException';
import { authReq } from '../interfaces/token.interface';
import { asyncRunner } from '../utils/async';
import { generateJWT, hashPassword, passwordMatch } from '../utils/encryption';
import { filterUndefined } from '../utils/other';

export default class UsersService {
    createUser = async (req: Request, res: Response) => {
        return asyncRunner(req, res, async (req: Request, res: Response, db: EntityManager) => {
            const {
                email,
                password,
                name,
                phone,
                fcmToken,
                isFlutter,
            }: { email: string; name: string; [key: string]: any } = req.body;
            if (!(email && password && name)) {
                throw new HttpError(400, 'Missing required fields email, password and name');
            }

            const existingUser = await db.findOne(User, { where: { email } });

            if (existingUser) {
                throw new HttpError(409, `A user with the email ${email} already exists`);
            }

            const hashPass = await hashPassword(password);
            let newUser = new User(
                name.trim(),
                email.toLowerCase(),
                hashPass,
                phone !== undefined ? phone.replace(/\s/g, '') : phone,
                fcmToken,
                isFlutter,
            );
            newUser = await db.save(newUser);

            res.status(201).send({
                token: generateJWT(newUser),
                email: newUser.email,
                name: newUser.name,
                phone: newUser.phone,
            });
        });
    };

    login = async (req: Request, res: Response) => {
        return asyncRunner(req, res, async (req: Request, res: Response, db: EntityManager) => {
            const { email, password, fcmToken, isFlutter }: { email: string; [key: string]: any } = req.body;

            if (!(email && password)) {
                throw new HttpError(400, 'Missing required fields email and password');
            }

            let user = await db.findOne(User, { where: { email: email.toLowerCase() } });

            if (!user) {
                throw new HttpError(404, `User does not exist`);
            }

            passwordMatch(password, user.password);

            res.send({
                token: generateJWT(user),
                email: user.email,
                name: user.name,
                phone: user.phone,
            });
        });
    };

    updateUser = async (req: authReq, res: Response) => {
        const userId = req.decodedToken?._id;
        if (!userId) return res.status(401).send('Unauthorized');

        return asyncRunner(req, res, async (req: Request, res: Response, db: EntityManager) => {
            let { name, phone, email }: { email: string; [key: string]: any } = req.body;

            if (!name && !phone && !email) {
                throw new HttpError(400, 'Missing required fields name or phone');
            }
            if (email) email = email.toLowerCase();

            const result = await db.update(User, { id: userId }, filterUndefined({ name, phone, email }));
            res.status(200).send(result.generatedMaps[0]);
        });
    };

    getCurrentUser = async (req: authReq, res: Response) => {
        res.send({ ...req.decodedToken });
    };
}

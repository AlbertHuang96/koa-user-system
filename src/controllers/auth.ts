import { Context } from 'koa';
import * as argon2 from 'argon2';
import { getManager } from 'typeorm';

import { User } from '../entity/user';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../constants';
import { UnauthorizedException } from '../exceptions';

export default class AuthController {
    public static async login(ctx: Context) {
        //ctx.body = 'Login controller';
        const userRepository = getManager().getRepository(User);

        const user = await userRepository
          .createQueryBuilder()
          .where({ name: ctx.request.body.name })
          .addSelect('User.password')
          .getOne();

        if (!user) {
            //ctx.status = 401;
            //ctx.body = { message: 'username does not exist' };
            throw new UnauthorizedException('username does not exist');
        } else if (await argon2.verify(user.password, ctx.request.body.password)) {
            ctx.status = 200;
            ctx.body = { token: jwt.sign({ id: user.id }, JWT_SECRET) };
        } else {
            //ctx.status = 401;
            //ctx.body = { message: 'wrong keyword' };
            throw new UnauthorizedException('incorrect keyword');
        }
    }

    public static async register(ctx: Context) {
        const userRepository = getManager().getRepository(User);

        const newUser = new User();
        newUser.name = ctx.request.body.name;
        newUser.email = ctx.request.body.email;
        newUser.password = await argon2.hash(ctx.request.body.password);

        const user = await userRepository.save(newUser);

        ctx.status = 201;
        ctx.body = user;
    }
}
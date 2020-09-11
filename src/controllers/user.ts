import { Context } from 'koa';
import { getManager } from 'typeorm';

import { NotFoundException, ForbiddenException } from '../exceptions';

import { User } from '../entity/user';

export default class UserController {
    public static async listUsers(ctx: Context) {
        const userRepository = getManager().getRepository(User);
        const users = await userRepository.find();

        ctx.status = 200;
        ctx.body = users;
    }

    public static async showUserDetail(ctx: Context) {
        const userRepository = getManager().getRepository(User);
        const user = await userRepository.findOne(+ctx.params.id);

        if (user) {
            ctx.status = 200;
            ctx.body = user;
        } else {
            //ctx.status = 404;
            throw new NotFoundException();
        }
    }

    public static async updateUser(ctx: Context) {
        const userID = +ctx.params.id;

        if (userID !== +ctx.state.user.id) {
            //ctx.status = 403;
            //ctx.body = { message: 'no permission' };
            //return;
            throw new ForbiddenException();
        }

        const userRepository = getManager().getRepository(User);
        await userRepository.update(userID, ctx.request.body);
        const updatedUser = await userRepository.findOne(userID);

        if (updatedUser) {
            ctx.status = 200;
            ctx.body = updatedUser;
        } else {
            //ctx.status = 404;
            throw new NotFoundException();
        }
    }

    public static async deleteUser(ctx: Context) {
        const userID = +ctx.params.id;

        if (userID !== +ctx.state.user.id) {
            //ctx.status = 403;
            //ctx.body = { message: 'no permission' };
            //return;
            throw new ForbiddenException();
        }

        const userRepository = getManager().getRepository(User);
        await userRepository.delete(userID);

        ctx.status = 204;
    }
}